'use strict';

angular.module('subject').controller('SubjectsController', ['$scope', '$stateParams', '$location', 'Option', 'Authentication', 'Subject',
    function($scope, $stateParams, $location, Option, Authentication, Subject) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        $scope.statuses = Option.getStatus();

        $scope.gotoList = function() {
            $location.path('subject');
        }
        //CRUD 
        $scope.create = function() {
            var subject = new Subject({
                name: this.name,
                desc: this.desc,
                status: this.status,
                user_id: Authentication.user.uid,
            });
            // console.log('subject', subject);
            
            subject.$save(function(response) {
                $location.path('subject/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(subject) {
            if (subject) {
                subject.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === subject) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.subject.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var subject = $scope.subject;
            subject.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne = function() {
            $scope.subject = Subject.get({
                itemId: $stateParams.itemId
            });
        };

        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            Subject.query(options, function(data) {
                $scope.items = data.items;
                // console.log($scope.items);
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
    }
]);
