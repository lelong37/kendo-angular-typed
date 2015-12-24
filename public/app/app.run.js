(function () {
    'use strict';
    angular
        .module('app')
        .run(run);
    run.$inject = [
        '$rootScope',
        '$state',
        "$http"
    ];
    function run($rootScope, $state, $http) {
        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
        });
    }
})();

//# sourceMappingURL=app.run.js.map
