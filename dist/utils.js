'use strict';

System.register(['app/core/core'], function (_export, _context) {
  "use strict";

  var appEvents, hostname, postgRestHost, influxHost, post, remove, get, update, alert, showModal, showLargeModal, spaceCheck, successCallBack, failCallBack, getRestructuredProduct, findProductById, findProductByDesc, getDimension, copy, hasObjectChanged, getRestructuredData;
  return {
    setters: [function (_appCoreCore) {
      appEvents = _appCoreCore.appEvents;
    }],
    execute: function () {
      hostname = window.location.hostname;

      _export('postgRestHost', postgRestHost = 'http://' + hostname + ':5436/');

      _export('postgRestHost', postgRestHost);

      _export('influxHost', influxHost = 'http://' + hostname + ':8086/');

      _export('influxHost', influxHost);

      _export('post', post = function post(url, line) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.onreadystatechange = handleResponse;
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onerror = function (e) {
            return reject(e);
          };
          xhr.send(line);

          function handleResponse() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // console.log('200');
                resolve(xhr.responseText);
              } else if (xhr.status === 204) {
                // console.log('204');
                resolve(xhr.responseText);
              } else if (xhr.status === 201) {
                resolve(xhr.responseText);
              } else {
                reject(xhr.responseText);
              }
            }
          }
        });
      });

      _export('post', post);

      _export('remove', remove = function remove(url) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('DELETE', url);
          xhr.onreadystatechange = handleResponse;
          xhr.onerror = function (e) {
            return reject(e);
          };
          xhr.send();

          function handleResponse() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // console.log('200');
                resolve(xhr.responseText);
              } else if (xhr.status === 204) {
                // console.log('204');
                resolve(xhr.responseText);
              } else {
                reject(this.statusText);
              }
            }
          }
        });
      });

      _export('remove', remove);

      _export('get', get = function get(url) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.onreadystatechange = handleResponse;
          xhr.onerror = function (e) {
            return reject(e);
          };
          xhr.send();

          function handleResponse() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                resolve(res);
              } else {
                reject(this.statusText);
              }
            }
          }
        });
      });

      _export('get', get);

      _export('update', update = function update(url, line) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('PATCH', url);
          xhr.onreadystatechange = handleResponse;
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onerror = function (e) {
            return reject(e);
          };
          xhr.send(line);

          function handleResponse() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // console.log('200');
                resolve(xhr.responseText);
              } else if (xhr.status === 204) {
                // console.log('204');
                resolve(xhr.responseText);
              } else if (xhr.status === 201) {
                resolve(xhr.responseText);
              } else {
                reject(xhr.responseText);
              }
            }
          }
        });
      });

      _export('update', update);

      _export('alert', alert = function alert(type, title, msg) {
        appEvents.emit('alert-' + type, [title, msg]);
      });

      _export('alert', alert);

      _export('showModal', showModal = function showModal(html, data) {
        appEvents.emit('show-modal', {
          src: 'public/plugins/libre-product-crud-table-panel/partials/' + html,
          modalClass: 'confirm-modal',
          model: data
        });
      });

      _export('showModal', showModal);

      _export('showLargeModal', showLargeModal = function showLargeModal(html, data) {
        appEvents.emit('show-modal', {
          src: 'public/plugins/libre-product-crud-table-panel/partials/' + html,
          modalClass: 'extra-large',
          model: data
        });
      });

      _export('showLargeModal', showLargeModal);

      _export('spaceCheck', spaceCheck = function spaceCheck(str) {
        if (str[str.length - 1] === ' ') {
          str = str.slice(0, -1);
          return spaceCheck(str);
        }
        return str;
      });

      _export('spaceCheck', spaceCheck);

      _export('successCallBack', successCallBack = function successCallBack(modalId, successMsg, ctrl) {
        return function () {
          $('#' + modalId).trigger('click');
          alert('success', 'Success', successMsg);
          ctrl.refresh();
        };
      });

      _export('successCallBack', successCallBack);

      _export('failCallBack', failCallBack = function failCallBack(modalId, failMsg) {
        return function () {
          $('#' + modalId).trigger('click');
          alert('error', 'Error', failMsg);
        };
      });

      _export('failCallBack', failCallBack);

      _export('getRestructuredProduct', getRestructuredProduct = function getRestructuredProduct(rawCols, rows) {
        var data = [];
        var cols = rawCols.reduce(function (arr, c) {
          var col = c.text.toLowerCase();
          arr.push(col);
          return arr;
        }, []);
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var serise = {};
          for (var k = 0; k < cols.length; k++) {
            var col = cols[k];
            serise[col] = row[k];
          }
          serise.ingredient = JSON.parse(serise.ingredient);
          data.push(serise);
        }
        return data;
      });

      _export('getRestructuredProduct', getRestructuredProduct);

      _export('findProductById', findProductById = function findProductById(products, key) {
        return products.filter(function (product) {
          return product.id === key;
        });
      });

      _export('findProductById', findProductById);

      _export('findProductByDesc', findProductByDesc = function findProductByDesc(products, key) {
        return products.filter(function (product) {
          return product.product_desc === key;
        });
      });

      _export('findProductByDesc', findProductByDesc);

      _export('getDimension', getDimension = function getDimension(cols) {
        return cols.map(function (col) {
          return col.text;
        });
      });

      _export('getDimension', getDimension);

      _export('copy', copy = function copy(obj) {
        return JSON.parse(JSON.stringify(obj));
      });

      _export('copy', copy);

      _export('hasObjectChanged', hasObjectChanged = function hasObjectChanged(oldObj, newObj) {
        return JSON.stringify(oldObj) !== JSON.stringify(newObj);
      });

      _export('hasObjectChanged', hasObjectChanged);

      _export('getRestructuredData', getRestructuredData = function getRestructuredData(rawCols, rows) {
        var data = [];
        var cols = rawCols.reduce(function (arr, c) {
          var col = c.text.toLowerCase();
          arr.push(col);
          return arr;
        }, []);
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var serise = {};
          for (var k = 0; k < cols.length; k++) {
            var col = cols[k];
            serise[col] = row[k];
          }
          data.push(serise);
        }
        return data;
      });

      _export('getRestructuredData', getRestructuredData);
    }
  };
});
//# sourceMappingURL=utils.js.map
