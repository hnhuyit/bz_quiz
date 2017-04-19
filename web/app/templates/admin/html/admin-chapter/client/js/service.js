'use strict';

angular.module('chapter').factory('Chapter', ['$resource',
    function($resource) {
        return $resource(window.cmsprefix + '/chapter/:itemId', {
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
