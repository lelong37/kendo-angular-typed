var app;
(function (app) {
    var home;
    (function (home) {
        'use strict';
        var ContactController = (function () {
            function ContactController() {
                var vm = this;
                vm.message = "Your page, Hi Manny...";
                vm.title = "Contact";
            }
            return ContactController;
        })();
        angular
            .module('app.home')
            .controller('app.home.IContactController', ContactController);
    })(home = app.home || (app.home = {}));
})(app || (app = {}));

//# sourceMappingURL=home.contact.controller.js.map
