    angular.module('Contact')
        .service("ContactService", ContactService);

    function ContactService($http, $window) {
        return {
            submit: function(data) {
                return $http.post($window.settings.services.contactApi + '/api/contact', data);
            }
        };
    };