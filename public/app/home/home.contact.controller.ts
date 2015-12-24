namespace  app.home {
    'use strict';

    interface IContactController {
        title: string;
        message: string;
    }

    class ContactController implements IContactController {

        message: string;        
        title: string;

        constructor() {

            var vm = this;
            vm.message = "Your page, Hi Manny...";
            vm.title = "Contact";

        }
    }

    angular
        .module('app.home')
        .controller('app.home.IContactController', ContactController);
}
