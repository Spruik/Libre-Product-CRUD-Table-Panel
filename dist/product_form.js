'use strict';

System.register(['lodash', './utils', './apis'], function (_export, _context) {
  "use strict";

  var _, utils, apis, _onAddApplicator, _onAddSubMaterial, isMaterialValid, addPreprocess, viewPreprocess, updatePreprocess, showAddProductFormModal, showViewProductFormModal, showUpdateProductFormModal, removeProduct;

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_utils) {
      utils = _utils;
    }, function (_apis) {
      apis = _apis;
    }],
    execute: function () {
      _onAddApplicator = function _onAddApplicator(scope) {
        var length = scope.productFormModal.ingredient.applicators.length;
        var maxApplicatorNum = 10;
        if (length >= maxApplicatorNum) {
          return;
        }
        var applicator = {
          id: length + 1,
          materials: [{
            seriseId: 1,
            materialId: "",
            oz: null,
            gramsOnScale: null,
            gramsTotal: null,
            tolerance: 0
          }]
        };
        scope.productFormModal.ingredient.applicators.push(applicator);
      };

      _onAddSubMaterial = function _onAddSubMaterial(scope, topId) {
        var length = scope.productFormModal.ingredient.applicators[topId - 1].materials.length;
        var maxMaterialNum = 5;
        if (length >= maxMaterialNum) {
          return;
        }
        var material = {
          seriseId: length + 1,
          materialId: "",
          oz: null,
          gramsOnScale: null,
          gramsTotal: null,
          tolerance: 0
        };

        scope.productFormModal.ingredient.applicators[topId - 1].materials.push(material);
      };

      isMaterialValid = function isMaterialValid(ingredient, materialsModelList) {
        var materials = [ingredient.crust.name, ingredient.sauce.name];
        ingredient.applicators.forEach(function (app) {
          app.materials.forEach(function (m) {
            materials.push(m.name);
          });
        });

        var diffItems = _.difference(materials, materialsModelList);
        if (diffItems.length !== 0) {
          utils.alert('warning', 'Material Not Exists', 'The material ' + diffItems[0] + ' does not exist, please either add it to the material list or select the exact item that the input field suggests');
          return false;
        }

        return true;
      };

      addPreprocess = function addPreprocess(scope) {
        //init data

        var group = scope.currentFilterGroup === 'All' ? scope.productGroups[0] || "" : scope.currentFilterGroup;

        scope.productFormModal = {
          productGroup: group,
          productId: null,
          productDesc: "",
          comment: "",
          ingredient: {
            crust: {
              name: "",
              oz: null,
              materialId: "",
              gramsOnScale: null,
              gramsTotal: null,
              tolerance: 0
            },
            sauce: {
              name: "",
              oz: null,
              materialId: "",
              gramsOnScale: null,
              gramsTotal: null,
              tolerance: 0
            },
            applicators: [{
              id: 1,
              materials: [{
                seriseId: 1,
                materialId: "",
                oz: null,
                gramsOnScale: null,
                gramsTotal: null,
                tolerance: 0
              }]
            }]
          },
          func: {
            onAddApplicator: function onAddApplicator() {
              _onAddApplicator(scope);
            },
            onRemoveApplicator: function onRemoveApplicator() {
              scope.productFormModal.ingredient.applicators.pop();
            },
            onAddSubMaterial: function onAddSubMaterial(topId) {
              _onAddSubMaterial(scope, topId);
            },
            onRemoveSubMaterial: function onRemoveSubMaterial(id) {
              scope.productFormModal.ingredient.applicators[id - 1].materials.pop();
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

          if (utils.findProductByDesc(scope.products, product.productDesc).length !== 0) {
            utils.alert('warning', 'Warning', 'Product With Product Description "' + product.productDesc + '" Already Exists');
            return;
          }

          if (!isMaterialValid(product.ingredient, scope.materialsDataList)) {
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
            onAddApplicator: function onAddApplicator() {
              _onAddApplicator(scope);
            },
            onRemoveApplicator: function onRemoveApplicator() {
              scope.productFormModal.ingredient.applicators.pop();
            },
            onAddSubMaterial: function onAddSubMaterial(topId) {
              _onAddSubMaterial(scope, topId);
            },
            onRemoveSubMaterial: function onRemoveSubMaterial(id) {
              scope.productFormModal.ingredient.applicators[id - 1].materials.pop();
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

          if (!isMaterialValid(product.ingredient, scope.materialsDataList)) {
            return;
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
