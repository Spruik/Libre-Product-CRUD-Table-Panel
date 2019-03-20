import * as utils from './utils'
import {showProductForm} from './product_form'

export function showActions(rowData, allData, ctrl) {
  utils.showModal('action_options.html')
  removeListeners()
  addListeners(rowData, allData, ctrl)
}

function removeListeners() {
  $(document).off('click', 'input[type="button"][name="master-data-product-actions-radio"]')
}

function addListeners(rowData, allData, ctrl) {
  $(document).on('click', 'input[type="button"][name="master-data-product-actions-radio"]', e => {
    if (e.target.id === 'update') {
      showProductForm(ctrl, allData, rowData)
    }else if(e.target.id === 'delete') {
      deleteProduct(rowData, ctrl)
    }
  })
}

function deleteProduct(data, ctrl){
  const url = utils.postgRestHost + 'products?product_id=eq.' + data[0]
  utils.remove(url).then(res => {
    // console.log(res)
    $('#master-data-product-actions-cancelBtn').trigger('click')
    utils.alert('success', 'Success', 'Product has been deleted')
    ctrl.refresh()
  }).catch(e => {
    // console.log(e)
    $('#master-data-product-actions-cancelBtn').trigger('click')
    utils.alert('error', 'Error', 'Error occurred while deleting the product from the database, please try again')
  })
}