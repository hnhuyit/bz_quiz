angular.module('Contact')
    .controller("ContactController", ContactController)

function ContactController($scope, $filter, ContactService, Option) {

    console.log('Option', Option.getLevels());
    $scope.hello = "hello";
    $scope.submit = function() {        
        if ($scope.contactForm.$valid) {
            var data = { name: this.name, email: this.email, message: this.message }
            ContactService.submit(data)
                .success(function(data, status, headers) {
                    if (data.status == 1) {
                        $scope.contactSuccess = true;
                    } else {
                        $scope.errors = data.messages;
                    }
                });
        }
    }
}