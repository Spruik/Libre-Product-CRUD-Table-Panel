'use strict';

System.register(['lodash', 'jquery', 'app/plugins/sdk', './transformers', './editor', './column_options', './renderer', './utils', './add_options', './product_group_options', './product_options', './css/style.css!', './css/instant-serach.css!'], function (_export, _context) {
  "use strict";

  var _, $, MetricsPanelCtrl, transformDataToTable, tablePanelEditor, columnOptionsTab, TableRenderer, utils, add, productGroup, product, _createClass, _get, panelDefaults, TableCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_transformers) {
      transformDataToTable = _transformers.transformDataToTable;
    }, function (_editor) {
      tablePanelEditor = _editor.tablePanelEditor;
    }, function (_column_options) {
      columnOptionsTab = _column_options.columnOptionsTab;
    }, function (_renderer) {
      TableRenderer = _renderer.TableRenderer;
    }, function (_utils) {
      utils = _utils;
    }, function (_add_options) {
      add = _add_options;
    }, function (_product_group_options) {
      productGroup = _product_group_options;
    }, function (_product_options) {
      product = _product_options;
    }, function (_cssStyleCss) {}, function (_cssInstantSerachCss) {}],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);

          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc) {
          return desc.value;
        } else {
          var getter = desc.get;

          if (getter === undefined) {
            return undefined;
          }

          return getter.call(receiver);
        }
      };

      panelDefaults = {
        targets: [{}],
        transform: 'timeseries_to_columns',
        pageSize: null,
        showHeader: true,
        styles: [{
          type: 'date',
          pattern: 'Time',
          alias: 'Time',
          dateFormat: 'YYYY-MM-DD HH:mm:ss',
          headerColor: "rgba(51, 181, 229, 1)"
        }, {
          unit: 'short',
          type: 'number',
          alias: '',
          decimals: 2,
          headerColor: "rgba(51, 181, 229, 1)",
          colors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
          colorMode: null,
          pattern: '/.*/',
          thresholds: []
        }],
        columns: [],
        scroll: true,
        fontSize: '100%',
        sort: { col: 0, desc: true }
      };

      _export('TableCtrl', TableCtrl = function (_MetricsPanelCtrl) {
        _inherits(TableCtrl, _MetricsPanelCtrl);

        function TableCtrl($scope, $injector, templateSrv, annotationsSrv, $sanitize, variableSrv) {
          _classCallCheck(this, TableCtrl);

          var _this = _possibleConstructorReturn(this, (TableCtrl.__proto__ || Object.getPrototypeOf(TableCtrl)).call(this, $scope, $injector));

          _this.pageIndex = 0;
          var ctrl = _this;

          if (_this.panel.styles === void 0) {
            _this.panel.styles = _this.panel.columns;
            _this.panel.columns = _this.panel.fields;
            delete _this.panel.columns;
            delete _this.panel.fields;
          }

          _.defaults(_this.panel, panelDefaults);

          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          _this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_this));

          _this.currentFilterGroup = 'All';

          $(document).off('click', 'tr.tr-affect#master-data-product-tr');
          $(document).on('click', 'tr.tr-affect#master-data-product-tr', function (e) {
            var rowData = $('td', this).map(function (index, td) {
              if (td.childNodes.length === 2) {
                return td.childNodes[1].nodeValue;
              } else if (td.childNodes.length === 1) {
                return $(td).text();
              } else {
                return '';
              }
            });
            $scope.ctrl.currentProduct = utils.findProductById($scope.ctrl.products, rowData[2])[0];
            product.showProductOptionsModal($scope.ctrl);
          });
          return _this;
        }

        _createClass(TableCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', tablePanelEditor, 2);
            this.addEditorTab('Column Styles', columnOptionsTab, 3);
          }
        }, {
          key: 'onInitPanelActions',
          value: function onInitPanelActions(actions) {
            actions.push({ text: 'Export CSV', click: 'ctrl.exportCsv()' });
          }
        }, {
          key: 'issueQueries',
          value: function issueQueries(datasource) {
            this.pageIndex = 0;

            if (this.panel.transform === 'annotations') {
              this.setTimeQueryStart();
              return this.annotationsSrv.getAnnotations({
                dashboard: this.dashboard,
                panel: this.panel,
                range: this.range
              }).then(function (annotations) {
                return { data: annotations };
              });
            }

            return _get(TableCtrl.prototype.__proto__ || Object.getPrototypeOf(TableCtrl.prototype), 'issueQueries', this).call(this, datasource);
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.dataRaw = [];
            this.render();
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {

            if (dataList.length === 0 || dataList === null || dataList === undefined) {
              return;
            }

            if (dataList[0].type !== 'table') {
              utils.alert('error', 'Error', 'To show the product list, please format data as a TABLE in the Metrics Setting');
              return;
            }

            this.productGroups = [];
            this.productGroupsFilter = [];

            if (dataList[1]) {
              if (dataList[1].type !== 'table') {
                utils.alert('error', 'Error', 'To show the product list, please format data as a TABLE in the Metrics Setting');
                return;
              }

              this.productGroups = dataList[1].rows.flat().sort();
              this.productGroupsFilter = dataList[1].rows.flat().sort();
            }

            if (dataList[2]) {
              if (dataList[2].type !== 'table') {
                utils.alert('error', 'Error', 'To show the product list, please format data as a TABLE in the Metrics Setting');
                return;
              }
              this.materials = utils.getRestructuredData(dataList[2].columns, dataList[2].rows);
              this.materialsDataList = this.materials.reduce(function (arr, mat) {
                var item = mat.id + ' | ' + mat.description;
                arr.push(item);
                return arr;
              }, []);
            }

            this.productGroupsFilter.splice(0, 0, 'All');

            this.products = utils.getRestructuredProduct(dataList[0].columns, dataList[0].rows);
            this.productDimension = utils.getDimension(dataList[0].columns);

            this.dataRaw = dataList;
            this.dataRawUnChange = utils.copy(dataList);
            this.pageIndex = 0;
            // automatically correct transform mode based on data
            if (this.dataRaw && this.dataRaw.length) {
              if (this.dataRaw[0].type === 'table') {
                this.panel.transform = 'table';
              } else {
                if (this.dataRaw[0].type === 'docs') {
                  this.panel.transform = 'json';
                } else {
                  if (this.panel.transform === 'table' || this.panel.transform === 'json') {
                    this.panel.transform = 'timeseries_to_rows';
                  }
                }
              }
            }

            if (this.currentFilterGroup !== 'All') {
              this.onGroupFilterChange();
            }

            this.render();
          }
        }, {
          key: 'onAddButtonClick',
          value: function onAddButtonClick() {
            add.showAddOptionsModal(this);
          }
        }, {
          key: 'onProductGroupButtonClick',
          value: function onProductGroupButtonClick() {
            productGroup.showProductGroupOptionsModal(this);
          }
        }, {
          key: 'onGroupFilterChange',
          value: function onGroupFilterChange() {
            var _this2 = this;

            this.dataRaw[0].rows = this.dataRawUnChange[0].rows;

            if (this.currentFilterGroup !== 'All') {
              this.dataRaw[0].rows = this.dataRaw[0].rows.filter(function (row) {
                return row[_this2.productDimension.indexOf('product_group')] === _this2.currentFilterGroup;
              });
            }

            this.render();
          }
        }, {
          key: 'render',
          value: function render() {
            this.table = transformDataToTable(this.dataRaw, this.panel);
            // console.log(this.panel.sort);
            this.table.sort(this.panel.sort);
            // console.log(this.panel.sort);
            this.renderer = new TableRenderer(this.panel, this.table, this.dashboard.isTimezoneUtc(), this.$sanitize, this.templateSrv, this.col);

            return _get(TableCtrl.prototype.__proto__ || Object.getPrototypeOf(TableCtrl.prototype), 'render', this).call(this, this.table);
          }
        }, {
          key: 'toggleColumnSort',
          value: function toggleColumnSort(col, colIndex) {
            // remove sort flag from current column
            if (this.table.columns[this.panel.sort.col]) {
              this.table.columns[this.panel.sort.col].sort = false;
            }

            if (this.panel.sort.col === colIndex) {
              if (this.panel.sort.desc) {
                this.panel.sort.desc = false;
              } else {
                this.panel.sort.col = null;
              }
            } else {
              this.panel.sort.col = colIndex;
              this.panel.sort.desc = true;
            }
            this.render();
          }
        }, {
          key: 'exportCsv',
          value: function exportCsv() {
            var scope = this.$scope.$new(true);
            scope.tableData = this.renderer.render_values();
            scope.panel = 'table';
            this.publishAppEvent('show-modal', {
              templateHtml: '<export-data-modal panel="panel" data="tableData"></export-data-modal>',
              scope: scope,
              modalClass: 'modal--narrow'
            });
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            var data = void 0;
            var panel = ctrl.panel;
            var pageCount = 0;

            function getTableHeight() {
              var panelHeight = ctrl.height;

              if (pageCount > 1) {
                panelHeight -= 26;
              }

              return panelHeight - 31 + 'px';
            }

            function appendTableRows(tbodyElem) {
              ctrl.renderer.setTable(data);
              tbodyElem.empty();
              tbodyElem.html(ctrl.renderer.render(ctrl.pageIndex));
            }

            function switchPage(e) {
              var el = $(e.currentTarget);
              ctrl.pageIndex = parseInt(el.text(), 10) - 1;
              renderPanel();
            }

            function appendPaginationControls(footerElem) {
              footerElem.empty();

              var pageSize = panel.pageSize || 100;
              pageCount = Math.ceil(data.rows.length / pageSize);
              if (pageCount === 1) {
                return;
              }

              var startPage = Math.max(ctrl.pageIndex - 3, 0);
              var endPage = Math.min(pageCount, startPage + 9);

              var paginationList = $('<ul></ul>');

              for (var i = startPage; i < endPage; i++) {
                var activeClass = i === ctrl.pageIndex ? 'active' : '';
                var pageLinkElem = $('<li><a class="table-panel-page-link pointer ' + activeClass + '">' + (i + 1) + '</a></li>');
                paginationList.append(pageLinkElem);
              }

              footerElem.append(paginationList);
            }

            function renderPanel() {
              var panelElem = elem.parents('.panel-content');
              var rootElem = elem.find('.table-panel-scroll');
              var tbodyElem = elem.find('tbody');
              var footerElem = elem.find('.table-panel-footer');

              elem.css({ 'font-size': panel.fontSize });
              panelElem.addClass('table-panel-content');

              appendTableRows(tbodyElem);
              appendPaginationControls(footerElem);
              var height = parseInt(getTableHeight().split('px')[0]) - 38 + 'px';
              rootElem.css({ 'max-height': panel.scroll ? height : '' });
            }

            // hook up link tooltips
            elem.tooltip({
              selector: '[data-link-tooltip]'
            });

            function addFilterClicked(e) {
              var filterData = $(e.currentTarget).data();
              var options = {
                datasource: panel.datasource,
                key: data.columns[filterData.column].text,
                value: data.rows[filterData.row][filterData.column],
                operator: filterData.operator
              };

              ctrl.variableSrv.setAdhocFilter(options);
            }

            elem.on('click', '.table-panel-page-link', switchPage);
            elem.on('click', '.table-panel-filter-link', addFilterClicked);

            var unbindDestroy = scope.$on('$destroy', function () {
              elem.off('click', '.table-panel-page-link');
              elem.off('click', '.table-panel-filter-link');
              unbindDestroy();
            });

            ctrl.events.on('render', function (renderData) {
              data = renderData || data;
              if (data) {
                renderPanel();
              }
              ctrl.renderingCompleted();
            });
          }
        }]);

        return TableCtrl;
      }(MetricsPanelCtrl));

      _export('TableCtrl', TableCtrl);

      TableCtrl.templateUrl = './partials/module.html';
    }
  };
});
//# sourceMappingURL=table_ctrl.js.map
