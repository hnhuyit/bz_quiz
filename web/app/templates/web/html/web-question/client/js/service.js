angular
    .module('Question')
    .service('QuestionService', QuestionService)
    .factory('QuestionFactory', QuestionFactory)
    .factory('OptionFactory', OptionFactory);

function QuestionService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}

function QuestionFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/question/:itemId', {
        itemId: '@_id'
    }, {
        update: {
            method: 'PUT',
        },
        query: {
            isArray: false,
        }
    });
}

function OptionFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/option/:itemId', {
        itemId: '@_id'
    }, {
        update: {
            method: 'PUT',
            headers:{'Content-Type':'application/x-www-form-urlencoded'} 
        },
        query: {
            isArray: false,
        }
    });
}
