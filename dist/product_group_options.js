'use strict';

System.register(['./utils', './product_group_form'], function (_export, _context) {
  "use strict";

  var utils, productGroup, preprocess, showProductGroupOptionsModal;
  return {
    setters: [function (_utils) {
      utils = _utils;
    }, function (_product_group_form) {
      productGroup = _product_group_form;
    }],
    execute: function () {
      preprocess = function preprocess(scope) {
        scope.productGroupOptionsModal = {};

        scope.productGroupOptionsModal.onUpdateClick = function () {
          productGroup.showUpdateProductGroupFormModal(scope);
        };

        scope.productGroupOptionsModal.onRemoveClick = function () {
          productGroup.showRemoveProductGroupFormModal(scope);
        };
      };

      _export('showProductGroupOptionsModal', showProductGroupOptionsModal = function showProductGroupOptionsModal(scope) {
        preprocess(scope);
        utils.showModal('product_group_options.html', scope);
      });

      _export('showProductGroupOptionsModal', showProductGroupOptionsModal);
    }
  };
});
//# sourceMappingURL=product_group_options.js.map
