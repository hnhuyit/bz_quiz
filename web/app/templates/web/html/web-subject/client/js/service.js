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
        },
        getSubjectsByStudent: {
            url: $window.settings.services.userApi + '/api/subject/get-subjects-by-student',
            method: 'GET'
        },
        getSubjectByKey: {
            url: $window.settings.services.userApi + '/api/subject/get-subject-by-key',
            method: 'GET'
        }
    });
}

