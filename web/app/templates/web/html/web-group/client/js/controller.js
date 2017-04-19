angular
    .module('Group')
    .controller('GroupController', GroupController);

function GroupController($scope, $filter, GroupService, GroupFactory, $cookies, toastr) {
	$scope.hello = 111111;
    console.log(1111);

}