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
export const updateProductGroup = (toBeUpdated, groupName, success, fail) => {
  const toSend = { group_name: groupName }
  const url = `${utils.postgRestHost}product_group?group_name=eq.${toBeUpdated}`
  utils.update(url, JSON.stringify(toSend)).then(res => {
    const toSend1 = { product_group: groupName }
    const url1 = `${utils.postgRestHost}products?product_group=eq.${toBeUpdated}`
    utils.update(url1, JSON.stringify(toSend1)).then(() => {
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
  const url = `${utils.postgRestHost}product_group?group_name=eq.${toBeRemoved}`
  utils.remove(url).then(() => {
    const url1 = `${utils.postgRestHost}products?product_group=eq.${toBeRemoved}`
    utils.remove(url1).then(() => {
      success()
    }).catch(e => {
      fail(e)
    })
  }).catch(e => {
    fail(e)
  })
}

/**
 * Send request to postgrest for adding a product
 * @param {*} productGroup The group that this product belongs to
 * @param {*} productDesc The product desc
 * @param {*} productId The product id
 * @param {*} comment The comment for this product
 * @param {*} ingredient The ingredient of this product
 * @param {*} success What to do when the request is successful? give me a func
 * @param {*} fail What to do when the request is failed? give me a func
 */
export const addProduct = (productGroup, productDesc, productId, comment, ingredient, success, fail) => {
  const toSend = {
    product_id: productId,
    product_desc: productDesc,
    product_group: productGroup,
    comment: comment || null,
    ingredient: ingredient
  }
  const url = utils.postgRestHost + 'products'
  utils.post(url, JSON.stringify(toSend)).then(res => {
    success()
  }).catch(e => {
    fail(e)
  })
}

/**
 * Send request to postgrest for updating a product
 * @param {*} originalId The original id for locating the product to be updated
 * @param {*} productGroup The new product group
 * @param {*} productDesc The new product desc
 * @param {*} productId The new product id
 * @param {*} comment The new comment
 * @param {*} ingredient The new ingredient
 * @param {*} success What to do when the request is successful? give me a func
 * @param {*} fail What to do when the request is failed? give me a func
 */
export const updateProduct = (originalId, productGroup, productDesc, productId, comment, ingredient, success, fail) => {
  const toSend = {
    product_id: productId,
    product_desc: productDesc,
    product_group: productGroup,
    comment: comment || null,
    ingredient: ingredient
  }
  const url = `${utils.postgRestHost}products?product_id=eq.${originalId}`
  utils.update(url, JSON.stringify(toSend)).then(res => {
    success()
  }).catch(e => {
    fail(e)
  })
}

/**
 * Send request to postgrest for removing a product
 * @param {*} id The id of the product to be removed
 * @param {*} success What to do when the request is successful? give me a func 
 * @param {*} fail What to do when the request is failed? give me a func
 */
export const removeProduct = (id, success, fail) => {
  const url = `${utils.postgRestHost}products?product_id=eq.${id}`
  utils.remove(url).then(res => {
    success()
  }).catch(e => {
    fail(e)
  })
}