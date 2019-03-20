'use strict';

System.register(['./utils', './product_form'], function (_export, _context) {
  "use strict";

  var utils, showProductForm;
  function showActions(rowData, allData, ctrl) {
    utils.showModal('action_options.html');
    removeListeners();
    addListeners(rowData, allData, ctrl);
  }

  _export('showActions', showActions);

  function removeListeners() {
    $(document).off('click', 'input[type="button"][name="master-data-product-actions-radio"]');
  }

  function addListeners(rowData, allData, ctrl) {
    $(document).on('click', 'input[type="button"][name="master-data-product-actions-radio"]', function (e) {
      if (e.target.id === 'update') {
        showProductForm(ctrl, allData, rowData);
      } else if (e.target.id === 'delete') {
        deleteProduct(rowData, ctrl);
      }
    });
  }

  function deleteProduct(data, ctrl) {
    var url = utils.postgRestHost + 'products?product_id=eq.' + data[0];
    utils.remove(url).then(function (res) {
      // console.log(res)
      $('#master-data-product-actions-cancelBtn').trigger('click');
      utils.alert('success', 'Success', 'Product has been deleted');
      ctrl.refresh();
    }).catch(function (e) {
      // console.log(e)
      $('#master-data-product-actions-cancelBtn').trigger('click');
      utils.alert('error', 'Error', 'Error occurred while deleting the product from the database, please try again');
    });
  }
  return {
    setters: [function (_utils) {
      utils = _utils;
    }, function (_product_form) {
      showProductForm = _product_form.showProductForm;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=action_options_ctrl.js.map
