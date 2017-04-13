'use strict';

//Contacts service used to communicate Contacts REST endpoints
angular.module('contacts').factory('Contacts', ['$resource',
    function($resource) {
        return $resource(window.cmsprefix + '/contact/:contactId', {
            contactId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false
            }
        });
    }
]);