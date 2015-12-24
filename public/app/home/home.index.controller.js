var app;
(function (app) {
    var home;
    (function (home) {
        'use strict';
        var IndexController = (function () {
            function IndexController() {
                var vm = this;
            }
            return IndexController;
        })();
        angular
            .module('app.home')
            .controller('app.home.IIndexController', IndexController);
    })(home = app.home || (app.home = {}));
})(app || (app = {}));

//# sourceMappingURL=home.index.controller.js.map
