'use strict';

angular.module('question').factory('Question', ['$resource',
    function($resource) {
        return $resource(window.cmsprefix + '/question/:itemId', {
            itemId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false,
            },
            changeStatus: {
                url: window.cmsprefix + '/question/changeStatus',
                method: 'PUT',
                params: {
                    id: '@id',
                }
            },
        });
    }
]);
