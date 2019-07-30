import * as utils from './utils'

/**
 * Send request to postgrest for adding a product group
 * @param {*} groupName The group name
 * @param {*} success The success controller
 * @param {*} fail The fail controller
 */
export const addProductGroup = (groupName, success, fail) => {
  const toSend = { group_name: groupName }
  const url = utils.postgRestHost + 'product_group'
  utils.post(url, JSON.stringify(toSend)).then(res => {
    success()
  }).catch(e => {
    fail(e)
  })
}

/**
 * Send request to postgrest for updating a product group and all its children's product group name
 * @param {*} toBeUpdated The group to be updated
 * @param {*} groupName The group name
 * @param {*} success The success controller
 * @param {*} fail The fail controller
 */
export const updateProductGroup = (scope, toBeUpdated, groupName, success, fail) => {
  const toSend = { group_name: groupName }
  const url = `${utils.postgRestHost}product_group?group_name=eq.${toBeUpdated}`
  utils.update(url, JSON.stringify(toSend)).then(res => {
    const toSend1 = { product_group: groupName }
    const url1 = `${utils.postgRestHost}product?product_group=eq.${toBeUpdated}`
    utils.update(url1, JSON.stringify(toSend1)).then(() => {
      scope.currentFilterGroup = groupName // update the current filter so that the filter input will not be empty
      success()
    }).catch(e => {
      fail(e)
    })
  }).catch(e => {
    fail(e)
  })
}

/**
 * Send request to postgrest for removing a product group and all its children
 * @param {*} toBeRemoved The group to be removed
 * @param {*} success The success controller
 * @param {*} fail The fail controller
 */
export const removeProductGroup = (toBeRemoved, success, fail) => {
  // first of all remove the product group
  const removeProductGroupurl = `${utils.postgRestHost}product_group?group_name=eq.${toBeRemoved}`
  utils.remove(removeProductGroupurl).then(() => {
    // then use the 'toberemoved' to get the product id
    const productsByGroupNameUrl = `${utils.postgRestHost}product?product_group=eq.${toBeRemoved}`
    utils.get(productsByGroupNameUrl).then(res => {
      const ids = res.map(x => x.id)
      if(ids.length === 0){
        //if cannot get anything
        success()
      }else {
        //if can get something
        // use the product group to remove the product
        utils.remove(productsByGroupNameUrl).then(() => {
          // use the product id to remove the material requirements
          const proimise = []
          ids.forEach(id => {
            proimise.push(utils.remove(`${utils.postgRestHost}material_requirement?product_id=eq.${id}`))
          })
          Promise.all(proimise).then(() => {success()}).catch(e => {fail(e)})
        }).catch(e => {fail(e)})
      }
    }).catch(e => {fail(e)})
  }).catch(e => {fail(e)})
}

/**
 * Send request to postgrest for adding a product
 * @param {*} product The product to be inserted
 * @param {*} success What to do when the request is successful? give me a func
 * @param {*} fail What to do when the request is failed? give me a func
 */
export const addProduct = (product, success, fail) => {
  const productToSend = getProductToSend(product)
  const materialsToSend = getMaterialsToSendList(product)

  const url = utils.postgRestHost + 'product'
  const matUrl = utils.postgRestHost + 'material_requirement'
  utils.post(url, JSON.stringify(productToSend)).then(() => {
    utils.post(matUrl, JSON.stringify(materialsToSend)).then(() => {
      success()
    }).catch(e => {
      fail(e)
    })
  }).catch(e => {
    fail(e)
  })
}

/**
 * Send request to postgrest for updating a product
 * @param {*} originalId The original id for locating the product to be updated
 * @param {*} originalIngredient The original ingredient
 * @param {*} product The new product data you get from the form
 * @param {*} success What to do when the request is successful? give me a func
 * @param {*} fail What to do when the request is failed? give me a func
 */
export const updateProduct = (originalId, originalIngredient, product, success, fail) => {
  const productToSend = getProductToSend(product)
  const productUrl = `${utils.postgRestHost}product?id=eq.${originalId}`

  if (!utils.hasObjectChanged(originalIngredient, product.ingredient) && originalId === product.id) {
    // ingredient not changed and id not changed just update the product table
    utils.update(productUrl, JSON.stringify(productToSend)).then(() => {
      success()
    }).catch(e => {
      fail(e)
    })
  }else {
    // ingredient changed, update the product table 
    // remove all material requirements that match the product id
    // re-insert the new material requirements
    const materialsToSend = getMaterialsToSendList(product)
    const deleteUrl = `${utils.postgRestHost}material_requirement?product_id=eq.${originalId}`
    const matUrl = `${utils.postgRestHost}material_requirement`
    const promise = [
      utils.update(productUrl, JSON.stringify(productToSend)),
      utils.remove(deleteUrl),
    ]

    Promise.all(promise).then(()=> {
      utils.post(matUrl, JSON.stringify(materialsToSend)).then(()=> {
        success()
      }).catch(e => {
        fail(e)
      })
    }).catch(e => {
      fail(e)
    })
  }
}

/**
 * Send request to postgrest for removing a product
 * @param {*} id The id of the product to be removed
 * @param {*} success What to do when the request is successful? give me a func 
 * @param {*} fail What to do when the request is failed? give me a func
 */
export const removeProduct = (id, success, fail) => {
  const url = `${utils.postgRestHost}product?id=eq.${id}`
  const matUrl = `${utils.postgRestHost}material_requirement?product_id=eq.${id}`

  const promise = [
    utils.remove(url),
    utils.remove(matUrl)
  ]

  Promise.all(promise).then(() => {
    success()
  }).catch(e => {
    fail(e)
  })
}

function getMaterialsToSendList (product) {
  const materialsToSend = []
  const apps = product.ingredient.applicators
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    const operationId = app.operationId
    for (let k = 0; k < app.materials.length; k++) {
      const mat = app.materials[k];
      materialsToSend.push({
        product_id: product.id,
        material_id: mat.materialId,
        operation_id: operationId,
        route_id: null,
        quantity: mat.oz,
        grams_on_scale: mat.gramsOnScale,
        grams_total: mat.gramsTotal,
        quantity_uom: 'Oz',
        sub_sequence_id: mat.seriseId
      })
    }
  }
  return materialsToSend
}

function getProductToSend (product) {
  return {
    id: product.id,
    ingredient: product.ingredient,
    comment: product.comment,
    product_group: product.productGroup,
    product_desc: product.productDesc
  }
}