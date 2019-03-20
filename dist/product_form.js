'use strict';

System.register(['./utils'], function (_export, _context) {
  "use strict";

  var utils, isUpdating;
  function showProductForm(tableCtrl, allData, rowData) {

    isUpdating = false;
    var id = void 0;
    var desc = '';

    if (rowData) {
      id = rowData[0];
      desc = rowData[1];
      isUpdating = true;
    }

    utils.showModal('product_form.html', { id: id, desc: desc });
    removeListeners();
    addListeners(tableCtrl, allData, rowData);
  }

  _export('showProductForm', showProductForm);

  function removeListeners() {
    $(document).off('click', '#master-data-product-submitBtn');
  }

  function addListeners(tableCtrl, allData, rowData) {
    $(document).on('click', '#master-data-product-submitBtn', function (e) {
      var inputs = $('#master-data-product-form').serializeArray();
      //remove spaces in the back of the product description if there is
      inputs[1].value = utils.spaceCheck(inputs[1].value);
      if (isInputsValid(inputs, allData, rowData)) {
        if (isUpdating) {
          updateProduct(inputs, rowData, tableCtrl);
        } else {
          addProduct(inputs, tableCtrl);
        }
      }
    });
  }

  function isInputsValid(inputs, allData, rowData) {
    if (inputs[0].value === '' || inputs[1].value === '') {
      utils.alert('warning', 'Warning', 'All fields are required');
      return false;
    }

    var ids = void 0;

    if (isUpdating) {
      ids = allData.reduce(function (arr, d) {
        if (d.product_id !== parseInt(rowData[0])) {
          arr.push(d.product_id);
        }
        return arr;
      }, []);
    } else {
      ids = allData.reduce(function (arr, d) {
        arr.push(d.product_id);
        return arr;
      }, []);
    }

    if (ids.indexOf(parseInt(inputs[0].value)) !== -1) {
      utils.alert('warning', 'Warning', 'Product exists');
      return false;
    }

    return true;
  }

  function addProduct(inputs, ctrl) {
    var line = 'product_id=' + inputs[0].value + '&product_desc=' + inputs[1].value;
    var url = utils.postgRestHost + 'products';
    utils.post(url, line).then(function (res) {
      // console.log(res)
      $('#master-data-product-cancelBtn').trigger('click');
      utils.alert('success', 'Success', 'Product has been added');
      ctrl.refresh();
    }).catch(function (e) {
      // console.log(e)
      $('#master-data-product-cancelBtn').trigger('click');
      utils.alert('error', 'Error', 'Error occurred while adding the product to the database, please try again');
    });
  }

  function updateProduct(inputs, data, ctrl) {
    var url = utils.postgRestHost + 'products?product_id=eq.' + data[0] + '&product_desc=eq.' + data[1];
    var line = 'product_id=' + inputs[0].value + '&product_desc=' + inputs[1].value;
    utils.update(url, line).then(function (res) {
      // console.log(res)
      $('#master-data-product-cancelBtn').trigger('click');
      utils.alert('success', 'Success', 'Product has been updated');
      ctrl.refresh();
    }).catch(function (e) {
      // console.log(e)
      $('#master-data-product-cancelBtn').trigger('click');
      utils.alert('error', 'Error', 'Error occurred while updating the product to the database, please try again');
    });
  }
  return {
    setters: [function (_utils) {
      utils = _utils;
    }],
    execute: function () {
      isUpdating = void 0;
    }
  };
});
//# sourceMappingURL=product_form.js.map
