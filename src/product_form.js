import _ from 'lodash'
import * as utils from './utils'
import * as apis from './apis'


const _onAddApplicator = scope => {
  const length = scope.productFormModal.ingredient.applicators.length
  const maxApplicatorNum = 10
  if (length >= maxApplicatorNum) { return }
  const applicator = {
    id: length + 1,
    materials: [
      {
        seriseId: 1,
        materialId: "",
        oz: null,
        gramsOnScale: null,
        gramsTotal: null,
        tolerance: 0
      }
    ]
  }
  scope.productFormModal.ingredient.applicators.push(applicator)
}

const _onAddSubMaterial = (scope, topId) => {
  const length = scope.productFormModal.ingredient.applicators[topId - 1].materials.length
  const maxMaterialNum = 5
  if (length >= maxMaterialNum) { return }
  const material = {
    seriseId: length + 1,
    materialId: "",
    oz: null,
    gramsOnScale: null,
    gramsTotal: null,
    tolerance: 0
  }

  scope.productFormModal.ingredient.applicators[topId - 1].materials.push(material)
}

const isMaterialValid = (ingredient, materialsModelList) => {
  let materials = [ingredient.crust.name, ingredient.sauce.name]
  ingredient.applicators.forEach(app => {
    app.materials.forEach(m => {
      materials.push(m.name)
    })
  })
  
  const diffItems = _.difference(materials, materialsModelList)
  if (diffItems.length !== 0) {
    utils.alert('warning', 'Material Not Exists', `The material ${diffItems[0]} does not exist, please either add it to the material list or select the exact item that the input field suggests`)
    return false
  }

  return true
}

const addPreprocess = scope => {
  //init data

  const group = scope.currentFilterGroup === 'All' ? scope.productGroups[0] || "" : scope.currentFilterGroup

  scope.productFormModal = {
    productGroup: group,
    productId: null,
    productDesc: "",
    comment: "",
    ingredient: {
      crust: {
        name: "",
        oz: null,
        materialId: "",
        gramsOnScale: null,
        gramsTotal: null,
        tolerance: 0
      },
      sauce: {
        name: "",
        oz: null,
        materialId: "",
        gramsOnScale: null,
        gramsTotal: null,
        tolerance: 0
      },
      applicators: [
        {
          id: 1,
          materials: [
            {
              seriseId: 1,
              materialId: "",
              oz: null,
              gramsOnScale: null,
              gramsTotal: null,
              tolerance: 0
            }
          ]
        }
      ]
    },
    func: {
      onAddApplicator: () => {
        _onAddApplicator(scope)
      },
      onRemoveApplicator: () => { 
        scope.productFormModal.ingredient.applicators.pop() 
      },
      onAddSubMaterial: (topId) => {
        _onAddSubMaterial(scope, topId)
      },
      onRemoveSubMaterial: (id) => {
        scope.productFormModal.ingredient.applicators[id-1].materials.pop() 
      }
    },
    submitBtnMsg: 'Submit'
  }

  scope.productFormModal.func.onSubmit = () => {
    const product = scope.productFormModal
    
    if (utils.findProductById(scope.products, product.productId).length !== 0) {
      utils.alert('warning', 'Warning', `Product With Product ID "${product.productId}" Already Exists`)
      return
    }

    if (!isMaterialValid(product.ingredient, scope.materialsDataList)) { return }

    apis.addProduct(
      product.productGroup, 
      product.productDesc, 
      product.productId, 
      product.comment,
      product.ingredient,
      utils.successCallBack('pct-product-form-cancelBtn', 'Product Has Been Added Successfully', scope),
      e => utils.failCallBack('pct-product-form-cancelBtn', `An Error Occurr While Adding The Product Due To ${e}`)
    )
  }
}

/**
 * Data init for viewing product
 * @param {*} scope 
 */
const viewPreprocess = scope => {
  const cur = scope.currentProduct
  scope.productFormViewModal = {
    productGroup: cur.product_group,
    productId: cur.product_id,
    productDesc: cur.product_desc,
    comment: cur.comment || "",
    ingredient: cur.ingredient,
  }
}

/**
 * Data init for updating product
 * @param {*} scope 
 */
const updatePreprocess = scope => {

  const cur = scope.currentProduct

  scope.productFormModal = {
    productGroup: cur.product_group,
    productId: cur.product_id,
    productDesc: cur.product_desc,
    comment: cur.comment || "",
    ingredient: cur.ingredient,
    func: {
      onAddApplicator: () => {
        _onAddApplicator(scope)
      },
      onRemoveApplicator: () => { 
        scope.productFormModal.ingredient.applicators.pop() 
      },
      onAddSubMaterial: (topId) => {
        _onAddSubMaterial(scope, topId)
      },
      onRemoveSubMaterial: (id) => {
        scope.productFormModal.ingredient.applicators[id-1].materials.pop() 
      }
    },
    submitBtnMsg: 'Update'
  }

  scope.tempProductForm = utils.copy(scope.productFormModal)

  scope.productFormModal.func.onSubmit = () => {

    const product = scope.productFormModal
    const match = utils.findProductById(scope.products, product.productId)

    //Check if make any changes
    if (!utils.hasObjectChanged(scope.tempProductForm, product)) {
      utils.alert('warning', 'Warning', `You Did Not Make Any Changes On It`)
      return
    }

    //Check if id is invalid
    if (match.length !== 0) {
      if (match[0].product_id !== cur.product_id) {
        utils.alert('warning', 'Warning', `Product With Product ID "${product.productId}" Already Exists`)
        return
      }
    }

    if (!isMaterialValid(product.ingredient, scope.materialsDataList)) { return }

    apis.updateProduct(
      cur.product_id,
      product.productGroup,
      product.productDesc,
      product.productId,
      product.comment,
      product.ingredient,
      utils.successCallBack('pct-product-form-cancelBtn', 'Product Has Been Updated Successfully', scope),
      e => utils.failCallBack('pct-product-form-cancelBtn', `An Error Occurr While Updating The Product Due To ${e}`)
    )
  }
}

export const showAddProductFormModal = scope => {
  addPreprocess(scope)
  utils.showLargeModal('product_form.html', scope)
}

export const showViewProductFormModal = scope => {
  viewPreprocess(scope)
  utils.showLargeModal('product_form_view.html', scope)
}

export const showUpdateProductFormModal = scope => {
  updatePreprocess(scope)
  utils.showLargeModal('product_form.html', scope)
}

export const removeProduct = scope => {
  const id = scope.currentProduct.product_id
  scope.confirmModal = {
    confirmMsg: `Please confirm that you want to remove product ${id}`,
    onConfirm: () => {
      apis.removeProduct(
        id, 
        utils.successCallBack('pct-confirm-modal-cancelBtn', `Product ${id} Has Been Removed Successfully`, scope),
        e => utils.failCallBack('pct-confirm-modal-cancelBtn', `An Error Occurr While Removing The Product Due To ${e}`)
      )
    }
  }
  utils.showModal('confirm_modal.html', scope)
}