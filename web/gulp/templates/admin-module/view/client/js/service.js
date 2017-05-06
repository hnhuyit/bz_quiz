'use strict';

angular.module('<%= moduleName %>').factory('<%= modelName %>', ['$resource',
    function($resource) {
        return $resource('<%= routeName %>/:itemId', {
            itemId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false,
            }
        });
    }
]);
