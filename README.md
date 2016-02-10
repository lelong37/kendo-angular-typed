What does the world look like in TypeScript? What do you gain or lose by coding in TypeScript versus ES6?

In case you've been pondering this question, today we'll do a deep dive to help you sort the answer. The best way to illustrate this is with code, so let's dive right into it. In this article, we'll convert one of Kendo UI's sample apps - the Layout Diagram App. I chose this example because it's stuffed with Kendo UI controls of all sorts. Since many of us develop with AngularJS, we'll go ahead and refactor it from its jQuery implementation to Angular as well (if you don't use Angular, the example is still relevant, simply ignore the specific Angular bits).

## Getting Set Up

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (which will install [npm](https://www.npmjs.com/))
*   An IDE that is [TypeScript](http://www.typescriptlang.org/) friendly. Here are _just a few:_
    *   [VSCode](https://code.visualstudio.com) _(my perosnal defacto standard IDE & the one used for this article)_
    *   [WebStorm](https://www.jetbrains.com/webstorm)
    *   [Sublime](http://www.sublimetext.com) (with the [TypeScript plug-in](https://github.com/Microsoft/TypeScript-Sublime-Plugin))
    *   [Atom](https://atom.io/) (with the [TypeScript plug-in](https://atom.io/packages/atom-typescript))
    *   [Visual Studio](https://www.visualstudio.com/en-us/visual-studio-homepage-vs.aspx) (all editions)
    *   [Eclipse](https://eclipse.org/downloads/)
*   [TSD](http://definitelytyped.org/tsd/) (TypeScript Definition Manager - command line tool)

### TSD (TypeScript Definition Manager)

You'll need to download all the [TypeScript definitions](http://definitelytyped.org/tsd. This contains the definitions for all of the JavaScript libraries that are in our project - AngularJS, lodash, Kendo UI, etc. You can think of the TSD command-line tool as the equivalient to other package dependency tools like Nuget, Bower, npm, etc.

To install TSD, you'll need to have Node.js/npm installed:

    npm install tsd -g

You can now search and install other TypeScript packages. Tsd currently has defnitions for both client-side (browser) JavaScript libraries and server side JavaScript libraries as well.

For example:

    tsd query angular

...yields these results (list shortened for brevity):

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

You can then install the specific ones you need.

    tsd install angular --save

You may notice how TypeScript definition files are suffixed with "d.ts" such as angular.d.ts for the AngularJS TypeScript defiinition file. Passing the `--save` option when installing a definition file will create a tsd.d.ts file if it doesn't already exists and add an entry in this file for each of our project's TypeScript definition dependencies.

Here's the folder sturcture after running this command:

    ├── myapp/
    │   ├── typings
    │   │   ├── angularjs
    │   │   │   ├── anguar.d.ts
    │   │   ├── tsd.d.ts

Below you will notice how a line has been added for our Angular tsd dependency now along with all the other tsd dependencies for our app/project in [tsd.d.ts](https://github.com/lelong37/kendo-angular-typed/blob/master/tsd.json).

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

You may notice that the Kendo UI tsd is in the list. Sometimes JavaScript libraries that we download such as Kendo UI, anguar-ui-router, and others include the tsd with them. In these cases we can just open up the tsd.d.ts file and reference them directly to where they are in our app/project directory structure (using a relative path).

## Get Coding

As I mentioned earlier, for this article, we'll refactor the [Kendo UI Diagram Sample Application](http://demos.telerik.com/kendo-ui/html5-diagram-sample-app) to TypeScript using AngularJS. This is a good sample to work with because it has a long list of Kendo UI widgets within sample app allowing us to illustrate working with a vast amount of Kendo UI widgets with TypeScript and AngularJS.

### Aliasing (optional)

In TypeScript there is the notion of static typing your data types, and from what I've seen, most teams usually just fully qualify whatever they're typing. However for this article we'll go ahead and alias most of Kendo UI typing's so that they're shorter and cleaner, for the sake of brevity of this article. Again, you can skip the aliasing of the namespaces step here and fully qualify everything if you wanted to.

For example, here we are initializing an `ObservableArray` using a fully qualified namespace:

    var myArray = new kendo.data.ObservableArray([]);

While, below, we are initializing an `ObserverableArray` using an aliased namespace:

    import ObserverablleArray = kendo.data.ObservableArray; // aliased
    var myArray = new ObserverablleArray([]); // initialized w/ alias

Next, let's go ahead and address separation of concerns. We'll separate the view (presentation) from the any logic and place that logic in the view model along with any other view-like responsibilities such as widget initializing and data-binding as well.

### Abstraction with TypeScript Interfaces (optional)

As a general best practice, I like to create an interface for every Angular Controller/ViewModel and place it in the same file as the implementation of the Controller. Why? Here are a few important reasons.

*   The intent of the ng Controller (class) is clear, just by glancing at the interface we can quickly understand what the intent, responsibility and concerns are for it.
*   To understand what is all bound to our `ng.IScope` (`$scope`)

Here is the IDiagramController interface (diagram.controller.ts):

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

Now we can setup the class/implementation for `IDiagramController` that we'll use as the Controller/ViewModel for our View. Notice, below, that our class or implementation is where we register our DiagramController with Angular. I've also recommended this approach with Angular 1.x because this will play nicely if any whenever you deciede to upgrade to Angular v2.

    class DiagramController implements IDiagramController {

        static $inject = ['$scope', '$window'];

        constructor(private $scope: IDiagramScope, private $window: any) {
            var vm = this;           
        }
    }

    angular
        .module('diagram')
        .controller('diagram.DiagramController', DiagramController);

## TypeScript Development Time & Build Time Awesomeness

The benefit of TypeScript is that it offers type safety for everything that is typed along with IDE support to identify development time and build time errors. When fully typing with TypeScript, you will get development-time or build-time errors when your types are mixed or inconsistent as you would with any statically typed language such as C#, Java, C++, etc.

For instance, if you are working in Visual Studio Code, you will notice that you immediately get warnings that the interface has not been properly implemented and if we were to transpile the TypeScript get build errors. This is effectively the same if we were mix types as well (e.g. declare something as a number then try to save a string value into it).

![typescript_type_error2](http://developer.telerik.com/wp-content/uploads/2016/01/typescript_type_error2.jpg)

Below TypeScript is able to infer that `myArray` is of type `ObservableArray` from the declaration. However, we then try to set `myArray` to an `ObservableObject`m TypeScript immediately indicates something is wrong here.

![typescript_type_error](http://developer.telerik.com/wp-content/uploads/2016/01/typescript_type_error.jpg)

### Refactoring the Actions and Kendo Menu

Let's look some examples of how the code gets refactored to support the new architecture. First, the jQuery and JavaScript version:

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

Compare that to the version written with TypeScript and AngularJS ([diagram.controller.ts](https://github.com/lelong37/kendo-angular-typed/blob/master/public/app/diagram/diagram.controller.ts)):

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

### Refactoring the ShapeProperties Change Event

Here we'll refactor the `ShapeProperties` change event, which syncronizes the selected object on the design surface when a change is made to one of it's properties such as color, stroke, etc.

First, the jQuery and JavaScript version:

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

Now let's look at the TypeScript & AngularJS version - [diagram.html](https://github.com/lelong37/kendo-angular-typed/blob/master/public/app/diagram/diagram.html):

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

Looking at [diagram.controller.ts](https://github.com/lelong37/kendo-angular-typed/blob/master/public/app/diagram/diagram.controller.ts), you'll notice that we no longer have to scrape UI controls using jQuery selectors thanks to Angular's MVVM goodness. We are now binding directly to our ViewModel from the View:

    public shapePropertiesChange = (e: JQuery): void => {
        var elements = this.selected || [];
        var i: number, element;

        elements.forEach((element) => {
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
        });
    };

### ES6 & ES7

You may notice that we get to use new features of [ES6/ECMA6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla) in TypeScript. For instance, we use arrow functions in the `forEach` method above (aka fat arrows and lambdas).

With the recent release of [TypeScript v1.7x](http://blogs.msdn.com/b/typescript/archive/2015/11/30/announcing-typescript-1-7.aspx), we even get to develop with new features of [ES7/ECMA7](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_7_support_in_Mozilla) today which all transpiles down to a compatible version that will run in today's browsers, even if they don't yet support ES6 or ES7.

### Intellisense

In addition, we get real Intellisense for even Kendo UI types because we declared `selectedShape` and typed it to the Kendo UI `Shape` type.

    var selectedShape: kendo.dataviz.diagram.Shape;

![typescript_types](http://developer.telerik.com/wp-content/uploads/2016/01/typescript_types.jpg)

Obviously this would be the same for all library types whose TSDs you imported, including jQuery, Angular and lodash.

In addition, we can now do a true "Find all References" or "Find all Usages". For instance, you can do a "Find All References" for `this.selectedShape` on our ViewModel or Angular Controller. If this was something that was used project-wide, our results list would span the entire project as well.

![vscode_find_all_ref](http://developer.telerik.com/wp-content/uploads/2016/01/vscode_find_all_ref.jpg)

If you do this in Visual Studio Code, it will open up the "peek" view and give you a list of all usages of `this.selectedShape` on the right. You can navigate to each occurence by clicking on them and as you navigate through the list the view on the right will automaticlally scroll to that occurence.

![vscode_peek](http://developer.telerik.com/wp-content/uploads/2016/01/vscode_peek.jpg)

Other exciting TypeScript features include:

*   Solution-wide refactoring
*   Peek definition
*   Go to definition

It's worth noting that these features are not exclusive to Visual Studio Code. They are available on most IDEs that offcially support TypeScript. TypeScript brings a lot of power to increase your development productivity in terms of providing a robust development and build time experience for JavaScript.

## Conclusion

I've uploaded the completed sample used in this article of the refactored Kendo UI Diagram Application built with TypeScript and AngularJS to GitHub. You can find it at [https://github.com/lelong37/kendo-angular-typed](https://github.com/lelong37/kendo-angular-typed). I've also deployed the completed, refactored application [here](http://kendo-typed.azurewebsites.net/app/diagram/diagram.html).

In upcoming articles I plan to cover TypeScript with Kendo and Angular 2 and TypeScript with NativeScript. Be sure to share any feedback with me via Twitter [@lelong37](http://twitter.com/lelong37) or in the comments.

Happy Coding!
