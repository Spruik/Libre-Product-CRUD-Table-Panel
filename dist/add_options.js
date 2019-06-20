'use strict';

System.register(['./utils', './product_group_form', './product_form'], function (_export, _context) {
  "use strict";

  var utils, productGroup, product, preprocess, showAddOptionsModal;
  return {
    setters: [function (_utils) {
      utils = _utils;
    }, function (_product_group_form) {
      productGroup = _product_group_form;
    }, function (_product_form) {
      product = _product_form;
    }],
    execute: function () {
      preprocess = function preprocess(scope) {

        scope.addOptionsModal = {};

        scope.addOptionsModal.onProductGroupClick = function () {
          productGroup.showAddProductGroupFormModal(scope);
        };

        scope.addOptionsModal.onProductClick = function () {
          product.showAddProductFormModal(scope);
        };
      };

      _export('showAddOptionsModal', showAddOptionsModal = function showAddOptionsModal(scope) {
        preprocess(scope);
        utils.showModal('add_options.html', scope);
      });

      _export('showAddOptionsModal', showAddOptionsModal);
    }
  };
});
//# sourceMappingURL=add_options.js.map
