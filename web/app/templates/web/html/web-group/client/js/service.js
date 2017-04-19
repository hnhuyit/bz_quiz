angular
    .module('Group')
    .service('GroupService', GroupService)
    .factory('GroupFactory', GroupFactory);

function GroupService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}

function GroupFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/group/:itemId', {
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

