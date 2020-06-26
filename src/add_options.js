import * as utils from './utils'
import * as productGroup from './product_group_form'
import * as product from './product_form'

const preprocess = scope => {
  scope.addOptionsModal = {}

  scope.addOptionsModal.onProductGroupClick = () => {
    productGroup.showAddProductGroupFormModal(scope)
  }

  scope.addOptionsModal.onProductClick = () => {
    product.showAddProductFormModal(scope)
  }
}

export const showAddOptionsModal = scope => {
  preprocess(scope)
  utils.showModal('add_options.html', scope)
}
