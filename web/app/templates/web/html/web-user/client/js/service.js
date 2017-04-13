angular
    .module('Auth')
    .service('AuthService', AuthService);

function AuthService($http, $window) {
    return {
        register: function(data) {
            return $http.post($window.settings.services.userApi + '/api/user/register', data);
        },
        login: function(data) {
            return $http.post($window.settings.services.userApi + '/api/user/login', data);
        },
        forgot: function(data) {
            return $http.post($window.settings.services.userApi + '/api/user/forgot', data);
        },
        account: function() {
            return $http.get($window.settings.services.userApi + '/api/user/account');
        },
        logout: function() {
            return $http.get($window.settings.services.userApi + '/api/user/logout');
        },
        updateAccount: function(data) {
            return $http.post($window.settings.services.userApi + '/api/user/updateprofile', data);
        },
        profile: function() {
            return $http.get($window.settings.services.userApi + '/api/user/profile');
        },
        changepassword: function(data) {
            return $http.post($window.settings.services.userApi + '/api/user/changepassword', data);
        },
        reset: function(token, data) {
            return $http.post($window.settings.services.userApi + '/api/user/reset?token=' + token, data);
        }
    };
}