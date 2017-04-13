'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
    function($resource) {
        return $resource(window.cmsprefix + '/user/:userId', { userId: '@_id' }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false
            },
            moveToTrash: {
                url: window.cmsprefix + '/user/moveToTrash',
                method: 'PUT',
                params: {
                    id: '@id',
                }
            },
            changeStatus: {
                url: window.cmsprefix + '/user/changeStatus',
                method: 'PUT',
                params: {
                    id: '@id',
                }
            },
            changeStatusMultiRows: {
                url: window.cmsprefix + '/user/changeStatusMultiRows',
                method: 'PUT'
            },
            deleteMultiRows: {
                url: window.cmsprefix + '/user/deleteMultiRows',
                method: 'PUT'
            }
        });
    }
]);