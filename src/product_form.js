import _ from 'lodash'
import * as utils from './utils'
import * as apis from './apis'


const _onAddApplicator = scope => {
  const length = scope.productFormModal.ingredient.applicators.length
  const maxApplicatorNum =10
  if (length >= maxApplicatorNum) { return }
  const applicator = {
    id: length + 1,
    operation: '',
    operationSeq: null,
    operationId: null,
    targetGOS: null,
    targetTol: 0,
    materials: [
      {
        seriseId: 1,
        materialId: "",
        oz: null,
        gramsOnScale: null,
        gramsTotal: null,
        tolerance: 0,
        meta: {
          isTotalReadOnly: true
        }
      }
    ]
  }
  scope.productFormModal.ingredient.applicators.push(applicator)
}

const _onAddSubMaterial = (scope, topId) => {
  const length = scope.productFormModal.ingredient.applicators[topId - 1].materials.length
  const maxMaterialNum = 8
  if (length >= maxMaterialNum) { return }
  const material = {
    seriseId: length + 1,
    materialId: "",
    oz: null,
    gramsOnScale: null,
    gramsTotal: null,
    tolerance: 0,
    meta: {
      isTotalReadOnly: true
    }
  }

  scope.productFormModal.ingredient.applicators[topId - 1].materials.push(material)
}

const isMaterialValid = (ingredient, materialsModelList) => {
  let materials = []
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

const matchOperation = (scope, val, toGet) => {
  if (toGet === 'id') {
    return scope.operationSeq.filter(x => x.name === val)[0].id
  }else if (toGet === 'seq') {
    return scope.operationSeq.filter(x => x.name === val)[0].sequence
  }else {
    return 0
  }
}

const updateGramsTotalAccumulatively = (form) => {
  if (!form.isTotalCalcOn) { return }
  const apps = form.ingredient.applicators
  if (!apps) { return }

  let arr = []
  for (let i = 0; i < apps.length; i++) {
    const item = apps[i];
    for (let k = 0; k < item.materials.length; k++) {
      const mat = item.materials[k];
      mat.gramsTotal = Number((mat.gramsOnScale + Number(arr.reduce((num, x) => num += x, 0).toFixed(2))).toFixed(2))
      arr.push(mat.gramsOnScale)
    }
  }

}

const getSumByKey = (app, key, form) => {
  if (key === 'gos'){
    updateGramsTotalAccumulatively(form)
    return Number(app.materials.reduce((num, x) => num += x.gramsOnScale || 0, 0).toFixed(2))
  }else if (key === 'tol'){
    return Number(app.materials.reduce((num, x) => num += x.tolerance || 0, 0).toFixed(2))
  }else {
    return 0
  }
}

const updateTargetNum = app => {
  app.targetGOS = Number(app.materials.reduce((num, x) => num += x.gramsOnScale || 0, 0).toFixed(2))
  app.targetTol = Number(app.materials.reduce((num, x) => num += x.tolerance || 0, 0).toFixed(2))
}

const  matchMaterial = (scope, val) => {
  if (val === undefined || val === null) return 0
  const name = val.split(' | ')[0]
  const desc = val.split(' | ')[1]
  const target = scope.materials.filter(x => x.name === name && x.description === desc)[0]
  return target ? target.id : 0
}

const addPreprocess = scope => {
  //init data

  const group = scope.currentFilterGroup === 'All' ? scope.productGroups[0] || "" : scope.currentFilterGroup

  scope.productFormModal = {
    isTotalCalcOn: true,
    productGroup: group,
    id: null,
    productDesc: "",
    comment: "",
    ingredient: {
      applicators: [
        {
          id: 1,
          operation: '',
          operationSeq: null,
          operationId: null,
          targetGOS: null,
          targetTol: 0,
          materials: [
            {
              seriseId: 1,
              materialId: "",
              oz: null,
              gramsOnScale: null,
              gramsTotal: null,
              tolerance: 0,
              meta: {
                isTotalReadOnly: true
              }
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
        const apps = scope.productFormModal.ingredient.applicators
        apps.pop() 
        updateGramsTotalAccumulatively(scope.productFormModal)
      },
      onAddSubMaterial: (topId) => {
        _onAddSubMaterial(scope, topId)
      },
      onRemoveSubMaterial: (id) => {
        const apps = scope.productFormModal.ingredient.applicators
        apps[id-1].materials.pop() 
        updateGramsTotalAccumulatively(scope.productFormModal)
        updateTargetNum(apps[id-1])
      },
      onOperationChanged: (val, toGet) => {
        return matchOperation(scope, val, toGet)
      },
      onScaleChanged: (applicator, key) => {
        return getSumByKey(applicator, key, scope.productFormModal)
      },
      onTotalCheckChanged: () => {
        updateGramsTotalAccumulatively(scope.productFormModal)
      },
      onMaterialChanged: (val) => {
        return matchMaterial(scope, val)
      },
      toFixed: (val) => {
        if (val === undefined || val === null) return
        return Number(val.toFixed(2))
      }
    },
    submitBtnMsg: 'Submit'
  }

  scope.productFormModal.func.onSubmit = () => {
    const product = scope.productFormModal

    if (!product.ingredient.applicators) {
      utils.alert('warning', 'Warning', `No material can be found on this product`)
      return
    }

    const selectedOperations = scope.productFormModal.ingredient.applicators.map(x => x.operation)
    const setArr = Array.from(new Set(selectedOperations))
    if (selectedOperations.length !== setArr.length) {
      utils.alert('warning', 'Warning', `The same operation CANNOT be selected TWICE!`)
      return
    }

    if (scope.products) {
      if (utils.findProductById(scope.products, product.id).length !== 0) {
        utils.alert('warning', 'Warning', `Product With Product ID "${product.id}" Already Exists`)
        return
      }

      if (utils.findProductByDesc(scope.products, product.productDesc).length !== 0) {
        utils.alert('warning', 'Warning', `Product With Product Description "${product.productDesc}" Already Exists`)
        return
      }
    }

    if (!isMaterialValid(product.ingredient, scope.materialsDataList)) { return }

    apis.addProduct(
      product,
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
    productId: cur.id,
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

  const cur = utils.copy(scope.currentProduct) 

  scope.productFormModal = {
    isTotalCalcOn: true,
    productGroup: cur.product_group,
    id: cur.id,
    productDesc: cur.product_desc,
    comment: cur.comment || "",
    ingredient: cur.ingredient,
    func: {
      onAddApplicator: () => {
        _onAddApplicator(scope)
      },
      onRemoveApplicator: () => { 
        const apps = scope.productFormModal.ingredient.applicators
        apps.pop() 
        updateGramsTotalAccumulatively(scope.productFormModal)
      },
      onAddSubMaterial: (topId) => {
        _onAddSubMaterial(scope, topId)
      },
      onRemoveSubMaterial: (id) => {
        const apps = scope.productFormModal.ingredient.applicators
        apps[id-1].materials.pop() 
        updateGramsTotalAccumulatively(scope.productFormModal)
        updateTargetNum(apps[id-1])
      },
      onOperationChanged: (val, toGet) => {
        return matchOperation(scope, val, toGet)
      },
      onScaleChanged: (applicator, key) => {
        return getSumByKey(applicator, key, scope.productFormModal)
      },
      onTotalCheckChanged: () => {
        updateGramsTotalAccumulatively(scope.productFormModal)
      },
      onMaterialChanged: (val) => {
        return matchMaterial(scope, val)
      },
      toFixed: (val) => {
        if (val === undefined || val === null) return
        return Number(val.toFixed(2))
      }
    },
    submitBtnMsg: 'Update'
  }

  scope.tempProductForm = utils.copy(scope.productFormModal)

  scope.productFormModal.func.onSubmit = () => {

    const product = scope.productFormModal
    const match = utils.findProductById(scope.products, product.id)

    //Check if make any changes
    if (!utils.hasObjectChanged(scope.tempProductForm, product)) {
      utils.alert('warning', 'Warning', `You Did Not Make Any Changes On It`)
      return
    }

    // check if there is any operation selected twice
    const selectedOperations = scope.productFormModal.ingredient.applicators.map(x => x.operation)
    const setArr = Array.from(new Set(selectedOperations))
    if (selectedOperations.length !== setArr.length) {
      utils.alert('warning', 'Warning', `The same operation CANNOT be selected TWICE!`)
      return
    }

    //Check if id is invalid
    if (match.length !== 0) {
      if (match[0].id !== cur.id) {
        utils.alert('warning', 'Warning', `Product With Product ID "${product.id}" Already Exists`)
        return
      }
    }

    if (!isMaterialValid(product.ingredient, scope.materialsDataList)) { return }

    apis.updateProduct(
      cur.id,
      scope.tempProductForm.ingredient,
      product,
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
  const id = scope.currentProduct.id
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