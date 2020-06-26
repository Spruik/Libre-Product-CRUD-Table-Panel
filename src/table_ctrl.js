import _ from 'lodash'
import $ from 'jquery'
import { MetricsPanelCtrl } from 'app/plugins/sdk'
import { transformDataToTable } from './transformers'
import { tablePanelEditor } from './editor'
import { columnOptionsTab } from './column_options'
import { TableRenderer } from './renderer'
import * as utils from './utils'
import * as add from './add_options'
import * as productGroup from './product_group_options'
import * as product from './product_options'

import './css/style.css!'
import './css/instant-serach.css!'

const panelDefaults = {
  targets: [{}],
  transform: 'timeseries_to_columns',
  pageSize: null,
  showHeader: true,
  styles: [
    {
      type: 'date',
      pattern: 'Time',
      alias: 'Time',
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      headerColor: 'rgba(51, 181, 229, 1)'
    },
    {
      unit: 'short',
      type: 'number',
      alias: '',
      decimals: 2,
      headerColor: 'rgba(51, 181, 229, 1)',
      colors: ['rgba(245, 54, 54, 0.9)', 'rgba(237, 129, 40, 0.89)', 'rgba(50, 172, 45, 0.97)'],
      colorMode: null,
      pattern: '/.*/',
      thresholds: []
    }
  ],
  columns: [],
  scroll: true,
  fontSize: '100%',
  sort: { col: 0, desc: true }
}

export class TableCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, templateSrv, annotationsSrv, $sanitize, variableSrv) {
    super($scope, $injector)

    this.pageIndex = 0
    const ctrl = this

    if (this.panel.styles === void 0) {
      this.panel.styles = this.panel.columns
      this.panel.columns = this.panel.fields
      delete this.panel.columns
      delete this.panel.fields
    }

    _.defaults(this.panel, panelDefaults)

    this.events.on('data-received', this.onDataReceived.bind(this))
    this.events.on('data-error', this.onDataError.bind(this))
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this))
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this))
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this))

    this.currentFilterGroup = 'All'

    $(document).off('click', 'tr.tr-affect#master-data-product-tr')
    $(document).on('click', 'tr.tr-affect#master-data-product-tr', function (e) {
      const rowData = $('td', this).map((index, td) => {
        if (td.childNodes.length === 2) {
          return td.childNodes[1].nodeValue
        } else if (td.childNodes.length === 1) {
          return $(td).text()
        } else {
          return ''
        }
      })

      const idIndex = $scope.ctrl.colDimensions.indexOf('id')
      if (!~idIndex) {
        utils.alert('error', 'Error', 'Get not get this product from the database because PRODUCT ID NOT FOUND, please contact the dev team or try to NOT hide the product id column')
      } else {
        $scope.ctrl.currentProduct = utils.findProductById($scope.ctrl.products, rowData[idIndex])[0]
        product.showProductOptionsModal($scope.ctrl)
      }
    })
  }

  onInitEditMode () {
    this.addEditorTab('Options', tablePanelEditor, 2)
    this.addEditorTab('Column Styles', columnOptionsTab, 3)
  }

  onInitPanelActions (actions) {
    actions.push({ text: 'Export CSV', click: 'ctrl.exportCsv()' })
  }

  issueQueries (datasource) {
    this.pageIndex = 0

    if (this.panel.transform === 'annotations') {
      this.setTimeQueryStart()
      return this.annotationsSrv
        .getAnnotations({
          dashboard: this.dashboard,
          panel: this.panel,
          range: this.range
        })
        .then(annotations => {
          return { data: annotations }
        })
    }

    return super.issueQueries(datasource)
  }

  onDataError () {
    this.dataRaw = []
    this.render()
  }

  onDataReceived (dataList) {
    if (dataList.length === 0 || dataList === null || dataList === undefined) {
      return
    }

    if (dataList[0].type !== 'table') {
      utils.alert('error', 'Error', 'To show the product list, please format data as a TABLE in the Metrics Setting')
      return
    }

    this.productGroups = []
    this.productGroupsFilter = []

    if (dataList[1]) {
      if (dataList[1].type !== 'table') {
        utils.alert('error', 'Error', 'To show the product list, please format data as a TABLE in the Metrics Setting')
        return
      }

      this.productGroups = dataList[1].rows.flat().sort()
      this.productGroupsFilter = dataList[1].rows.flat().sort()
    }

    if (dataList[2]) {
      if (dataList[2].type !== 'table') {
        utils.alert('error', 'Error', 'To show the product list, please format data as a TABLE in the Metrics Setting')
        return
      }
      this.materials = utils.getRestructuredData(dataList[2].columns, dataList[2].rows)
      this.materialsDataList = this.materials.reduce((arr, mat) => {
        const item = `${mat.name} | ${mat.description}`
        arr.push(item)
        return arr
      }, [])
    }

    if (dataList[3]) {
      if (dataList[3].type !== 'table') {
        utils.alert('error', 'Error', 'To show the product list, please format data as a TABLE in the Metrics Setting')
        return
      }
      this.operationSeq = utils.getRestructuredData(dataList[3].columns, dataList[3].rows)
      this.operationSeqList = this.operationSeq.map(x => x.name)
    }

    this.productGroupsFilter.splice(0, 0, 'All')

    this.products = utils.getRestructuredProduct(dataList[0].columns, dataList[0].rows)
    this.productDimension = utils.getDimension(dataList[0].columns)

    this.dataRaw = dataList
    this.dataRawUnChange = utils.copy(dataList)
    this.pageIndex = 0
    // automatically correct transform mode based on data
    if (this.dataRaw && this.dataRaw.length) {
      if (this.dataRaw[0].type === 'table') {
        this.panel.transform = 'table'
      } else {
        if (this.dataRaw[0].type === 'docs') {
          this.panel.transform = 'json'
        } else {
          if (this.panel.transform === 'table' || this.panel.transform === 'json') {
            this.panel.transform = 'timeseries_to_rows'
          }
        }
      }
    }

    if (this.currentFilterGroup !== 'All') {
      this.onGroupFilterChange()
    }

    this.render()
  }

  onAddButtonClick () {
    add.showAddOptionsModal(this)
  }

  onProductGroupButtonClick () {
    productGroup.showProductGroupOptionsModal(this)
  }

  onGroupFilterChange () {
    this.dataRaw[0].rows = this.dataRawUnChange[0].rows

    if (this.currentFilterGroup !== 'All') {
      this.dataRaw[0].rows = this.dataRaw[0].rows.filter(row => row[this.productDimension.indexOf('product_group')] === this.currentFilterGroup)
    }

    this.render()
  }

  render () {
    this.table = transformDataToTable(this.dataRaw, this.panel)
    // console.log(this.panel.sort);
    this.table.sort(this.panel.sort)
    // console.log(this.panel.sort);
    this.renderer = new TableRenderer(
      this.panel,
      this.table,
      this.dashboard.isTimezoneUtc(),
      this.$sanitize,
      this.templateSrv,
      this.col
    )

    return super.render(this.table)
  }

  toggleColumnSort (col, colIndex) {
    // remove sort flag from current column
    if (this.table.columns[this.panel.sort.col]) {
      this.table.columns[this.panel.sort.col].sort = false
    }

    if (this.panel.sort.col === colIndex) {
      if (this.panel.sort.desc) {
        this.panel.sort.desc = false
      } else {
        this.panel.sort.col = null
      }
    } else {
      this.panel.sort.col = colIndex
      this.panel.sort.desc = true
    }
    this.render()
  }

  exportCsv () {
    const scope = this.$scope.$new(true)
    scope.tableData = this.renderer.render_values()
    scope.panel = 'table'
    this.publishAppEvent('show-modal', {
      templateHtml: '<export-data-modal panel="panel" data="tableData"></export-data-modal>',
      scope,
      modalClass: 'modal--narrow'
    })
  }

  link (scope, elem, attrs, ctrl) {
    let data
    const panel = ctrl.panel
    let pageCount = 0

    function getTableHeight () {
      let panelHeight = ctrl.height

      if (pageCount > 1) {
        panelHeight -= 26
      }

      return panelHeight - 31 + 'px'
    }

    function appendTableRows (tbodyElem) {
      ctrl.renderer.setTable(data)
      tbodyElem.empty()
      tbodyElem.html(ctrl.renderer.render(ctrl.pageIndex))
    }

    function switchPage (e) {
      const el = $(e.currentTarget)
      ctrl.pageIndex = parseInt(el.text(), 10) - 1
      renderPanel()
    }

    function appendPaginationControls (footerElem) {
      footerElem.empty()

      const pageSize = panel.pageSize || 100
      pageCount = Math.ceil(data.rows.length / pageSize)
      if (pageCount === 1) {
        return
      }

      const startPage = Math.max(ctrl.pageIndex - 3, 0)
      const endPage = Math.min(pageCount, startPage + 9)

      const paginationList = $('<ul></ul>')

      for (let i = startPage; i < endPage; i++) {
        const activeClass = i === ctrl.pageIndex ? 'active' : ''
        const pageLinkElem = $(
          '<li><a class="table-panel-page-link pointer ' + activeClass + '">' + (i + 1) + '</a></li>'
        )
        paginationList.append(pageLinkElem)
      }

      footerElem.append(paginationList)
    }

    function renderPanel () {
      const panelElem = elem.parents('.panel-content')
      const rootElem = elem.find('.table-panel-scroll')
      const tbodyElem = elem.find('tbody')
      const footerElem = elem.find('.table-panel-footer')

      elem.css({ 'font-size': panel.fontSize })
      panelElem.addClass('table-panel-content')

      appendTableRows(tbodyElem)
      appendPaginationControls(footerElem)
      const height = parseInt(getTableHeight().split('px')[0]) - 38 + 'px'
      rootElem.css({ 'max-height': panel.scroll ? height : '' })

      // get current table column dimensions
      if (ctrl.table.columns) {
        ctrl.colDimensions = ctrl.table.columns.filter(x => !x.hidden).map(x => x.text)
      }
    }

    // hook up link tooltips
    elem.tooltip({
      selector: '[data-link-tooltip]'
    })

    function addFilterClicked (e) {
      const filterData = $(e.currentTarget).data()
      const options = {
        datasource: panel.datasource,
        key: data.columns[filterData.column].text,
        value: data.rows[filterData.row][filterData.column],
        operator: filterData.operator
      }

      ctrl.variableSrv.setAdhocFilter(options)
    }

    elem.on('click', '.table-panel-page-link', switchPage)
    elem.on('click', '.table-panel-filter-link', addFilterClicked)

    const unbindDestroy = scope.$on('$destroy', () => {
      elem.off('click', '.table-panel-page-link')
      elem.off('click', '.table-panel-filter-link')
      unbindDestroy()
    })

    ctrl.events.on('render', renderData => {
      data = renderData || data
      if (data) {
        renderPanel()
      }
      ctrl.renderingCompleted()
    })
  }
}

TableCtrl.templateUrl = 'public/plugins/libre-product-crud-table-panel/partials/module.html'
