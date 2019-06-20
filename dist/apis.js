'use strict';

System.register(['./utils'], function (_export, _context) {
  "use strict";

  var utils, addProductGroup, updateProductGroup, removeProductGroup, addProduct, updateProduct, removeProduct;
  return {
    setters: [function (_utils) {
      utils = _utils;
    }],
    execute: function () {
      _export('addProductGroup', addProductGroup = function addProductGroup(groupName, success, fail) {
        var toSend = { group_name: groupName };
        var url = utils.postgRestHost + 'product_group';
        utils.post(url, JSON.stringify(toSend)).then(function (res) {
          success();
        }).catch(function (e) {
          fail(e);
        });
      });

      _export('addProductGroup', addProductGroup);

      _export('updateProductGroup', updateProductGroup = function updateProductGroup(toBeUpdated, groupName, success, fail) {
        var toSend = { group_name: groupName };
        var url = utils.postgRestHost + 'product_group?group_name=eq.' + toBeUpdated;
        utils.update(url, JSON.stringify(toSend)).then(function (res) {
          var toSend1 = { product_group: groupName };
          var url1 = utils.postgRestHost + 'products?product_group=eq.' + toBeUpdated;
          utils.update(url1, JSON.stringify(toSend1)).then(function () {
            success();
          }).catch(function (e) {
            fail(e);
          });
        }).catch(function (e) {
          fail(e);
        });
      });

      _export('updateProductGroup', updateProductGroup);

      _export('removeProductGroup', removeProductGroup = function removeProductGroup(toBeRemoved, success, fail) {
        var url = utils.postgRestHost + 'product_group?group_name=eq.' + toBeRemoved;
        utils.remove(url).then(function () {
          var url1 = utils.postgRestHost + 'products?product_group=eq.' + toBeRemoved;
          utils.remove(url1).then(function () {
            success();
          }).catch(function (e) {
            fail(e);
          });
        }).catch(function (e) {
          fail(e);
        });
      });

      _export('removeProductGroup', removeProductGroup);

      _export('addProduct', addProduct = function addProduct(productGroup, productDesc, productId, comment, ingredient, success, fail) {
        var toSend = {
          product_id: productId,
          product_desc: productDesc,
          product_group: productGroup,
          comment: comment || null,
          ingredient: ingredient
        };
        var url = utils.postgRestHost + 'products';
        utils.post(url, JSON.stringify(toSend)).then(function (res) {
          success();
        }).catch(function (e) {
          fail(e);
        });
      });

      _export('addProduct', addProduct);

      _export('updateProduct', updateProduct = function updateProduct(originalId, productGroup, productDesc, productId, comment, ingredient, success, fail) {
        var toSend = {
          product_id: productId,
          product_desc: productDesc,
          product_group: productGroup,
          comment: comment || null,
          ingredient: ingredient
        };
        var url = utils.postgRestHost + 'products?product_id=eq.' + originalId;
        utils.update(url, JSON.stringify(toSend)).then(function (res) {
          success();
        }).catch(function (e) {
          fail(e);
        });
      });

      _export('updateProduct', updateProduct);

      _export('removeProduct', removeProduct = function removeProduct(id, success, fail) {
        var url = utils.postgRestHost + 'products?product_id=eq.' + id;
        utils.remove(url).then(function (res) {
          success();
        }).catch(function (e) {
          fail(e);
        });
      });

      _export('removeProduct', removeProduct);
    }
  };
});
//# sourceMappingURL=apis.js.map
