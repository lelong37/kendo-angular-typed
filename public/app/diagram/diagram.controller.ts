/// <reference path="../../../typings/tsd.d.ts" />

import Widget = kendo.ui.Widget;
import Shape = kendo.dataviz.diagram.Shape;
import Connection = kendo.dataviz.diagram.Connection;
import Rectangle = kendo.dataviz.diagram.Rect;
import Point = kendo.dataviz.diagram.Point;
import DropDownList = kendo.ui.DropDownList;
import IDropDownListOptions = kendo.ui.DropDownListOptions;
import IPointOptions = kendo.dataviz.diagram.PointOptions;
import PanelBar = kendo.ui.PanelBar;
import IPanelBarOptions = kendo.ui.PanelBarOptions;
import IShapeOptions = kendo.dataviz.diagram.ShapeOptions;
import IColorPickerOptions = kendo.ui.ColorPickerOptions;
import IDiagramOptions = kendo.dataviz.ui.DiagramOptions;
import IUploadOptions = kendo.ui.UploadOptions;
import IMenuOptions = kendo.ui.MenuOptions;
import ISplitterOptions = kendo.ui.SplitterOptions;
import ISliderOptions = kendo.ui.SliderOptions;
import Diagram = kendo.dataviz.ui.Diagram;
import Upload = kendo.ui.Upload;
import IWindowOptions = kendo.ui.WindowOptions;
import IDraggableOptions = kendo.ui.DraggableOptions;
import IButtonOptions = kendo.ui.ButtonOptions;
import IDropDownListChangeEvent = kendo.ui.DropDownListChangeEvent;
import IButtonEvent = kendo.ui.ButtonEvent;
import ISliderChangeEvent = kendo.ui.SliderChangeEvent;
import IDropTargetOptions = kendo.ui.DropTargetOptions;
import IDiagramSelectEvent = kendo.dataviz.ui.DiagramSelectEvent;
import IDiagramItemRotateEvent = kendo.dataviz.ui.DiagramItemRotateEvent;
import IButtonClickEvent = kendo.ui.ButtonClickEvent;
import IMenuSelectEvent = kendo.ui.MenuSelectEvent;
import IUploadSelectEvent = kendo.ui.UploadSelectEvent;
import IDiagramZoomEndEvent = kendo.dataviz.ui.DiagramZoomEndEvent;
import Kwindow = kendo.ui.Window;

module diagram {
    'use strict';
    
    interface IMenuActions {
        blank: (e: IMenuSelectEvent) => void;
        undo: (e: IMenuSelectEvent) => void;
        redo: (e: IMenuSelectEvent) => void;
        copy: (e: IMenuSelectEvent) => void;
        paste: (e: IMenuSelectEvent) => void;
    }

    interface IDiagramScope extends ng.IScope {
        diagramWidget: Diagram;
        uploadWidget: Upload;
    }
    
    export interface IDiagramController {
        diagramWidget: Diagram;
        diagramWidgetOptions: IDiagramOptions;
        canvasBackgroundColor: string;
        selected: Array<any>;
        selectedShape: Shape;
        selectedConnection: Connection;
        diagramZoomOptions: ISliderOptions;
        menuOptions: IMenuOptions;
        uploadOptions: IUploadOptions;
        splitterOptions: ISplitterOptions;
        panelBarOptions: IPointOptions;
        colorPickerOptions: IColorPickerOptions;
        canvasLayoutOptions: IDropDownListOptions;
        connectionCapOptions: IDropDownListOptions;
        windowWidgetOptions: IWindowOptions;
        shapeItemDraggableOptions: IDraggableOptions;
        alignConfigurationOptions: IButtonOptions;
        arrangeConfigurationOptions: IButtonOptions;
        windowWidget: Kwindow;
        shapePropertiesChange: (e: JQuery) => void;
        exportClick: (e: HTMLAnchorElement) => void;
    }
    
    class DiagramController implements IDiagramController {
      

        static $inject = ['$scope', '$window'];

        constructor(private $scope: IDiagramScope, private $window: any) {

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
                select: (e: IMenuSelectEvent) => {
                    var item = angular.element(e.item),
                        itemText = item.children(".k-link").text();

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

            vm.panelBarOptions = {
                // expandMode: "multiple";
            };

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
                change: (e: IDropDownListChangeEvent): void => {
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
                change: (e: IDropDownListChangeEvent): void => {
                    var elements = vm.selected || [],
                        element;

                    for (var i: number = 0; i < elements.length; i++) {
                        element = elements[i];
                        if (element instanceof Connection) {
                            element.redraw(vm.selectedConnection.options);
                        }
                    }

                    this.$scope.$digest();
                }
            };

            vm.shapeItemDraggableOptions = {
                hint: (e: JQuery): JQuery => {
                    return e.clone(true, false);
                }
            };

            vm.alignConfigurationOptions = {
                click: (e: IButtonClickEvent): void => {
                    var position = e.sender.element.data("position");
                    this.diagramWidget.alignShapes(position);
                }
            };

            vm.arrangeConfigurationOptions = {
                click: (e: IButtonClickEvent): void => {
                    var methodName = e.sender.element.find("span").attr("class");
                    this.diagramWidget[methodName]();
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
                change: (e: ISliderChangeEvent): void => {
                    this.diagramWidget.zoom(e.value / 100, null);
                    this.$scope.$digest();
                }
            };

            vm.windowWidgetOptions = {
                visible: false,
                width: 800,
                resizable: false,
                title: "About"
            };

            vm.diagramWidgetOptions = {
                // theme: "default",
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
                    subtype: "down",
                    // animation: true
                },
                select: (e: IDiagramSelectEvent) => {
                    if (e.selected.length) {
                        vm.selected = e.selected;
                        var element = vm.selected[0];
                        if (element instanceof Shape) {
                            vm.selectedShape = element;
                        } else if (element instanceof Connection) {
                            vm.selectedConnection = element;
                        }
                    }

                    vm.$scope.$digest();
                },
                itemRotate: (e: IDiagramItemRotateEvent) => {
                    vm.$scope.$digest();
                },
                zoomEnd: (e: IDiagramZoomEndEvent) => {
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
                select: (e: IUploadSelectEvent) => {
                    if (typeof (FileReader) !== "undefined") {
                        var f = (e.files[0] as any).rawFile,
                            reader: any = new FileReader();

                        reader.onload = ((file) => {
                            return (e) => {
                                this.diagramWidget.load(JSON.parse(e.target.result));
                            };
                        })(f);
                        reader.readAsBinaryString(f);
                    }
                }
            };

            var actions: IMenuActions = {
                blank: (e: IMenuSelectEvent): void => {
                    this.diagramWidget.clear();
                },
                undo: (e: IMenuSelectEvent): void => {
                    this.diagramWidget.undo();
                },
                redo: (e: IMenuSelectEvent): void => {
                    this.diagramWidget.redo();
                },
                copy: (e: IMenuSelectEvent): void => {
                    this.diagramWidget.copy();
                },
                paste: (e: IMenuSelectEvent): void => {
                    this.diagramWidget.paste();
                }
            };

            var x;

            vm.$scope.$on('kendoWidgetCreated', (event, widget: Widget) => {
                if (widget == this.$scope.diagramWidget) {
                    vm.diagramWidget = vm.$scope.diagramWidget;

                    vm.diagramWidget.element.kendoDropTarget({
                        drop: (e: any) => {
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
                } else if (widget instanceof PanelBar) {
                    var panelBar = <PanelBar>widget;
                    panelBar.expand(">li", false);
                } else if (widget instanceof Kwindow) {
                    vm.windowWidget = widget;
                }
            });
        }

        public shapePropertiesChange = (e: JQuery): void => {
            var elements = this.selected || [];
            var i: number, element;
            for (i = 0; i < elements.length; i++) {
                element = elements[i];
                if (element instanceof Shape) {
                    var shape = element;

                    shape.redraw({
                        fill: this.selectedShape.options.fill,
                        stroke: this.selectedShape.options.stroke
                    });

                    shape.bounds(
                        this.selectedShape.height,
                        this.selectedShape.width,
                        this.selectedShape.x,
                        this.selectedShape.y
                    );
                    
                }
            }
        };

        public exportClick = (e: HTMLAnchorElement): void => {
            var json = JSON.stringify(this.diagramWidget.save()),
                blob = new Blob([json], { type: "application\/json" });

            var element = angular.element(e.target);
            var download = element.attr('download');

            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, download);
            } else {
                element.attr('href', this.$window.URL.createObjectURL(blob));
            }
        }

        public aboutClick = (e: JQuery): void => {
            this.windowWidget.center().open();
        }
    }

    angular
        .module('diagram')
        .controller('diagram.DiagramController', DiagramController);
}

