import * as utils from './utils'
import * as apis from './apis'

const addPreprocess = scope => {

  scope.productGroupFormModal = {
    groupName: "",
    action: 'add'
  }

  scope.productGroupFormModal.onSubmit = () => {
    apis.addProductGroup(
      scope.productGroupFormModal.groupName,
      utils.successCallBack('pct-product-group-form-cancelBtn', 'Product Group Has Been Added Successfully', scope),
      e => utils.failCallBack('pct-product-group-form-cancelBtn', `An Error Occurr While Adding The Product Group Due To ${e}`)
    )
  }
}

const updatePreprocess = scope => {

  scope.productGroupFormModal = {
    groupName: "",
    action: 'update',
    toBeUpdated: scope.productGroups[0] || ""
  }

  scope.productGroupFormModal.onUpdate = () => {
    const toBeUpdated = scope.productGroupFormModal.toBeUpdated
    const groupName = scope.productGroupFormModal.groupName
    if (groupName === "") {
      utils.alert('warning', 'Warning', 'The new group name cannot be empty')
    }else if(toBeUpdated === groupName){
      utils.alert('warning', 'Warning', 'The new group name is the same with the original one')
    }else {
      //Validation OK!
      scope.confirmModal = {
        confirmMsg: "Please note that after changing the name of this product group, all its children's product group name will also be changed",
        onConfirm: () => {
          apis.updateProductGroup(
            toBeUpdated, 
            groupName,
            utils.successCallBack('pct-confirm-modal-cancelBtn', 'Product Group Has Been Updated Successfully', scope),
            e => utils.failCallBack('pct-confirm-modal-cancelBtn', `An Error Occurr While Updating The Product Group Due To ${e}`)
          )
        }
      }
      utils.showModal('confirm_modal.html', scope)
    }
  }
}

const removePreprocess = scope => {

  scope.productGroupFormModal = {
    action: 'remove',
    toBeRemoved: scope.productGroups[0] || ""
  }

  scope.productGroupFormModal.onRemove = () => {
    const toBeRemoved = scope.productGroupFormModal.toBeRemoved
    scope.confirmModal = {
      confirmMsg: "Please note that after removing this product group, all its children will also be removed",
      onConfirm: () => {
        apis.removeProductGroup(
          toBeRemoved, 
          utils.successCallBack('pct-confirm-modal-cancelBtn', 'Product Group Has Been Removed Successfully', scope),
          e => utils.failCallBack('pct-confirm-modal-cancelBtn', `An Error Occurr While Removing The Product Group Due To ${e}`)
        )
      }
    }
    utils.showModal('confirm_modal.html', scope)
  }
}

export const showAddProductGroupFormModal = scope => {
  addPreprocess(scope)
  utils.showModal('product_group_form.html', scope)
}

export const showUpdateProductGroupFormModal = scope => {
  updatePreprocess(scope)
  utils.showModal('product_group_form.html', scope)
}

export const showRemoveProductGroupFormModal = scope => {
  removePreprocess(scope)
  utils.showModal('product_group_form.html', scope)
}