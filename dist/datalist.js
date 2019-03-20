"use strict";

System.register([], function (_export, _context) {
	"use strict";

	var _createClass, DataList;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [],
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

			_export("DataList", DataList = function () {
				function DataList(containerId, inputId, listId, options) {
					_classCallCheck(this, DataList);

					this.containerId = containerId;
					this.inputId = inputId;
					this.listId = listId;
					this.options = options;
				}

				_createClass(DataList, [{
					key: "create",
					value: function create() {
						var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

						var list = document.getElementById(this.listId);
						var filterOptions = this.options.filter(function (d) {
							return filter === "" || d.text.toLowerCase().replace(/ /g, '').includes(filter.toLowerCase().replace(/ /g, ''));
						});

						if (filterOptions.length === 0) {
							list.classList.remove("active");
						} else {
							list.classList.add("active");
						}

						list.innerHTML = filterOptions.map(function (o) {
							return "<li id=" + o.value + ">" + o.text + "</li>";
						}).join("");
					}
				}, {
					key: "addListeners",
					value: function addListeners(datalist) {
						var _this = this;

						var container = document.getElementById(this.containerId);
						var input = document.getElementById(this.inputId);
						var list = document.getElementById(this.listId);

						container.addEventListener("click", function (e) {
							if (e.target.id === _this.inputId) {
								container.classList.toggle("active");
							} else if (e.target.id === "datalist-icon") {
								container.classList.toggle("active");
								input.focus();
							}
						});

						input.addEventListener("input", function (e) {
							if (!container.classList.contains("active")) {
								container.classList.add("active");
							}
							datalist.create(input.value);
						});

						list.addEventListener("click", function (e) {
							if (e.target.nodeName.toLocaleLowerCase() === "li") {
								input.value = e.target.innerText;
								container.classList.remove("active");
							}
						});
					}
				}, {
					key: "removeListeners",
					value: function removeListeners() {
						var _this2 = this;

						var container = document.getElementById(this.containerId);
						var input = document.getElementById(this.inputId);
						var list = document.getElementById(this.listId);

						container.removeEventListener("click", function (e) {
							if (e.target.id === _this2.inputId) {
								container.classList.toggle("active");
							} else if (e.target.id === "datalist-icon") {
								container.classList.toggle("active");
								input.focus();
							}
						});

						input.removeEventListener("input", function (e) {
							if (!container.classList.contains("active")) {
								container.classList.add("active");
							}
							datalist.create(input.value);
						});

						list.removeEventListener("click", function (e) {
							if (e.target.nodeName.toLocaleLowerCase() === "li") {
								input.value = e.target.innerText;
								container.classList.remove("active");
							}
						});
					}
				}]);

				return DataList;
			}());

			_export("DataList", DataList);
		}
	};
});
//# sourceMappingURL=datalist.js.map
