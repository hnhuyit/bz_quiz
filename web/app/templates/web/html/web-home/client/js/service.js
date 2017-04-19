angular
    .module('Home')
    .service('HomeService', HomeService);
    // .factory('HomeFactory', HomeFactory);

function HomeService($http, $window) {
    return {
        // register: function(data) {
        //     return $http.post($window.settings.services.userApi + '/api/user/register', data);
        // }
    };
}


// function HomeFactory($resource, $window) {
//     return $resource($window.settings.services.userApi + '/api/chapter/:itemId', {
//         itemId: '@_id'
//     }, {
//         update: {
//             method: 'PUT'
//         },
//         query: {
//             isArray: false,
//         }
//     });
// }