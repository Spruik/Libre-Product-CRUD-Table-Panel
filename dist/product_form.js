'use strict';

System.register(['./utils', './apis'], function (_export, _context) {
  "use strict";

  var utils, apis, _onAddTopping, addPreprocess, viewPreprocess, updatePreprocess, showAddProductFormModal, showViewProductFormModal, showUpdateProductFormModal, removeProduct;

  return {
    setters: [function (_utils) {
      utils = _utils;
    }, function (_apis) {
      apis = _apis;
    }],
    execute: function () {
      _onAddTopping = function _onAddTopping(scope) {
        var length = scope.productFormModal.ingredient.toppings.length;
        if (length >= 6) {
          return;
        }
        var topping = {
          id: length + 1,
          name: "",
          oz: null,
          gramsOnScale: null,
          gramsTotal: null
        };
        scope.productFormModal.ingredient.toppings.push(topping);
      };

      addPreprocess = function addPreprocess(scope) {
        //init data
        scope.productFormModal = {
          productGroup: scope.productGroups[0] || "",
          productId: null,
          productDesc: "",
          comment: "",
          ingredient: {
            crust: {
              name: "",
              oz: null,
              gramsOnScale: null,
              gramsTotal: null
            },
            sauce: {
              name: "",
              oz: null,
              gramsOnScale: null,
              gramsTotal: null
            },
            toppings: [{
              id: 1,
              name: "",
              oz: null,
              gramsOnScale: null,
              gramsTotal: null
            }]
          },
          func: {
            onAddTopping: function onAddTopping() {
              _onAddTopping(scope);
            },
            onRemoveTopping: function onRemoveTopping() {
              scope.productFormModal.ingredient.toppings.pop();
            }
          },
          submitBtnMsg: 'Submit'
        };

        scope.productFormModal.func.onSubmit = function () {
          var product = scope.productFormModal;

          if (utils.findProductById(scope.products, product.productId).length !== 0) {
            utils.alert('warning', 'Warning', 'Product With Product ID "' + product.productId + '" Already Exists');
            return;
          }

          apis.addProduct(product.productGroup, product.productDesc, product.productId, product.comment, product.ingredient, utils.successCallBack('pct-product-form-cancelBtn', 'Product Has Been Added Successfully', scope), function (e) {
            return utils.failCallBack('pct-product-form-cancelBtn', 'An Error Occurr While Adding The Product Due To ' + e);
          });
        };
      };

      viewPreprocess = function viewPreprocess(scope) {
        var cur = scope.currentProduct;
        scope.productFormViewModal = {
          productGroup: cur.product_group,
          productId: cur.product_id,
          productDesc: cur.product_desc,
          comment: cur.comment || "",
          ingredient: cur.ingredient
        };
      };

      updatePreprocess = function updatePreprocess(scope) {

        var cur = scope.currentProduct;

        scope.productFormModal = {
          productGroup: cur.product_group,
          productId: cur.product_id,
          productDesc: cur.product_desc,
          comment: cur.comment || "",
          ingredient: cur.ingredient,
          func: {
            onAddTopping: function onAddTopping() {
              _onAddTopping(scope);
            },
            onRemoveTopping: function onRemoveTopping() {
              scope.productFormModal.ingredient.toppings.pop();
            }
          },
          submitBtnMsg: 'Update'
        };

        scope.tempProductForm = utils.copy(scope.productFormModal);

        scope.productFormModal.func.onSubmit = function () {

          var product = scope.productFormModal;
          var match = utils.findProductById(scope.products, product.productId);

          //Check if make any changes
          if (!utils.hasObjectChanged(scope.tempProductForm, product)) {
            utils.alert('warning', 'Warning', 'You Did Not Make Any Changes On It');
            return;
          }

          //Check if id is invalid
          if (match.length !== 0) {
            if (match[0].product_id !== cur.product_id) {
              utils.alert('warning', 'Warning', 'Product With Product ID "' + product.productId + '" Already Exists');
              return;
            }
          }

          apis.updateProduct(cur.product_id, product.productGroup, product.productDesc, product.productId, product.comment, product.ingredient, utils.successCallBack('pct-product-form-cancelBtn', 'Product Has Been Updated Successfully', scope), function (e) {
            return utils.failCallBack('pct-product-form-cancelBtn', 'An Error Occurr While Updating The Product Due To ' + e);
          });
        };
      };

      _export('showAddProductFormModal', showAddProductFormModal = function showAddProductFormModal(scope) {
        addPreprocess(scope);
        utils.showLargeModal('product_form.html', scope);
      });

      _export('showAddProductFormModal', showAddProductFormModal);

      _export('showViewProductFormModal', showViewProductFormModal = function showViewProductFormModal(scope) {
        viewPreprocess(scope);
        utils.showLargeModal('product_form_view.html', scope);
      });

      _export('showViewProductFormModal', showViewProductFormModal);

      _export('showUpdateProductFormModal', showUpdateProductFormModal = function showUpdateProductFormModal(scope) {
        updatePreprocess(scope);
        utils.showLargeModal('product_form.html', scope);
      });

      _export('showUpdateProductFormModal', showUpdateProductFormModal);

      _export('removeProduct', removeProduct = function removeProduct(scope) {
        var id = scope.currentProduct.product_id;
        scope.confirmModal = {
          confirmMsg: 'Please confirm that you want to remove product ' + id,
          onConfirm: function onConfirm() {
            apis.removeProduct(id, utils.successCallBack('pct-confirm-modal-cancelBtn', 'Product ' + id + ' Has Been Removed Successfully', scope), function (e) {
              return utils.failCallBack('pct-confirm-modal-cancelBtn', 'An Error Occurr While Removing The Product Due To ' + e);
            });
          }
        };
        utils.showModal('confirm_modal.html', scope);
      });

      _export('removeProduct', removeProduct);
    }
  };
});
//# sourceMappingURL=product_form.js.map
