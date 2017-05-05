angular
    .module('Option')
    .service('OptionService', OptionService)
    .factory('OptionFactory', OptionFactory);

function OptionService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}


function OptionFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/option/:itemId', {
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