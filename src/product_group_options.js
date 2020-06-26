import * as utils from './utils'
import * as productGroup from './product_group_form'

const preprocess = scope => {
  scope.productGroupOptionsModal = {}

  scope.productGroupOptionsModal.onUpdateClick = () => {
    productGroup.showUpdateProductGroupFormModal(scope)
  }

  scope.productGroupOptionsModal.onRemoveClick = () => {
    productGroup.showRemoveProductGroupFormModal(scope)
  }
}

export const showProductGroupOptionsModal = scope => {
  preprocess(scope)
  utils.showModal('product_group_options.html', scope)
}
