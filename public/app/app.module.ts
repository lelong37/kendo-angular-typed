((): void => {

    'use strict';

    angular
        .module('app', [
            'app.core',
            'ui.router',

            //// features areas
            'app.home'
        ]);

})();