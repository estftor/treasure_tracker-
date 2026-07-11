import { chromium } from 'playwright'

const NAVIGATION_TIMEOUT_MS = 30_000

class ScraperError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}

function allowedHosts() {
  return (process.env.SALE_SCRAPER_ALLOWED_HOSTS || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)
}

function isAllowedHost(hostname) {
  return allowedHosts().some((host) => hostname === host || hostname.endsWith(`.${host}`))
}

function validateUrl(value) {
  if (allowedHosts().length === 0) {
    throw new ScraperError(
      'Sale scraping is not configured. Set SALE_SCRAPER_ALLOWED_HOSTS in the backend environment.',
      503,
    )
  }

  let url
  try {
    url = new URL(value)
  } catch {
    throw new ScraperError('Provide a valid URL.', 400)
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new ScraperError('Only public HTTP(S) URLs are supported.', 400)
  }

  if (!isAllowedHost(url.hostname.toLowerCase())) {
    throw new ScraperError('That website is not on the scraper allowlist.', 403)
  }

  return url
}

function shouldBlockRequest(request) {
  const resourceType = request.resourceType()
  return ['font', 'image', 'media'].includes(resourceType)
}

export async function scrapeSaleDetails(urlValue) {
  const requestedUrl = validateUrl(urlValue)
  const browser = await chromium.launch({ headless: true })

  try {
    const context = await browser.newContext({
      userAgent: 'TreasureTracker/1.0 (+sale details checker)',
      viewport: { width: 1440, height: 900 },
    })

    // Keep navigation on an explicitly permitted retailer domain. This avoids
    // turning the endpoint into a general-purpose internal-network fetcher.
    await context.route('**/*', async (route) => {
      const request = route.request()
      const requestUrl = new URL(request.url())

      if (!isAllowedHost(requestUrl.hostname.toLowerCase()) || shouldBlockRequest(request)) {
        await route.abort()
        return
      }

      await route.continue()
    })

    const page = await context.newPage()
    await page.goto(requestedUrl.toString(), {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT_MS,
    })

    validateUrl(page.url()) // Also validate the final URL after redirects.

    const details = await page.evaluate(() => {
      const normalize = (value) => value?.replace(/\s+/g, ' ').trim() || null
      const firstText = (selectors) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector)
          const value = normalize(element?.getAttribute('content') || element?.textContent)
          if (value) return value
        }
        return null
      }
      const meta = (name) => normalize(
        document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)?.getAttribute('content'),
      )
      const readJsonLd = () => {
        const values = []
        document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
          try {
            const parsed = JSON.parse(script.textContent)
            values.push(...(Array.isArray(parsed) ? parsed : [parsed]))
          } catch {
            // Invalid JSON-LD should not stop extraction from the page.
          }
        })
        return values
      }
      const findProduct = (values) => {
        const queue = [...values]
        while (queue.length) {
          const value = queue.shift()
          if (!value || typeof value !== 'object') continue
          const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']]
          if (types.includes('Product')) return value
          Object.values(value).forEach((child) => {
            if (child && typeof child === 'object') queue.push(child)
          })
        }
        return null
      }

      const product = findProduct(readJsonLd())
      const offer = Array.isArray(product?.offers) ? product.offers[0] : product?.offers
      const saleSignals = [...document.querySelectorAll('[class*="sale" i], [class*="deal" i], [class*="discount" i], [data-testid*="sale" i]')]
        .map((element) => normalize(element.textContent))
        .filter(Boolean)
        .slice(0, 3)

      return {
        title: product?.name || meta('og:title') || normalize(document.title),
        description: product?.description || meta('og:description') || meta('description'),
        price: String(offer?.price || offer?.lowPrice || firstText([
          '[itemprop="price"]',
          '[data-testid*="price" i]',
          '[class*="sale-price" i]',
          '[class*="current-price" i]',
        ]) || '') || null,
        originalPrice: firstText([
          '[data-testid*="original-price" i]',
          '[class*="original-price" i]',
          '[class*="was-price" i]',
          '[class*="list-price" i]',
        ]),
        currency: offer?.priceCurrency || meta('product:price:currency'),
        availability: offer?.availability || firstText(['[itemprop="availability"]']),
        saleSignals,
      }
    })

    await context.close()
    return { url: page.url(), ...details }
  } catch (error) {
    if (error instanceof ScraperError) throw error
    throw new ScraperError(`Unable to scrape sale details: ${error.message}`, 502)
  } finally {
    await browser.close()
  }
}

export { ScraperError }
