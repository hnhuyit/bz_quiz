var app = angular.module('myapp', ['ngCookies' , 'ngResource', 'ngMessages', 'Contact', 'Auth', 'Notify']).config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});
angular.module('Core', []);