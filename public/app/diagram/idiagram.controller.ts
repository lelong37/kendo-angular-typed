/// <reference path="../../../typings/tsd.d.ts" />

import Shape = kendo.dataviz.diagram.Shape;
import Connection = kendo.dataviz.diagram.Connection;
import Rectangle = kendo.dataviz.diagram.Rect;
import Point = kendo.dataviz.diagram.Point;
import IDropDownListOptions = kendo.ui.DropDownListOptions;
import IPanelBarOptions = kendo.ui.PanelBarOptions;
import IButtonOptions = kendo.ui.ButtonOptions;
import ISliderOptions = kendo.ui.SliderOptions;
import IMenuOptions = kendo.ui.MenuOptions;
import IUploadOptions = kendo.ui.UploadOptions;
import IDiagramOptions = kendo.dataviz.ui.DiagramOptions;
import IDraggableOptions = kendo.ui.DraggableOptions;
import IColorPickerOptions = kendo.ui.ColorPickerOptions;
import IWindowOptions = kendo.ui.WindowOptions;
import ISplitterOptions = kendo.ui.SplitterOptions;
import Diagram = kendo.dataviz.ui.Diagram;
import IPointOptions = kendo.dataviz.diagram.PointOptions;
import Window = kendo.ui.Window;

export interface IDiagramController {
    diagramWidget:Diagram;
    diagramWidgetOptions:IDiagramOptions;
    canvasBackgroundColor:string;
    selected: Array<any>;
    selectedShape:Shape;
    selectedConnection:Connection;
    diagramZoomOptions:ISliderOptions;
    menuOptions:IMenuOptions;
    uploadOptions:IUploadOptions;
    splitterOptions:ISplitterOptions;
    panelBarOptions:IPointOptions;
    colorPickerOptions:IColorPickerOptions;
    canvasLayoutOptions:IDropDownListOptions;
    connectionCapOptions:IDropDownListOptions;
    windowWidgetOptions:IWindowOptions;
    shapeItemDraggableOptions:IDraggableOptions;
    alignConfigurationOptions:IButtonOptions;
    arrangeConfigurationOptions:IButtonOptions;
    windowWidget: Window;
    shapePropertiesChange: (e:JQuery) => void;
    exportClick: (e:HTMLAnchorElement) => void;
}