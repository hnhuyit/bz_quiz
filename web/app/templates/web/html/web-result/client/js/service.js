angular
    .module('Result')
    .service('ResultService', ResultService)
    .factory('ResultFactory', ResultFactory);

function ResultService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}

function ResultFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/result/:itemId', {
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

