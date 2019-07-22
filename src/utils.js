import { appEvents } from 'app/core/core'

const hostname = window.location.hostname
export const postgRestHost = 'http://' + hostname + ':5436/'
export const influxHost = 'http://' + hostname + ':8086/'

export const post = (url, line) => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.onreadystatechange = handleResponse
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onerror = e => reject(e)
      xhr.send(line)
  
      function handleResponse () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // console.log('200');
            resolve(xhr.responseText)
          } else if (xhr.status === 204) {
            // console.log('204');
            resolve(xhr.responseText)
          } else if (xhr.status === 201) {
            resolve(xhr.responseText)
          } else {
            reject(xhr.responseText)
          }
        }
      }
    })
  }

export const remove = (url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('DELETE', url)
    xhr.onreadystatechange = handleResponse
    xhr.onerror = e => reject(e)
    xhr.send()

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // console.log('200');
          resolve(xhr.responseText)
        } else if (xhr.status === 204) {
          // console.log('204');
          resolve(xhr.responseText)
        } else {
          reject(this.statusText)
        }
      }
    }
  })
}

export const get = url => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onreadystatechange = handleResponse
    xhr.onerror = e => reject(e)
    xhr.send()

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText)
          resolve(res)
        } else {
          reject(this.statusText)
        }
      }
    }
  })
}

export const update = (url, line) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('PATCH', url)
    xhr.onreadystatechange = handleResponse
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");      
    xhr.onerror = e => reject(e)
    xhr.send(line)

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // console.log('200');
          resolve(xhr.responseText)
        } else if (xhr.status === 204) {
          // console.log('204');
          resolve(xhr.responseText)
        } else if (xhr.status === 201) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.responseText)
        }
      }
    }
  })
}

export const alert = (type, title, msg) => {
  appEvents.emit('alert-' + type, [title, msg])
}

export const showModal = (html, data) => {
  appEvents.emit('show-modal', {
    src: 'public/plugins/smart-factory-products-crud-table-panel/partials/' + html,
    modalClass: 'confirm-modal',
    model: data
  })
}

export const showLargeModal = (html, data) => {
  appEvents.emit('show-modal', {
    src: 'public/plugins/smart-factory-products-crud-table-panel/partials/' + html,
    modalClass: 'extra-large',
    model: data
  })
}

export const spaceCheck = str => {
  if (str[str.length - 1] === ' ') {
    str = str.slice(0, -1)
    return spaceCheck(str)
  }
  return str
}

export const successCallBack = (modalId, successMsg, ctrl) => {
  return () => {
    $(`#${modalId}`).trigger('click')
    alert('success', 'Success', successMsg)
    ctrl.refresh()
  }
}

export const failCallBack = (modalId, failMsg) => {
  return () => {
    $(`#${modalId}`).trigger('click')
    alert('error', 'Error', failMsg)
  }
}

export const getRestructuredProduct = (rawCols, rows) => {
  let data = []
  let cols = rawCols.reduce((arr, c) => {
    const col = c.text.toLowerCase()
    arr.push(col)
    return arr
  }, [])
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let serise = {}
    for (let k = 0; k < cols.length; k++) {
        const col = cols[k];
        serise[col] = row[k]
    }
    serise.ingredient = JSON.parse(serise.ingredient)
    data.push(serise)
  }
  return data
}

export const findProductById = (products, key) => {
  return products.filter(product => product.product_id === key)
}

export const findProductByDesc = (products, key) => {
  return products.filter(product => product.product_desc === key)
}

export const getDimension = cols => {
  return cols.map(col => col.text)
}

export const copy = obj => {
  return JSON.parse(JSON.stringify(obj)) 
}

export const hasObjectChanged = (oldObj, newObj) => {
  return JSON.stringify(oldObj) !== JSON.stringify(newObj)
}

export const getRestructuredData = (rawCols, rows) => {
  let data = []
  let cols = rawCols.reduce((arr, c) => {
    const col = c.text.toLowerCase()
    arr.push(col)
    return arr
  }, [])
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let serise = {}
    for (let k = 0; k < cols.length; k++) {
        const col = cols[k];
        serise[col] = row[k]
    }
    data.push(serise)
  }
  return data
}