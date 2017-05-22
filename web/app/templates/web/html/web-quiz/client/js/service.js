angular
    .module('Quiz')
    .service('QuizService', QuizService)
    .service('helperService', helperService)
    .factory('QuizFactory', QuizFactory);
    // .factory('QuizQuestionFactory', QuizQuestionFactory);

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
        },
        getQuizzesBySubject: {
            url: $window.settings.services.userApi + '/api/quiz/get-quizzes-by-subject',
            method: 'GET'
        },
        getQuizzesByStudent: {
            url: $window.settings.services.userApi + '/api/quiz/get-quizzes-by-student',
            method: 'GET'
        },
        getQuizzesByNoLogin: {
            url: $window.settings.services.userApi + '/api/quiz/get-quizzes-by-no-login',
            method: 'GET'
        },
        createQuestion: {
            url: $window.settings.services.userApi + '/api/quiz/createQuestion',
            method: 'PUT'
        }
    });
}

// function QuizQuestionFactory($resource, $window) {
//     return $resource($window.settings.services.userApi + '/api/quiz-question/:itemId', {
//         itemId: '@_id'
//     }, {
//         update: {
//             method: 'PUT',
//             headers:{'Content-Type':'application/x-www-form-urlencoded'} 
//         },
//         query: {
//             isArray: false,
//             headers:{'Content-Type':'application/x-www-form-urlencoded'} 
//         }
//     });
// }

function helperService() {
    this.hello = function () {
        return "Hello World";
    };
    this.toBool = function (val) {
        if (val == 'undefined' || val == null || val == '' || val == 'false' || val == 'False')
            return false;
        else if (val == true || val == 'true' || val == 'True')
            return true;
        else
            return 'unidentified';
    };
    this.shuffle = function (array) {
        var currentIndex = array.length, temp, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
        }
        return array;
    }
    this.extend = function (out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }
        return out;
    };
};