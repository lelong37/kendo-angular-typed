((): void => {
    'use strict';

    angular
        .module('app')
        .run(run);

    run.$inject = [];

    function run(): void {
        //$rootScope.$on('$routeChangeError', (): void => {
        //
        //});
    }
})();