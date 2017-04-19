angular
    .module('Quiz')
    .service('QuizService', QuizService)
    .factory('QuizFactory', QuizFactory)
    .factory('QuizQuestionFactory', QuizQuestionFactory);

function QuizService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}

function QuizFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/quiz/:itemId', {
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

function QuizQuestionFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/quiz-question/:itemId', {
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
