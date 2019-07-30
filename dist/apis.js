'use strict';

System.register(['./utils'], function (_export, _context) {
  "use strict";

  var utils, addProductGroup, updateProductGroup, removeProductGroup, addProduct, updateProduct, removeProduct;


  function getMaterialsToSendList(product) {
    var materialsToSend = [];
    var apps = product.ingredient.applicators;
    for (var i = 0; i < apps.length; i++) {
      var app = apps[i];
      var operationId = app.operationId;
      for (var k = 0; k < app.materials.length; k++) {
        var mat = app.materials[k];
        materialsToSend.push({
          product_id: product.id,
          material_id: mat.materialId,
          operation_id: operationId,
          route_id: null,
          quantity: mat.oz,
          grams_on_scale: mat.gramsOnScale,
          grams_total: mat.gramsTotal,
          quantity_uom: 'Oz',
          sub_sequence_id: mat.seriseId
        });
      }
    }
    return materialsToSend;
  }

  function getProductToSend(product) {
    return {
      id: product.id,
      ingredient: product.ingredient,
      comment: product.comment,
      product_group: product.productGroup,
      product_desc: product.productDesc
    };
  }
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

      _export('updateProductGroup', updateProductGroup = function updateProductGroup(scope, toBeUpdated, groupName, success, fail) {
        var toSend = { group_name: groupName };
        var url = utils.postgRestHost + 'product_group?group_name=eq.' + toBeUpdated;
        utils.update(url, JSON.stringify(toSend)).then(function (res) {
          var toSend1 = { product_group: groupName };
          var url1 = utils.postgRestHost + 'product?product_group=eq.' + toBeUpdated;
          utils.update(url1, JSON.stringify(toSend1)).then(function () {
            scope.currentFilterGroup = groupName; // update the current filter so that the filter input will not be empty
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
        // first of all remove the product group
        var removeProductGroupurl = utils.postgRestHost + 'product_group?group_name=eq.' + toBeRemoved;
        utils.remove(removeProductGroupurl).then(function () {
          // then use the 'toberemoved' to get the product id
          var productsByGroupNameUrl = utils.postgRestHost + 'product?product_group=eq.' + toBeRemoved;
          utils.get(productsByGroupNameUrl).then(function (res) {
            var ids = res.map(function (x) {
              return x.id;
            });
            if (ids.length === 0) {
              //if cannot get anything
              success();
            } else {
              //if can get something
              // use the product group to remove the product
              utils.remove(productsByGroupNameUrl).then(function () {
                // use the product id to remove the material requirements
                var proimise = [];
                ids.forEach(function (id) {
                  proimise.push(utils.remove(utils.postgRestHost + 'material_requirement?product_id=eq.' + id));
                });
                Promise.all(proimise).then(function () {
                  success();
                }).catch(function (e) {
                  fail(e);
                });
              }).catch(function (e) {
                fail(e);
              });
            }
          }).catch(function (e) {
            fail(e);
          });
        }).catch(function (e) {
          fail(e);
        });
      });

      _export('removeProductGroup', removeProductGroup);

      _export('addProduct', addProduct = function addProduct(product, success, fail) {
        var productToSend = getProductToSend(product);
        var materialsToSend = getMaterialsToSendList(product);

        var url = utils.postgRestHost + 'product';
        var matUrl = utils.postgRestHost + 'material_requirement';
        utils.post(url, JSON.stringify(productToSend)).then(function () {
          utils.post(matUrl, JSON.stringify(materialsToSend)).then(function () {
            success();
          }).catch(function (e) {
            fail(e);
          });
        }).catch(function (e) {
          fail(e);
        });
      });

      _export('addProduct', addProduct);

      _export('updateProduct', updateProduct = function updateProduct(originalId, originalIngredient, product, success, fail) {
        var productToSend = getProductToSend(product);
        var productUrl = utils.postgRestHost + 'product?id=eq.' + originalId;

        if (!utils.hasObjectChanged(originalIngredient, product.ingredient) && originalId === product.id) {
          // ingredient not changed and id not changed just update the product table
          utils.update(productUrl, JSON.stringify(productToSend)).then(function () {
            success();
          }).catch(function (e) {
            fail(e);
          });
        } else {
          // ingredient changed, update the product table 
          // remove all material requirements that match the product id
          // re-insert the new material requirements
          var materialsToSend = getMaterialsToSendList(product);
          var deleteUrl = utils.postgRestHost + 'material_requirement?product_id=eq.' + originalId;
          var matUrl = utils.postgRestHost + 'material_requirement';
          var promise = [utils.update(productUrl, JSON.stringify(productToSend)), utils.remove(deleteUrl)];

          Promise.all(promise).then(function () {
            utils.post(matUrl, JSON.stringify(materialsToSend)).then(function () {
              success();
            }).catch(function (e) {
              fail(e);
            });
          }).catch(function (e) {
            fail(e);
          });
        }
      });

      _export('updateProduct', updateProduct);

      _export('removeProduct', removeProduct = function removeProduct(id, success, fail) {
        var url = utils.postgRestHost + 'product?id=eq.' + id;
        var matUrl = utils.postgRestHost + 'material_requirement?product_id=eq.' + id;

        var promise = [utils.remove(url), utils.remove(matUrl)];

        Promise.all(promise).then(function () {
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
