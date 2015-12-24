var app;
(function (app) {
    var home;
    (function (home) {
        'use strict';
        var AboutController = (function () {
            function AboutController() {
                var vm = this;
                vm.message = "Your application description page, Hi Chris";
                vm.title = "About.";
            }
            return AboutController;
        })();
        angular
            .module('app.home')
            .controller('app.home.IAboutController', AboutController);
    })(home = app.home || (app.home = {}));
})(app || (app = {}));

//# sourceMappingURL=home.about.controller.js.map
