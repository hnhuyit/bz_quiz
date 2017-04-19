angular
    .module('Chapter')
    .service('ChapterService', ChapterService)
    .factory('ChapterFactory', ChapterFactory);

function ChapterService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}


function ChapterFactory($resource, $window) {
    return $resource($window.settings.services.userApi + '/api/chapter/:itemId', {
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