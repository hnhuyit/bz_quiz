'use strict';

//Posts service used to communicate Posts REST endpoints
angular.module('posts').factory('Posts', ['$resource',
    function($resource) {
        return $resource(window.cmsprefix + '/post/:postId', {
            postId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false
            },
            moveToTrash: {
                url: window.cmsprefix + '/post/moveToTrash',
                method: 'PUT',
                params: {
                    id: '@id',
                }
            },
            changeStatus: {
                url: window.cmsprefix + '/post/changeStatus',
                method: 'PUT',
                params: {
                    id: '@id',
                }
            },
            changeStatusMultiRows: {
                url: window.cmsprefix + '/post/changeStatusMultiRows',
                method: 'PUT'
            },
            deleteMultiRows: {
                url: window.cmsprefix + '/post/deleteMultiRows',
                method: 'PUT'
            }
        });
    }
]);