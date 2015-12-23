namespace app.home {
    'use strict';

    interface IAboutController {
        title: string;
        message: string;
        states: Array<string>;
    }

    class AboutController implements IAboutController {

        message: string;
        title: string;

        constructor() {

            var vm = this;
            vm.message = "Your application description page, Hi Chris";
            vm.title = "About.";

        }

        states: string[];
    }

    angular
        .module('app.home')
        .controller('app.home.IAboutController', AboutController);
}
