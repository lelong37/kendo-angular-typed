# Kendo, AngularJS and TypeScript
by: [Long Le](http://twitter.com/lelong37)

What does the world look like in TypeScript? What would you gain or loose coding in TypeScript vs. ES6? If anyones been pondering on this question, today we'll do a deep dive to help you sort these answers out yourself. Best way to illustrate this is with code, so let's dive right into it. We'll start with converting one of Kendo UI's sample apps, and the winner will the their Layout Diagram App, this would be a good candidate since it's slammed with Kendo UI controls of all sorts. With many of us developing with ng (AngularJS), we'll go ahead and refactor it from it's jQuery implementation to ng in the process as well. For those of us that aren't using ng, simply ignore the specific ng bits.

## Preparation
First off, let's go ahead and address separation of concerns, we'll go ahead and separate the view (presentation) from the any logic and place that logic in the view model along with any other view like responsibilities like widget initializing and data-binding as well. 

Note: In TypeScript there is the notion of static typing your data types, and from what I've seen, most teams usually just fully qualify whatever their typing. However for this article we'll go ahead and alias most of Kendo UI typing's so that there shorter, cleaner and for sake of brevity of this article. Again, you can skip the aliasing of the namespaces step here and fully qualify everyting if you wanted to. 

e.g. Initializing an ObservableArray by fully qualified namespace
```js
var myArray = new kendo.data.ObservableArray([]);
```
e.g. Initializing an ObserverableArray by aliased namespace, 
```js
import ObserverablleArray = kendo.data.ObservableArray; // aliased
var myArray = new ObserverablleArray([]); // initialized w/ alias
```

## Abstraction with TypeScript Interfaces (optional)
As a general best practice, we like to create an interface for every ng Controller/ViewModel and place it in the same file as the implementation of the Controller. Why? A few important reasons why:

* Intent of the ng Controller (class) is clear, just by glancing at the interface we can quickly understand what the intent, responsibility and concerns are for it.
* Understand what is all bound to our ng.IScope ($scope)

IDiagramController Interface in DiagramController.ts
```js
interface IDiagramController {
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
```
Now we can setup the class/implementation for IDiagramController which will use as the ng Controller/ViewModel for our ng View. Notice below our class or implementation is when we then register our DiagramController with ng (AngularJS).
```js
class DiagramController implements IDiagramController {
    
    static $inject = ['$scope', '$window'];

    constructor(private $scope: IDiagramScope, private $window: any) {
        var vm = this;           
    }
}

angular
    .module('diagram')
    .controller('diagram.DiagramController', DiagramController);
```

Notice immediately in VSCode I immediately get warnings that my interface has not been properly implemented and if I were to transpile my TypeScript I would indeed get build errors of this. This would be effectively the same if I were mix types as well (e.g. declare something of number then try to save a string value to it). 

![ss](https://raw.githubusercontent.com/lelong37/kendo-angular-typed/master/markdown/images/2015-12-23_21-35-46.png)