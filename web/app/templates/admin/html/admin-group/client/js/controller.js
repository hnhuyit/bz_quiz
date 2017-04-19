'use strict';

angular.module('group').controller('GroupsController', ['$scope', '$stateParams', '$location','$window','Option', 'Authentication','FileUploader', 'Group',
    function($scope, $stateParams, $location, $window,Option, Authentication, FileUploader, Group) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        
        // $scope.uploadApi = $window.settings.services.uploadApi;
        // $scope.webUrl = $window.settings.services.webUrl;

        $scope.group = new Group({});
        
        $scope.statuses = Option.getStatus();
        // $scope.group.status = 1;
        

        
         

        $scope.gotoList = function() {
            $location.path('group');
        }
        //CRUD 
        $scope.create = function() {
            var group = $scope.group;

            // console.log(group);
            group.$save(function(response) {
                $location.path('group/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(group) {
            if (group) {
                group.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === group) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.group.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var group = $scope.group;
            group.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne = function() {
            $scope.group = Group.get({
                itemId: $stateParams.itemId
            });
        };

        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            Group.query(options, function(data) {
                $scope.items = data.items;
                 console.log(data);
                $scope.totalItems = data.totalItems;
                $scope.itemsPerPage = data.itemsPerPage;
                $scope.numberVisiblePages = data.numberVisiblePages;
            });
        };
        //SEARCH AND PAGINATION
        $scope.currentPage = 1;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.search = function() {
            $scope.find();
        };
        $scope.reset = function() {
            $scope.search.keyword = "";
            $scope.currentPage = 1;
            $scope.find();
        };

        //Change Status
        // $scope.changeStatus = function(a) {

        //     if(a === 1) {
        //         group.$update({status: 0}, function() {
        //             $scope.gotoList();

        //         }, function(errorResponse) {
        //             $scope.error = errorResponse.data.message;
        //         });
        //     } else {
        //         group.$update({status: 1}, function() {
        //             $scope.gotoList();

        //         }, function(errorResponse) {
        //             $scope.error = errorResponse.data.message;
        //         });
        //     }
        // }
    }
]);
