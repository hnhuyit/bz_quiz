'use strict';

angular.module('result').controller('ResultsController', ['$scope', '$stateParams', '$location','$window', 'Authentication','FileUploader', 'Result',
    function($scope, $stateParams, $location, $window, Authentication, FileUploader, Result) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        
        $scope.uploadApi = $window.settings.services.uploadApi;
        $scope.webUrl = $window.settings.services.webUrl;

        $scope.result = new Result({});
        

        
         

        $scope.gotoList = function() {
            $location.path('result');
        }
        //CRUD 
        $scope.create = function() {
            var result = $scope.result;
            result.$save(function(response) {
                $location.path('result/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(result) {
            if (result) {
                result.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === result) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.result.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var result = $scope.result;
            result.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne = function() {
            $scope.result = Result.get({
                itemId: $stateParams.itemId
            });
        };

        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            Result.query(options, function(data) {
                $scope.items = data.items;
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
