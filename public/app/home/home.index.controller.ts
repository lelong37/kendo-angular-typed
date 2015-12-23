namespace app.home {
    'use strict';

    interface IScope extends ng.IScope {
        grid: kendo.ui.Grid;
    }

    interface IIndexController {
    }

    class IndexController implements IIndexController {

        constructor() {

            const vm = this;

        }
    }

    angular
        .module('app.home')
        .controller('app.home.IIndexController', IndexController);
}
