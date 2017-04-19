'use strict';

angular.module('chapter').controller('ChaptersController', ['$scope', '$stateParams', '$location','$window','Option', 'Authentication','FileUploader', 'Subject', 'Chapter', 
    function($scope, $stateParams, $location, $window,Option, Authentication, FileUploader, Subject, Chapter) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }

        $scope.chapter = new Chapter({});
        
        $scope.statuses = Option.getStatus();
        $scope.chapter.status = 1;
        Subject.query(function(data){$scope.subjectList = data.items});
        

        $scope.gotoList = function() {
            $location.path('chapter');
        }
        //CRUD 
        $scope.create = function() {
            var chapter = $scope.chapter;
                chapter.user_id = Authentication.user.uid;
            chapter.$save(function(response) {
                $location.path('chapter/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(chapter) {
            if (chapter) {
                chapter.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === chapter) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.chapter.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var chapter = $scope.chapter;
            chapter.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.findOne = function() {
            $scope.chapter = Chapter.get({
                itemId: $stateParams.itemId
            });
            // console.log($scope.chapter);
        };

        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            Chapter.query(options, function(data) {
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
