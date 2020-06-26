'use strict';

System.register(['lodash', './utils', './apis'], function (_export, _context) {
  "use strict";

  var _, utils, apis, _onAddApplicator, _onAddSubMaterial, isMaterialValid, matchOperation, updateGramsTotalAccumulatively, reducerGramsOnScale, reducerTolerance, getSumByKey, updateTargetNum, matchMaterial, addPreprocess, viewPreprocess, updatePreprocess, showAddProductFormModal, showViewProductFormModal, showUpdateProductFormModal, removeProduct;

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
          operation: '',
          operationSeq: null,
          operationId: null,
          targetGOS: null,
          targetTol: 0,
          materials: [{
            seriseId: 1,
            materialId: '',
            oz: null,
            gramsOnScale: null,
            gramsTotal: null,
            tolerance: 0,
            meta: {
              isTotalReadOnly: true
            }
          }]
        };
        scope.productFormModal.ingredient.applicators.push(applicator);
      };

      _onAddSubMaterial = function _onAddSubMaterial(scope, topId) {
        var length = scope.productFormModal.ingredient.applicators[topId - 1].materials.length;
        var maxMaterialNum = 8;
        if (length >= maxMaterialNum) {
          return;
        }
        var material = {
          seriseId: length + 1,
          materialId: '',
          oz: null,
          gramsOnScale: null,
          gramsTotal: null,
          tolerance: 0,
          meta: {
            isTotalReadOnly: true
          }
        };

        scope.productFormModal.ingredient.applicators[topId - 1].materials.push(material);
      };

      isMaterialValid = function isMaterialValid(ingredient, materialsModelList) {
        var materials = [];
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

      matchOperation = function matchOperation(scope, val, toGet) {
        if (toGet === 'id') {
          return scope.operationSeq.filter(function (x) {
            return x.name === val;
          })[0].id;
        } else if (toGet === 'seq') {
          return scope.operationSeq.filter(function (x) {
            return x.name === val;
          })[0].sequence;
        } else {
          return 0;
        }
      };

      updateGramsTotalAccumulatively = function updateGramsTotalAccumulatively(form) {
        if (!form.isTotalCalcOn) {
          return;
        }
        var apps = form.ingredient.applicators;
        if (!apps) {
          return;
        }

        var arr = [];
        for (var i = 0; i < apps.length; i++) {
          var item = apps[i];
          for (var k = 0; k < item.materials.length; k++) {
            var mat = item.materials[k];
            var reducer = function reducer(num, x) {
              return num + x;
            };
            mat.gramsTotal = Number((mat.gramsOnScale + Number(arr.reduce(reducer, 0).toFixed(2))).toFixed(2));
            arr.push(mat.gramsOnScale);
          }
        }
      };

      reducerGramsOnScale = function reducerGramsOnScale(num, x) {
        return num + x.gramsOnScale || 0;
      };

      reducerTolerance = function reducerTolerance(num, x) {
        return num + x.tolerance || 0;
      };

      getSumByKey = function getSumByKey(app, key, form) {
        if (key === 'gos') {
          updateGramsTotalAccumulatively(form);
          return Number(app.materials.reduce(reducerGramsOnScale, 0).toFixed(2));
        } else if (key === 'tol') {
          return Number(app.materials.reduce(reducerTolerance, 0).toFixed(2));
        } else {
          return 0;
        }
      };

      updateTargetNum = function updateTargetNum(app) {
        app.targetGOS = Number(app.materials.reduce(reducerGramsOnScale, 0).toFixed(2));
        app.targetTol = Number(app.materials.reduce(reducerTolerance, 0).toFixed(2));
      };

      matchMaterial = function matchMaterial(scope, val) {
        if (val === undefined || val === null) return 0;
        var name = val.split(' | ')[0];
        var desc = val.split(' | ')[1];
        var target = scope.materials.filter(function (x) {
          return x.name === name && x.description === desc;
        })[0];
        return target ? target.id : 0;
      };

      addPreprocess = function addPreprocess(scope) {
        // init data

        var group = scope.currentFilterGroup === 'All' ? scope.productGroups[0] || '' : scope.currentFilterGroup;

        scope.productFormModal = {
          isTotalCalcOn: true,
          productGroup: group,
          id: null,
          productDesc: '',
          comment: '',
          ingredient: {
            applicators: [{
              id: 1,
              operation: '',
              operationSeq: null,
              operationId: null,
              targetGOS: null,
              targetTol: 0,
              materials: [{
                seriseId: 1,
                materialId: '',
                oz: null,
                gramsOnScale: null,
                gramsTotal: null,
                tolerance: 0,
                meta: {
                  isTotalReadOnly: true
                }
              }]
            }]
          },
          func: {
            onAddApplicator: function onAddApplicator() {
              _onAddApplicator(scope);
            },
            onRemoveApplicator: function onRemoveApplicator() {
              var apps = scope.productFormModal.ingredient.applicators;
              apps.pop();
              updateGramsTotalAccumulatively(scope.productFormModal);
            },
            onAddSubMaterial: function onAddSubMaterial(topId) {
              _onAddSubMaterial(scope, topId);
            },
            onRemoveSubMaterial: function onRemoveSubMaterial(id) {
              var apps = scope.productFormModal.ingredient.applicators;
              apps[id - 1].materials.pop();
              updateGramsTotalAccumulatively(scope.productFormModal);
              updateTargetNum(apps[id - 1]);
            },
            onOperationChanged: function onOperationChanged(val, toGet) {
              return matchOperation(scope, val, toGet);
            },
            onScaleChanged: function onScaleChanged(applicator, key) {
              return getSumByKey(applicator, key, scope.productFormModal);
            },
            onTotalCheckChanged: function onTotalCheckChanged() {
              updateGramsTotalAccumulatively(scope.productFormModal);
            },
            onMaterialChanged: function onMaterialChanged(val) {
              return matchMaterial(scope, val);
            },
            toFixed: function toFixed(val) {
              if (val === undefined || val === null) return;
              return Number(val.toFixed(2));
            }
          },
          submitBtnMsg: 'Submit'
        };

        scope.productFormModal.func.onSubmit = function () {
          var product = scope.productFormModal;

          if (!product.ingredient.applicators) {
            utils.alert('warning', 'Warning', 'No material can be found on this product');
            return;
          }

          var selectedOperations = scope.productFormModal.ingredient.applicators.map(function (x) {
            return x.operation;
          });
          var setArr = Array.from(new Set(selectedOperations));
          if (selectedOperations.length !== setArr.length) {
            utils.alert('warning', 'Warning', '`The same operation CANNOT be selected TWICE!');
            return;
          }

          if (scope.products) {
            if (utils.findProductById(scope.products, product.id).length !== 0) {
              utils.alert('warning', 'Warning', 'Product With Product ID "' + product.id + '" Already Exists');
              return;
            }

            if (utils.findProductByDesc(scope.products, product.productDesc).length !== 0) {
              utils.alert('warning', 'Warning', 'Product With Product Description "' + product.productDesc + '" Already Exists');
              return;
            }
          }

          if (!isMaterialValid(product.ingredient, scope.materialsDataList)) {
            return;
          }

          apis.addProduct(product, utils.successCallBack('pct-product-form-cancelBtn', 'Product Has Been Added Successfully', scope), function (e) {
            return utils.failCallBack('pct-product-form-cancelBtn', 'An Error Occurr While Adding The Product Due To ' + e);
          });
        };
      };

      viewPreprocess = function viewPreprocess(scope) {
        var cur = scope.currentProduct;
        scope.productFormViewModal = {
          productGroup: cur.product_group,
          productId: cur.id,
          productDesc: cur.product_desc,
          comment: cur.comment || '',
          ingredient: cur.ingredient
        };
      };

      updatePreprocess = function updatePreprocess(scope) {
        var cur = utils.copy(scope.currentProduct);

        scope.productFormModal = {
          isTotalCalcOn: true,
          productGroup: cur.product_group,
          id: cur.id,
          productDesc: cur.product_desc,
          comment: cur.comment || '',
          ingredient: cur.ingredient,
          func: {
            onAddApplicator: function onAddApplicator() {
              _onAddApplicator(scope);
            },
            onRemoveApplicator: function onRemoveApplicator() {
              var apps = scope.productFormModal.ingredient.applicators;
              apps.pop();
              updateGramsTotalAccumulatively(scope.productFormModal);
            },
            onAddSubMaterial: function onAddSubMaterial(topId) {
              _onAddSubMaterial(scope, topId);
            },
            onRemoveSubMaterial: function onRemoveSubMaterial(id) {
              var apps = scope.productFormModal.ingredient.applicators;
              apps[id - 1].materials.pop();
              updateGramsTotalAccumulatively(scope.productFormModal);
              updateTargetNum(apps[id - 1]);
            },
            onOperationChanged: function onOperationChanged(val, toGet) {
              return matchOperation(scope, val, toGet);
            },
            onScaleChanged: function onScaleChanged(applicator, key) {
              return getSumByKey(applicator, key, scope.productFormModal);
            },
            onTotalCheckChanged: function onTotalCheckChanged() {
              updateGramsTotalAccumulatively(scope.productFormModal);
            },
            onMaterialChanged: function onMaterialChanged(val) {
              return matchMaterial(scope, val);
            },
            toFixed: function toFixed(val) {
              if (val === undefined || val === null) return;
              return Number(val.toFixed(2));
            }
          },
          submitBtnMsg: 'Update'
        };

        scope.tempProductForm = utils.copy(scope.productFormModal);

        scope.productFormModal.func.onSubmit = function () {
          var product = scope.productFormModal;
          var match = utils.findProductById(scope.products, product.id);

          // Check if make any changes
          if (!utils.hasObjectChanged(scope.tempProductForm, product)) {
            utils.alert('warning', 'Warning', 'You Did Not Make Any Changes On It');
            return;
          }

          // check if there is any operation selected twice
          var selectedOperations = scope.productFormModal.ingredient.applicators.map(function (x) {
            return x.operation;
          });
          var setArr = Array.from(new Set(selectedOperations));
          if (selectedOperations.length !== setArr.length) {
            utils.alert('warning', 'Warning', 'The same operation CANNOT be selected TWICE!');
            return;
          }

          // Check if id is invalid
          if (match.length !== 0) {
            if (match[0].id !== cur.id) {
              utils.alert('warning', 'Warning', 'Product With Product ID "' + product.id + '" Already Exists');
              return;
            }
          }

          if (!isMaterialValid(product.ingredient, scope.materialsDataList)) {
            return;
          }

          apis.updateProduct(cur.id, scope.tempProductForm.ingredient, product, utils.successCallBack('pct-product-form-cancelBtn', 'Product Has Been Updated Successfully', scope), function (e) {
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
        var id = scope.currentProduct.id;
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
