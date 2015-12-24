# Kendo, AngularJS and TypeScript
by: [Long Le](http://twitter.com/lelong37)

What does the world look like in TypeScript? What would you gain or loose coding in TypeScript vs. ES6? If anyones been pondering on this question, today we'll do a deep dive to help you sort these answers out yourself. Best way to illustrate this is with code, so let's dive right into it. We'll start with converting one of Kendo UI's sample apps, and the winner will the their Layout Diagram App, this would be a good candidate since it's slammed with Kendo UI controls of all sorts. With many of us developing with ng (AngularJS), we'll go ahead and refactor it from it's jQuery implementation to ng in the process as well. For those of us that aren't using ng, simply ignore the specific ng bits.

## Preparation
First off, let's go ahead and address separation of concerns, we'll go ahead and separate the view from the any logic and place any logic in the view model. 

Before TypeScript & AngularJS:

<code>

    var Shape = kendo.dataviz.diagram.Shape,
        Connection = kendo.dataviz.diagram.Connection,
        Rect = kendo.dataviz.diagram.Rect,
        Point = kendo.dataviz.diagram.Point,
        selected;

    $("#canvasProperties").on("change", canvasPropertiesChange);

    var layoutMapping = {
        "TreeDown": {
            type: "tree",
            subtype: "down"
        },
        "TreeUp": {
            type: "tree",
            subtype: "up"
        },
        "TreeLeft": {
            type: "tree",
            subtype: "left"
        },
        "TreeRight": {
            type: "tree",
            subtype: "right"
        },
        "RadialTree": {
            type: "tree",
            subtype: "radial"
        },
        "TipOverTree": {
            type: "tree",
            subtype: "typeover"
        },
        "LayeredHorizontal": {
            type: "layered",
            subtype: "horizontal"
        },
        "LayeredVertical": {
            type: "layered",
            subtype: "vertial"
        },
        "ForceDirected": {
            type: "force",
            subtype: "directed"
        },
        "MindmapVertical": {
            type: "tree",
            subtype: "mindmapvertical"
        },
        "MindmapHorizontal": {
            type: "tree",
            subtype: "mindmaphorizontal"
        }
    };

    function canvasPropertiesChange() {
        diagram.element.css(
            "background-color",
            $("#canvasBackgroundColorPicker").getKendoColorPicker().value());

        var layout = layoutMapping[$("#canvasLayout").getKendoDropDownList().value()];

        diagram.layout({
            type: layout.type,
            subtype: layout.subtype,
            animation: true
        });
    }

    $("#shapeProperties").on("change", shapePropertiesChange);

    function shapePropertiesChange() {
        var elements = selected || [],
            options = {
                fill: $("#shapeBackgroundColorPicker").getKendoColorPicker().value(),
                stroke: {
                    color: $("#shapeStrokeColorPicker").getKendoColorPicker().value(),
                    width: $("#shapeStrokeWidth").getKendoNumericTextBox().value()
                }
            },
            bounds = new Rect(
                $("#shapePositionX").getKendoNumericTextBox().value(),
                $("#shapePositionY").getKendoNumericTextBox().value(),
                $("#shapeWidth").getKendoNumericTextBox().value(),
                $("#shapeHeight").getKendoNumericTextBox().value()
            ),
            element, i;

        for (i = 0; i < elements.length; i++) {
            element = elements[i];
            if (element instanceof Shape) {
                element.redraw(options);

                element.bounds(bounds);
            }
        }
    }

    function connectionPropertiesChange() {
        var elements = selected || [],
            options = {
                startCap: $("#connectionStartCap").getKendoDropDownList().value(),
                endCap: $("#connectionEndCap").getKendoDropDownList().value()
            },
            element;

        for (i = 0; i < elements.length; i++) {
            element = elements[i];
            if (element instanceof Connection) {
                element.redraw(options);
            }
        }
    }

    $("#connectionProperties").on("change", connectionPropertiesChange);

    $("#alignConfiguration .configurationButtons").kendoButton({
        click: function(e) {
            var value = this.element.data("position");
            diagram.alignShapes(value);
        }
    });

    $("#arrangeConfiguration .configurationButtons").kendoButton({
        click: function (e) {
            var methodName = this.element.find("span").attr("class");
            diagram[methodName]();
        }
    });

    $("#diagramZoomIndicator").change(function() {
        var value = $(this).val();
        $("#diagramZoom").getKendoSlider().value(value);
        diagram.zoom(value);
    });

    function reset() {
        diagram.clear();
    }

    function undo() {
        diagram.undo();
    }

    function redo() {
        diagram.redo();
    }

    function copyItem() {
        diagram.copy();
    }

    function pasteItem() {
        diagram.paste();
    }

    var actions = {
        blank: reset,
        undo: undo,
        redo: redo,
        copy: copyItem,
        paste: pasteItem
    };

    $("#menu ul").kendoMenu({
        dataSource: [
            { text: "New", spriteCssClass: "new-item", items: [
                { text: "Blank", spriteCssClass: "blank-item", cssClass: "active" }
                ]
            },
            { text: "Open<input id='upload' type='file' name='files' />", encoded: false, spriteCssClass: "open-item", cssClass: "upload-item" },
            { text: "Save<a id='export' download='diagram.json'></a>", encoded: false, spriteCssClass: "save-item" },
            { text: "Undo", spriteCssClass: "undo-item", cssClass: "active" },
            { text: "Redo", spriteCssClass: "redo-item", cssClass: "active" },
            { text: "Copy", spriteCssClass: "copy-item", cssClass: "active" },
            { text: "Paste", spriteCssClass: "paste-item", cssClass: "active" }
        ],
        select: function(e) {
            var item = $(e.item),
                itemText = item.children(".k-link").text();

            if (!item.hasClass("active")) {
                return;
            }

            actions[itemText.charAt(0).toLowerCase() + itemText.slice(1)]();
        }
    });

    $("#export").on("click", function() {
        var json = JSON.stringify(diagram.save()),
            blob = new Blob([json], {type: "application\/json"});;

        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, this.getAttribute("download"));
        } else {
            this.href = window.URL.createObjectURL(blob);
        }
    });

    $("#upload").kendoUpload({
        async: {
            saveUrl: "save",
            removeUrl: "remove",
            autoUpload: true
        },
        showFileList: false,
        localization: {
            select: ""
        },
        select: function(e) {
            if (typeof(FileReader) !== "undefined") {
                var f = e.files[0].rawFile,
                    reader = new FileReader;

                reader.onload = (function(file) {
                    return function(e) {
                        diagram.load(JSON.parse(e.target.result));
                    };
                })(f);

                reader.readAsBinaryString(f);
            }
        }
    });

    $("#splitter").kendoSplitter({
        panes: [
            { collapsible: true, size: "200px" },
            { collapsible: false, scrollable: false },
            { collapsible: true, size: "300px" }
        ]
    });



    var diagram = $("#diagram").kendoDiagram({
        theme: "default",
        dataSource: {
            data: [{
                name: "0",
                items: [{
                    name: "0"
                }]
            }],
            schema: {
                model: {
                    children: "items"
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
            subtype: "right"
        },
        select: function(e) {
            if (e.selected.length) {
                selected = e.selected;
                var element = e.selected[0];
                if (element instanceof Shape) {
                    updateShapeProperties(element.options);
                } else {
                    updateConnectionProperties(element.options);
                }
            }
        }
    }).getKendoDiagram();

    function updateShapeProperties(shape) {
        $("#shapeBackgroundColorPicker").getKendoColorPicker().value(kendo.parseColor(shape.background));
        $("#shapeStrokeColorPicker").getKendoColorPicker().value(kendo.parseColor(shape.stroke.color));
        $("#shapeStrokeWidth").getKendoNumericTextBox().value(shape.stroke.width);
        $("#shapeWidth").getKendoNumericTextBox().value(shape.width);
        $("#shapeHeight").getKendoNumericTextBox().value(shape.height);
        $("#shapePositionX").getKendoNumericTextBox().value(shape.x);
        $("#shapePositionY").getKendoNumericTextBox().value(shape.y);
    }

    function updateConnectionProperties(shape) {
        $("#connectionStartCap").getKendoDropDownList().value(shape.startCap);
        $("#connectionEndCap").getKendoDropDownList().value(shape.endCap);
    }

    $("#shapesPanelBar").kendoPanelBar({
        expandMode: "multiple"
    }).getKendoPanelBar().expand(">li", false);

    $("#configurationPanelBar").kendoPanelBar({
        expandMode: "multiple"
    }).getKendoPanelBar().expand(">li", false);

    $(".colorPicker").kendoColorPicker({
        value: "#ffffff",
        buttons: false
    });

    $("#canvasLayout").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { value: "TreeDown", text: "Tree Down" },
            { value: "TreeUp", text: "Tree Up" },
            { value: "TreeLeft", text: "Tree Left" },
            { value: "TreeRight", text: "Tree Right" },
            { value: "RadialTree", text: "Radial Tree" },
            { value: "TipOverTree", text: "Tip-Over Tree" },
            { value: "LayeredHorizontal", text: "Layered Horizontal" },
            { value: "LayeredVertical", text: "Layered Vertical" },
            { value: "ForceDirected", text: "Force directed" },
            { value: "MindmapVertical", text: "Mindmap Vertical" },
            { value: "MindmapHorizontal", text: "Mindmap Horizontal" }
        ]
    });

    $("#connectionStartCap").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { value: "None", text: "None" },
            { value: "ArrowStart", text: "Arrow Start" },
            { value: "ArrowEnd", text: "Arrow End" },
            { value: "FilledCircle", text: "Filed Circle" }
        ]
    });

    $("#connectionEndCap").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { value: "None", text: "None" },
            { value: "ArrowStart", text: "Arrow Start" },
            { value: "ArrowEnd", text: "Arrow End" },
            { value: "FilledCircle", text: "Filed Circle" }
        ]
    });

    function updateSliderIndicator(e) {
        $("#diagramZoomIndicator").attr("value", e.value);

        diagram.zoom(e.value / 100);
    }

    $("#diagramZoom").kendoSlider({
        min: 10,
        max: 200,
        value: 100,
        smallStep: 10,
        largeStep: 50,
        tickPlacement: "none",
        showButtons: false,
        change: updateSliderIndicator,
        slide: updateSliderIndicator
    });

    $(".numeric").kendoNumericTextBox();

    $("#window").kendoWindow({
        visible: false,
        width: 800,
        resizable: false,
        title: "About"
    });

    $("#about").click(function() {
        $(".about").getKendoWindow().center().open();
    });

    $("#shapesPanelBar .shapeItem").kendoDraggable({
        hint: function() {
            return this.element.clone();
        }
    });

    $("#diagram").kendoDropTarget({
        drop: function(e) {
            var item, pos, transformed;
            if (e.draggable.hint) {
                item = e.draggable.hint.data("shape");
                pos = e.draggable.hintOffset;
                pos = new Point(pos.left, pos.top);
                var transformed = diagram.documentToModel(pos);
                item.x = transformed.x;
                item.y = transformed.y;

                diagram.addShape(item);
            }
        }
    });

</code>

After TypeScript & AngularJS

<code>

    
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
        shapeItemDraggableOptions: IDraggableOptions;
        alignConfigurationOptions: IButtonOptions;
        arrangeConfigurationOptions: IButtonOptions;
        windowWidget: Kwindow;
        windowWidgetOptions: IWindowOptions;

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


</code>
