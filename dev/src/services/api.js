import qs from 'query-string'
import axios from 'axios'
import store from './store'

// TODO: change based on dev environment
const server = ''

/**
 * Get users from the server
 */
export async function getUsers () {
  const response = await fetch(`${server}/api/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

/**
 * Get requests from the server
 * @param {number} [page] Pagination result, defaults to 0
 */
export async function getRequests (page) {
  if (page) {
    page = page - 1
  } else {
    page = 0
  }
  const response = await fetch(`${server}/api/requests?${qs.stringify({page})}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function getRequest (id) {
  const response = await fetch(`${server}/api/request/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  } else {
    return null
  }
}

/**
 * Uploads a request to the server. If no method type specified, uses a post request
 * @param {string} item item of the request
 * @param {string} description description of the request
 * @param {string} [method] Method type, either 'POST' or 'PUT'
 */
export async function uploadRequest (item, description, method = 'POST') {
  return axios({
    method: 'POST',
    url: `${server}/api/request`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    data: {
      item, description
    }
  })
}

export async function putRequest (id, item, description) {
  return axios({
    method: 'PUT',
    url: `${server}/api/request/${id}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    data: {
      item, description
    }
  })
}

export async function deleteRequest (id) {
  const response = await fetch(`${server}/api/request/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return true
  }
}

export async function getUsersSearchAutocomplete (search) {
  const results = await fetch(`${server}/api/users/autocomplete?${qs.stringify({ search })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  return results.json()
}

export async function postItem (form) {
  const response = await fetch(`${server}/api/item`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    },
    body: form
  })
  if (response.ok) {
    return response.json()
  }
}

export async function postItemImage (id, form) {
  if (!id || !form) {
    throw new Error('id needed')
  }
  const response = await fetch(`${server}/api/item/${id}/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    },
    body: form
  })
  if (response.ok) {
    return response.json()
  }
}

export async function getItems (search = null) {
  const response = await fetch(`${server}/api/items?${qs.stringify({ page: 0, search })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function getItem (id) {
  const response = await fetch(`${server}/api/item/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function putItem (id, name, description, status) {
  const response = await fetch(`${server}/api/item/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({
      name, description, status
    })
  })
  if (response.ok) {
    return response.json()
  }
}

export async function getItemComments (id) {
  const response = await fetch(`${server}/api/item/${id}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function getItemLogs (id) {
  const response = await fetch(`${server}/api/item/${id}/logs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function postItemComment (id, comment) {
  const response = await fetch(`${server}/api/item/${id}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({
      comment
    })
  })
  if (response.ok) {
    return response.json()
  }
}

export async function postItemRequest (id) {
  const response = await fetch(`${server}/api/item/${id}/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({
      set: true
    })
  })
  if (response.ok) {
    return true
  }
}

export async function postItemCancelRequest (id) {
  const response = await fetch(`${server}/api/item/${id}/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({
      set: false
    })
  })
  if (response.ok) {
    return true
  }
}

export async function postItemPickup (id, date, comments) {
  const response = await fetch(`${server}/api/item/${id}/log/pickup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({
      date,
      comments
    })
  })
  if (response.ok) {
    return response.json()
  }
}

export async function postItemDropoff (id, date, toUser, comments) {
  const response = await fetch(`${server}/api/item/${id}/log/dropoff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({
      date,
      toUser,
      comments
    })
  })
  if (response.ok) {
    return response.json()
  }
}

export async function postItemLogComment (id, comments) {
  const response = await fetch(`${server}/api/item/${id}/log/talk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({
      comments: comments
    })
  })
  if (response.ok) {
    return response.json()
  }
}

export async function getNotifications () {
  const response = await fetch(`${server}/api/notifications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function getLikes (itemId) {
  const response = await fetch(`${server}/api/item/${itemId}/likes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function postLike (itemId) {
  const response = await fetch(`${server}/api/item/${itemId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function dismissNotification (notificationId) {
  const response = await fetch(`${server}/api/notification/${notificationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    },
    body: JSON.stringify({
      dismiss: true
    })
  })
  if (response.ok) {
    return response.json()
  }
}

export async function deleteImage (imageId) {
  const response = await fetch(`${server}/api/image/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}

export async function deleteItemLog (itemId, logId) {
  const response = await fetch(`${server}/api/item/${itemId}/logs/${logId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.state.token}`
    }
  })
  if (response.ok) {
    return response.json()
  }
}
