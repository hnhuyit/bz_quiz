'use strict';

angular.module('quiz').controller('QuizzesController', ['$scope', '$stateParams', '$location','$window','Option', 'Authentication','FileUploader', 'Quiz', 'Group', 'Subject',
    function($scope, $stateParams, $location, $window,Option, Authentication, FileUploader, Quiz, Group, Subject) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        
        // $scope.uploadApi = $window.settings.services.uploadApi;
        // $scope.webUrl = $window.settings.services.webUrl;

        $scope.quiz = new Quiz({});
        
        $scope.statuses = Option.getStatus();
        // $scope.quiz.status = 1;
        Group.query(function(data){$scope.groupList = data.items});
        Subject.query(function(data){$scope.subjectList = data.items});
        

        
         

        $scope.gotoList = function() {
            $location.path('quiz');
        }
        //CRUD 
        $scope.create = function() {
            var quiz = $scope.quiz;
                quiz.user_id = Authentication.user.uid;

            // console.log(quiz);
            quiz.$save(function(response) {
                $location.path('quiz/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(quiz) {
            if (quiz) {
                quiz.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === quiz) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.quiz.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var quiz = $scope.quiz;
            quiz.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne = function() {
            $scope.quiz = Quiz.get({
                itemId: $stateParams.itemId
            });
        };


        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            Quiz.query(options, function(data) {
                $scope.items = data.items;
                // console.log(data.items);
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
