'use strict';

System.register(['./utils', './product_form'], function (_export, _context) {
  "use strict";

  var utils, product, preprocess, showProductOptionsModal;
  return {
    setters: [function (_utils) {
      utils = _utils;
    }, function (_product_form) {
      product = _product_form;
    }],
    execute: function () {
      preprocess = function preprocess(scope) {
        scope.productOptionsModal = {};

        scope.productOptionsModal.onViewClick = function () {
          product.showViewProductFormModal(scope);
        };

        scope.productOptionsModal.onUpdateClick = function () {
          product.showUpdateProductFormModal(scope);
        };

        scope.productOptionsModal.onRemoveClick = function () {
          product.removeProduct(scope);
        };
      };

      _export('showProductOptionsModal', showProductOptionsModal = function showProductOptionsModal(scope) {
        preprocess(scope);
        utils.showModal('product_options.html', scope);
      });

      _export('showProductOptionsModal', showProductOptionsModal);
    }
  };
});
//# sourceMappingURL=product_options.js.map
