angular
    .module('Anwser')
    .service('AnwserService', AnwserService)
    .factory('AnwserFactory', AnwserFactory);

function AnwserService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}

function AnwserFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/anwser/:itemId', {
        itemId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        query: {
            isArray: false,
        },
        getAnwsersByStudent: {
            url: $window.settings.services.userApi + '/api/anwser/get-anwsers-by-student',
            method: 'GET'
        }
    });
}

