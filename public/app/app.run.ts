((): void => {
    'use strict';

    angular
        .module('app')
        .run(run);

    run.$inject = [
        '$rootScope',
        '$state',
        "$http"
    ];

    function run(
        $rootScope,
        $state: angular.ui.IStateService,
        $http: angular.IHttpService): void {

        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
        });
    }
})();