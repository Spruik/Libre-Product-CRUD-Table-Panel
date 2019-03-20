import {DataList} from './datalist'

/**
 * Expect the product list and production line list data
 * Passed these two data passed in to form the datalist
 * Create datalist object to control the instant search input
 * @param {*} products 
 * @param {*} productionLines 
 */
function enableInstantSearch (products, productionLines) {
  
  const productsData = products.reduce((arr, p) => {
    const obj = {value: p, text: p.product_id + ' | ' + p.product_desc}
    arr.push(obj)
    return arr
  }, [])

  const productionLineData = productionLines.reduce((arr, line) => {
    const obj = {value: line, text: line.production_line}
    arr.push(obj)
    return arr
  }, [])

  const productionLineDataList = new DataList(
    "datalist-production-line",
    "datalist-input-production-line",
    "datalist-ul-production-line",
    productionLineData
  );

  const productsDataList = new DataList(
    "datalist-products",
    "datalist-input-products",
    "datalist-ul-products",
    productsData
  );

  productionLineDataList.create();
  productionLineDataList.removeListeners()
  productionLineDataList.addListeners(productionLineDataList);

  productsDataList.create();
  productsDataList.removeListeners()
  productsDataList.addListeners(productsDataList);
}

export { enableInstantSearch }