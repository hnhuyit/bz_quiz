angular
    .module('Subject')
    .service('SubjectService', SubjectService)
    .factory('SubjectFactory', SubjectFactory);

function SubjectService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}

function SubjectFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/subject/:itemId', {
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

