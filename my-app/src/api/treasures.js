async function treasureRequest(path, accessToken, options = {}) {
  const response = await fetch(`/api/treasures${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })

  if (response.status === 204) return null

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.')
  }

  return data
}

export function getTreasures(accessToken) {
  return treasureRequest('', accessToken)
}

export function createTreasure(accessToken, treasure) {
  return treasureRequest('', accessToken, {
    method: 'POST',
    body: JSON.stringify(treasure),
  })
}

export function deleteTreasure(accessToken, treasureId) {
  return treasureRequest(`/${treasureId}`, accessToken, {
    method: 'DELETE',
  })
}