var Widget = kendo.ui.Widget;
var Shape = kendo.dataviz.diagram.Shape;
var Connection = kendo.dataviz.diagram.Connection;
var Rectangle = kendo.dataviz.diagram.Rect;
var Point = kendo.dataviz.diagram.Point;
var DropDownList = kendo.ui.DropDownList;
var PanelBar = kendo.ui.PanelBar;
var Diagram = kendo.dataviz.ui.Diagram;
var Upload = kendo.ui.Upload;
var Kwindow = kendo.ui.Window;
var diagram;
(function (diagram) {
    'use strict';
    var DiagramController = (function () {
        function DiagramController($scope, $window) {
            var _this = this;
            this.$scope = $scope;
            this.$window = $window;
            this.shapePropertiesChange = function (e) {
                var elements = _this.selected || [];
                var i, element;
                for (i = 0; i < elements.length; i++) {
                    element = elements[i];
                    if (element instanceof Shape) {
                        var shape = element;
                        shape.redraw({
                            fill: _this.selectedShape.options.fill,
                            stroke: _this.selectedShape.options.stroke
                        });
                        shape.bounds(_this.selectedShape.height, _this.selectedShape.width, _this.selectedShape.x, _this.selectedShape.y);
                    }
                }
            };
            this.exportClick = function (e) {
                var json = JSON.stringify(_this.diagramWidget.save()), blob = new Blob([json], { type: "application\/json" });
                var element = angular.element(e.target);
                var download = element.attr('download');
                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(blob, download);
                }
                else {
                    element.attr('href', _this.$window.URL.createObjectURL(blob));
                }
            };
            this.aboutClick = function (e) {
                _this.windowWidget.center().open();
            };
            var vm = this;
            vm.menuOptions = {
                dataSource: [
                    {
                        text: "New", spriteCssClass: "new-item", items: [
                            { text: "Blank", spriteCssClass: "blank-item", cssClass: "active" }
                        ]
                    },
                    { text: "Open<input kendo-upload='upload' type='file' name='files' k-options='vm.uploadOptions' />", encoded: false, spriteCssClass: "open-item", cssClass: "upload-item" },
                    { text: "Save<a id='export' download='diagram.json' ng-click='vm.exportClick($event)'></a>", encoded: false, spriteCssClass: "save-item" },
                    { text: "Undo", spriteCssClass: "undo-item", cssClass: "active" },
                    { text: "Redo", spriteCssClass: "redo-item", cssClass: "active" },
                    { text: "Copy", spriteCssClass: "copy-item", cssClass: "active" },
                    { text: "Paste", spriteCssClass: "paste-item", cssClass: "active" }
                ],
                select: function (e) {
                    var item = angular.element(e.item), itemText = item.children(".k-link").text();
                    if (!item.hasClass("active")) {
                        return;
                    }
                    actions[itemText.charAt(0).toLowerCase() + itemText.slice(1)](e);
                }
            };
            vm.splitterOptions = {
                panes: [
                    { collapsible: true, size: "200px" },
                    { collapsible: false, scrollable: false },
                    { collapsible: true, size: "300px" }
                ]
            };
            vm.panelBarOptions = {};
            vm.colorPickerOptions = {
                value: "#ffffff",
                buttons: false
            };
            vm.canvasLayoutOptions = {
                dataTextField: "text",
                dataValueField: "value",
                dataSource: [
                    { text: "Tree Down", type: "tree", subtype: "down" },
                    { text: "Tree Up", type: "tree", subtype: "up" },
                    { text: "Tree Left", type: "tree", subtype: "left" },
                    { text: "Tree Right", type: "tree", subtype: "right" },
                    { text: "Radial Tree", type: "tree", subtype: "radial" },
                    { text: "Tip Over Tree", type: "tree", subtype: "typeover" },
                    { text: "Layered Horizontal", type: "layered", subtype: "horizontal" },
                    { text: "Layered Vertical", type: "layered", subtype: "vertial" },
                    { text: "Force Directed", type: "force", subtype: "directed" },
                    { text: "Mindmap Vertical", type: "tree", subtype: "mindmapvertical" },
                    { text: "Mindmap Horizontal", type: "tree", subtype: "mindmaphorizontal" }
                ],
                change: function (e) {
                    vm.diagramWidget.layout({
                        type: e.sender.dataItem().type,
                        subtype: e.sender.dataItem().subtype,
                        animation: true
                    });
                    vm.$scope.$digest();
                }
            };
            vm.connectionCapOptions = {
                dataTextField: "text",
                dataValueField: "value",
                dataSource: [
                    { value: "None", text: "None" },
                    { value: "ArrowStart", text: "Arrow Start" },
                    { value: "ArrowEnd", text: "Arrow End" },
                    { value: "FilledCircle", text: "Filed Circle" }
                ],
                change: function (e) {
                    var elements = vm.selected || [], element;
                    for (var i = 0; i < elements.length; i++) {
                        element = elements[i];
                        if (element instanceof Connection) {
                            element.redraw(vm.selectedConnection.options);
                        }
                    }
                    _this.$scope.$digest();
                }
            };
            vm.shapeItemDraggableOptions = {
                hint: function (e) {
                    return e.clone(true, false);
                }
            };
            vm.alignConfigurationOptions = {
                click: function (e) {
                    var position = e.sender.element.data("position");
                    _this.diagramWidget.alignShapes(position);
                }
            };
            vm.arrangeConfigurationOptions = {
                click: function (e) {
                    var methodName = e.sender.element.find("span").attr("class");
                    _this.diagramWidget[methodName]();
                }
            };
            vm.diagramZoomOptions = {
                min: 10,
                max: 200,
                value: 100,
                smallStep: 10,
                largeStep: 50,
                tickPlacement: "none",
                showButtons: false,
                change: function (e) {
                    _this.diagramWidget.zoom(e.value / 100, null);
                    _this.$scope.$digest();
                }
            };
            vm.windowWidgetOptions = {
                visible: false,
                width: 800,
                resizable: false,
                title: "About"
            };
            vm.diagramWidgetOptions = {
                dataSource: {
                    data: new kendo.data.ObservableArray([{
                            name: "0",
                            activities: [{
                                    name: "0"
                                }]
                        }]),
                    schema: {
                        model: {
                            children: "activities"
                        }
                    }
                },
                shapeDefaults: {
                    width: 120,
                    height: 120,
                    fill: "#8ebc00"
                },
                layout: {
                    type: "tree",
                    subtype: "down"
                },
                select: function (e) {
                    if (e.selected.length) {
                        vm.selected = e.selected;
                        var element = vm.selected[0];
                        if (element instanceof Shape) {
                            vm.selectedShape = element;
                        }
                        else if (element instanceof Connection) {
                            vm.selectedConnection = element;
                        }
                    }
                    vm.$scope.$digest();
                },
                itemRotate: function (e) {
                    vm.$scope.$digest();
                },
                zoomEnd: function (e) {
                    vm.$scope.$digest();
                }
            };
            vm.uploadOptions = {
                async: {
                    saveUrl: "save",
                    removeUrl: "remove",
                    autoUpload: true
                },
                showFileList: false,
                localization: {
                    select: ""
                },
                select: function (e) {
                    if (typeof (FileReader) !== "undefined") {
                        var f = e.files[0].rawFile, reader = new FileReader();
                        reader.onload = (function (file) {
                            return function (e) {
                                _this.diagramWidget.load(JSON.parse(e.target.result));
                            };
                        })(f);
                        reader.readAsBinaryString(f);
                    }
                }
            };
            var actions = {
                blank: function (e) {
                    _this.diagramWidget.clear();
                },
                undo: function (e) {
                    _this.diagramWidget.undo();
                },
                redo: function (e) {
                    _this.diagramWidget.redo();
                },
                copy: function (e) {
                    _this.diagramWidget.copy();
                },
                paste: function (e) {
                    _this.diagramWidget.paste();
                }
            };
            vm.$scope.$on('kendoWidgetCreated', function (event, widget) {
                if (widget == _this.$scope.diagramWidget) {
                    vm.diagramWidget = vm.$scope.diagramWidget;
                    vm.diagramWidget.element.kendoDropTarget({
                        drop: function (e) {
                            var item, pos, transformed;
                            if (e.draggable.hint) {
                                item = e.draggable.hint.data("shape");
                                pos = e.draggable.hintOffset;
                                pos = new Point(pos.left, pos.top);
                                transformed = vm.diagramWidget.documentToModel(pos);
                                item.x = transformed.x;
                                item.y = transformed.y;
                                vm.diagramWidget.addShape(item, true);
                            }
                        }
                    });
                }
                else if (widget instanceof PanelBar) {
                    var panelBar = widget;
                    panelBar.expand(">li", false);
                }
                else if (widget instanceof Kwindow) {
                    vm.windowWidget = widget;
                }
            });
        }
        DiagramController.$inject = ['$scope', '$window'];
        return DiagramController;
    })();
    angular
        .module('diagram')
        .controller('diagram.DiagramController', DiagramController);
})(diagram || (diagram = {}));

//# sourceMappingURL=diagram.controller.js.map
