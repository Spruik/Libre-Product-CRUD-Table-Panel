import { appEvents } from 'app/core/core'

const hostname = window.location.hostname
const postgRestHost = 'http://' + hostname + ':5436/'
const influxHost = 'http://' + hostname + ':8086/'

let post = (url, line) => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.onreadystatechange = handleResponse
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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

  let remove = (url) => {
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

  let get = url => {
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

  let update = (url, line) => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest()
      xhr.open('PATCH', url)
      xhr.onreadystatechange = handleResponse
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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

  const alert = (type, title, msg) => {
    appEvents.emit('alert-' + type, [title, msg])
  }

  const showModal = (html, data) => {
    appEvents.emit('show-modal', {
      src: 'public/plugins/smart-factory-products-crud-table-panel/partials/' + html,
      modalClass: 'confirm-modal',
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

  export { post, get, postgRestHost, influxHost, alert, showModal, remove, update }