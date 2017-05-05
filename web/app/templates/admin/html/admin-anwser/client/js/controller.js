'use strict';

angular.module('anwser').controller('AnwsersController', ['$scope', '$stateParams', '$location','$window','Option', 'Authentication','FileUploader', 'Anwser',
    function($scope, $stateParams, $location, $window,Option, Authentication, FileUploader, Anwser) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        
        $scope.uploadApi = $window.settings.services.uploadApi;
        $scope.webUrl = $window.settings.services.webUrl;

        $scope.anwser = new Anwser({});
        
        $scope.statuses = Option.getStatus();
        $scope.anwser.status = 1;
        

        
         

        $scope.gotoList = function() {
            $location.path('anwser');
        }
        //CRUD 
        $scope.create = function() {
            var anwser = $scope.anwser;
            anwser.$save(function(response) {
                $location.path('anwser/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(anwser) {
            if (anwser) {
                anwser.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === anwser) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.anwser.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var anwser = $scope.anwser;
            anwser.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne = function() {
            $scope.anwser = Anwser.get({
                itemId: $stateParams.itemId
            });
        };

        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            Anwser.query(options, function(data) {
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
