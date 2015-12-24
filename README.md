# Kendo, AngularJS and TypeScript <3
by: [Long Le](http://twitter.com/lelong37) *TDE @ [Neudesic](http://neudesic.com)*

What does the world look like in TypeScript? What would you gain or loose coding in TypeScript vs. ES6? If anyones been pondering on this question, today we'll do a deep dive to help you sort these answers out yourself. Best way to illustrate this is with code, so let's dive right into it. We'll start with converting one of Kendo UI's sample apps, and the winner will the their Layout Diagram App, this would be a good candidate since it's slammed with Kendo UI controls of all sorts. With many of us developing with ng (AngularJS), we'll go ahead and refactor it from it's jQuery implementation to ng in the process as well. For those of us that aren't using ng, simply ignore the specific ng bits.

## Preparation
###Prerequisites

* Node.js (which will install npm - Node Package Manager)
* IDE is TypeScript friendly
    * VSCode *(my perosnal defacto standard IDE & the one used for this article)*
    * WebStorm
    * Sublime (w/ TypeScript plug-in)
    * Atom (w/ TypeScript plug-in)
    * Visual Studio (all editions)
* TSD (TypeScript Definition Manager - command line tool)

###TSD (TypeScript Definition Manager)

You'll need to download all your TypeScript definitions (http://definitelytyped.org/tsd/),think of this as all the definitions for your JS libraries that are in your project e.g. AngularJS, lodash, Kendo UI, etc. You can think of the TSD command-line tool equivalient to all our other package (like) dependency tools e.g. nuget, bower, npm, etc. 

To install TSD (need to have node.js already installed for npm command line tool) -g is an option to install tsd globally so you can execute tsd from any command line.

```
npm install tsd -g
```

You can now search and install other TypeScript packages. Note: tsd currently has all defnitions for both client side (browser) JS libraries and server side JS libraries (npm) as well.

```
tsd query angular
```
Which would yield these results
```
 - angular-agility            / angular-agility               
 - angular-bootstrap-lightbox / angular-bootstrap-lightbox    
 - angular-dialog-service     / angular-dialog-service        
 - angular-dynamic-locale     / angular-dynamic-locale        
 - angular-file-upload        / angular-file-upload           
 - angular-formly             / angular-formly                
 - angular-gettext            / angular-gettext               
 - angular-google-analytics   / angular-google-analytics      
 - angular-growl-v2           / angular-growl-v2              
 - angular-hotkeys            / angular-hotkeys
 - angularjs                  / angular                    
 
 list shortened for brevity...     
```

You can then install a specific one e.g. installing angular, notice how TypeScript Definition files are suffixed with "d.ts" e.g. angular.d.ts for the AngularJS TypeScript defiinition file. Notice how we passed in the --save option, this will create a tsd.d.ts file if it doesn't already exists and add an entry in this file for each of our project TypeScript definition dependencies our project has.

```
tsd install angular --save
```

```
├── myapp/
│   ├── typings
│   │   ├── angularjs
│   │   │   ├── anguar.d.ts
│   │   ├── tsd.d.ts
```
Notice how we have a line added for our angular tsd dependency now along with all our other tsd dependencies for our app/project.

**tsd.d.ts**

https://github.com/lelong37/kendo-angular-typed/blob/master/tsd.json
```json
/// <reference path="express/express.d.ts" />
/// <reference path="node/node.d.ts" />
/// <reference path="stylus/stylus.d.ts" />
/// <reference path="serve-favicon/serve-favicon.d.ts" />
/// <reference path="morgan/morgan.d.ts" />
/// <reference path="body-parser/body-parser.d.ts" />
/// <reference path="errorhandler/errorhandler.d.ts" />
/// <reference path="serve-static/serve-static.d.ts" />
/// <reference path="mime/mime.d.ts" />
/// <reference path="../public/lib/kendo-ui/typescript/kendo.all.d.ts" />
/// <reference path="angularjs/angular.d.ts" />
/// <reference path="angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="jquery/jquery.d.ts" />
```
Notice how the Kendo UI tsd is in the list (above), sometimes JS libraries we download e.g. kendo, anguar-ui-router, etc. include the tsd with them. In these cases we can just open up the tsd.d.ts file and reference them directly to where they are in our app/project directory structure (relative path).  

For this article we'll refactor the Kendo UI Diagram Sample Application (http://demos.telerik.com/kendo-ui/html5-diagram-sample-app) to TypeScript using AngularJS. This will be good sample to work with because it has a long list of Kendo UI widgets that is used in this sample app. With this we can illustrate working with a vast amount of Kendo UI widgets with TypeScript and AngularJS. 

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

IDiagramController Interface - diagram.controller.ts
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
Now we can setup the class/implementation for IDiagramController which will use as the ng Controller/ViewModel for our ng View. Notice below our class or implementation is when we then register our DiagramController with Angular. Note: we've also recommend this approach with Angular 1.x because this will play nicely if any whenver you deciede to upgrade to Angular v2.
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

## TypeScript Development & Build Time Awesomeness

Note: Notice immediately in VSCode I immediately get warnings that my interface has not been properly implemented and if I were to transpile my TypeScript I would indeed get build errors of this. This would be effectively the same if I were mix types as well (e.g. declare something of number then try to save a string value to it). 

![ss](https://github.com/lelong37/kendo-angular-typed/blob/master/markdown/images/2015-12-23_21-44-56.png?raw=true)

Note: When fully Typing with TypeScript, notice how you will now get dev-time or build time errors when your types are mixed or inconsistent as you would with a statically typed language e.g. C#, Java, C++, etc. Below TypeScript is able to infer that myArray is of type ObservableArray from the declaration, however we then try to set myArray to an ObservableObject and TypeScript immediately indicates something has is wrong here. 

![ss](https://github.com/lelong37/kendo-angular-typed/blob/master/markdown/images/2015-12-23_21-49-51.png?raw=true)

##Refactoring the Actions and Kendo Menu
Before (jQuery and JavaScript)
```js
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

```
After (TypeScript & AngularJS) - diagram.controller.ts

https://github.com/lelong37/kendo-angular-typed/blob/master/public/app/diagram/diagram.controller.ts
```js
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
```
## Refactoring the ShapeProperties Change Event
Here we'll refactor the ShapeProperties change event, which syncronizes the selected object on the design surface to the change you made to one of it's properties e.g. Color, Stroke, etc.

Before (jQuery and JavaScript)
```js
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
```
After (TypeScript & AngularJS)

diagram.html

https://github.com/lelong37/kendo-angular-typed/blob/master/public/app/diagram/diagram.html

```html
<li>
    <span>Background Color:</span>
    <input kendo-color-picker 
        ng-model="vm.selectedShape.options.fill" 
        k-on-change="vm.shapePropertiesChange(kendoEvent)" />
</li>
<li>
    <span>Stroke Color:</span>
    <input 
        kendo-color-picker 
        ng-model="vm.selectedShape.options.stroke.color" 
        k-on-change="vm.shapePropertiesChange(kendoEvent)" />
</li>
<li>
    <span>Stroke Width:</span>
    <input kendo-numeric-text-box type="text" 
        k-ng-model="vm.selectedShape.options.stroke.width"
        k-on-change="vm.shapePropertiesChange(kendoEvent)" />
</li>

<!-- code shortened for brevity-->
```
diagram.controller.ts

https://github.com/lelong37/kendo-angular-typed/blob/master/public/app/diagram/diagram.controller.ts

We no longer have to scrape UI controls using jQuery selectors thanks to Angular's MVVM goodness. We are now binding directly to our ViewModel from the View (html markup snippet above).
```js
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
```

Note: Notice how we get nice real intellisense for even Kendo UI types. Again, this is because when we declared selectedShape, we proprely typed it to the actual Kendo UI Shape type. Obviously this would be the same for all library types you pulled in their TSD's for e.g. jQuery, Angular, lodash, etc. 

```js
var selectedShape: kendo.dataviz.diagram.Shape;
```

![ss](https://github.com/lelong37/kendo-angular-typed/blob/master/markdown/images/2015-12-23_22-26-25.png?raw=true)

Also we can now do a true "Find all References" or "Find all Usages" e.g. here will do a find "Find All References" for this.selectedShape on our ViewModel or Angular Controller. Given if this was something that was used solution/project wide, our results list would span the entire solution/project as well. 

![ss](https://github.com/lelong37/kendo-angular-typed/blob/master/markdown/images/2015-12-24_12-44-16.png?raw=true)

When doing this in VSCode it will open up the "peek" view and give you a list of all usages of "this.selectedShape" on the right, you can navigate to each occurence by clicking on them. As you navigate through the list the view on the right will automaticlally scroll to that occurence. 

![ss](https://github.com/lelong37/kendo-angular-typed/blob/master/markdown/images/2015-12-24_12-46-21.png?raw=true)

Hope your are able to get a glimpse of the power TypeScript brings to your productivity int terms of robust dev and build time experience it brings to JS. We've uploaded the completed sample used in this article of the refactored Kendo UI Diagram Application (TypeScript & AngularJS) to GitHub, which you can find here https://github.com/lelong37/kendo-angular-typed. We've also deployed the completed refactored application here http://kendo-typed.azurewebsites.net/app/diagram/diagram.html. Stay tuned for this two upcoming articles which will cover TypeScript with Kendo & Angular 2 and TypeScript with NativeScript...! If there is a preference of which article you guys want out first please let me know [@lelong37](http://twitter.com/lelong37).

Happy Coding...! :)