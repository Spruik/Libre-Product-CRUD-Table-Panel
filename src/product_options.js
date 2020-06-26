import * as utils from './utils'
import * as product from './product_form'

const preprocess = scope => {
  scope.productOptionsModal = {}

  scope.productOptionsModal.onViewClick = () => {
    product.showViewProductFormModal(scope)
  }

  scope.productOptionsModal.onUpdateClick = () => {
    product.showUpdateProductFormModal(scope)
  }

  scope.productOptionsModal.onRemoveClick = () => {
    product.removeProduct(scope)
  }
}

export const showProductOptionsModal = scope => {
  preprocess(scope)
  utils.showModal('product_options.html', scope)
}
