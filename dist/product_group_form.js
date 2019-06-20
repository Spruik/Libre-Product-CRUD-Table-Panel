'use strict';

System.register(['./utils', './apis'], function (_export, _context) {
  "use strict";

  var utils, apis, addPreprocess, updatePreprocess, removePreprocess, showAddProductGroupFormModal, showUpdateProductGroupFormModal, showRemoveProductGroupFormModal;
  return {
    setters: [function (_utils) {
      utils = _utils;
    }, function (_apis) {
      apis = _apis;
    }],
    execute: function () {
      addPreprocess = function addPreprocess(scope) {

        scope.productGroupFormModal = {
          groupName: "",
          action: 'add'
        };

        scope.productGroupFormModal.onSubmit = function () {
          apis.addProductGroup(scope.productGroupFormModal.groupName, utils.successCallBack('pct-product-group-form-cancelBtn', 'Product Group Has Been Added Successfully', scope), function (e) {
            return utils.failCallBack('pct-product-group-form-cancelBtn', 'An Error Occurr While Adding The Product Group Due To ' + e);
          });
        };
      };

      updatePreprocess = function updatePreprocess(scope) {

        scope.productGroupFormModal = {
          groupName: "",
          action: 'update',
          toBeUpdated: scope.productGroups[0] || ""
        };

        scope.productGroupFormModal.onUpdate = function () {
          var toBeUpdated = scope.productGroupFormModal.toBeUpdated;
          var groupName = scope.productGroupFormModal.groupName;
          if (groupName === "") {
            utils.alert('warning', 'Warning', 'The new group name cannot be empty');
          } else if (toBeUpdated === groupName) {
            utils.alert('warning', 'Warning', 'The new group name is the same with the original one');
          } else {
            //Validation OK!
            scope.confirmModal = {
              confirmMsg: "Please note that after changing the name of this product group, all its children's product group name will also be changed",
              onConfirm: function onConfirm() {
                apis.updateProductGroup(toBeUpdated, groupName, utils.successCallBack('pct-confirm-modal-cancelBtn', 'Product Group Has Been Updated Successfully', scope), function (e) {
                  return utils.failCallBack('pct-confirm-modal-cancelBtn', 'An Error Occurr While Updating The Product Group Due To ' + e);
                });
              }
            };
            utils.showModal('confirm_modal.html', scope);
          }
        };
      };

      removePreprocess = function removePreprocess(scope) {

        scope.productGroupFormModal = {
          action: 'remove',
          toBeRemoved: scope.productGroups[0] || ""
        };

        scope.productGroupFormModal.onRemove = function () {
          var toBeRemoved = scope.productGroupFormModal.toBeRemoved;
          scope.confirmModal = {
            confirmMsg: "Please note that after removing this product group, all its children will also be removed",
            onConfirm: function onConfirm() {
              apis.removeProductGroup(toBeRemoved, utils.successCallBack('pct-confirm-modal-cancelBtn', 'Product Group Has Been Removed Successfully', scope), function (e) {
                return utils.failCallBack('pct-confirm-modal-cancelBtn', 'An Error Occurr While Removing The Product Group Due To ' + e);
              });
            }
          };
          utils.showModal('confirm_modal.html', scope);
        };
      };

      _export('showAddProductGroupFormModal', showAddProductGroupFormModal = function showAddProductGroupFormModal(scope) {
        addPreprocess(scope);
        utils.showModal('product_group_form.html', scope);
      });

      _export('showAddProductGroupFormModal', showAddProductGroupFormModal);

      _export('showUpdateProductGroupFormModal', showUpdateProductGroupFormModal = function showUpdateProductGroupFormModal(scope) {
        updatePreprocess(scope);
        utils.showModal('product_group_form.html', scope);
      });

      _export('showUpdateProductGroupFormModal', showUpdateProductGroupFormModal);

      _export('showRemoveProductGroupFormModal', showRemoveProductGroupFormModal = function showRemoveProductGroupFormModal(scope) {
        removePreprocess(scope);
        utils.showModal('product_group_form.html', scope);
      });

      _export('showRemoveProductGroupFormModal', showRemoveProductGroupFormModal);
    }
  };
});
//# sourceMappingURL=product_group_form.js.map
