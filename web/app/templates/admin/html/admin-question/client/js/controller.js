'use strict';

angular.module('question').controller('QuestionsController', ['$scope', '$stateParams', '$location','$window', 'Option', 'Authentication', 'Question', 'Subject', 'Chapter',
    function($scope, $stateParams, $location, $window, Option, Authentication, Question, Subject, Chapter) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }

        $scope.question = new Question({});
        
        $scope.statuses = Option.getStatus();
        $scope.typeQuestions = Option.getTypeQuestions();
        $scope.levels = Option.getLevels();

        Subject.query(function(data){$scope.subjectList = data.items});
        Chapter.query(function(data){$scope.chapterList = data.items});
        $scope.question.status = 1;
         

        $scope.gotoList = function() {
            $location.path('question');
        }
        $scope.create = function() {
            var question = $scope.question;

                // question.options = [
                //     {
                //         question_option: $scope.option1,
                //         score: $('#optionsRadios1').checked ? 1 : 0
                //     },
                //     {
                //         question_option: $scope.option2,
                //         score: $('#optionsRadios2').checked ? 1 : 0
                //     },
                //     {
                //         question_option: $scope.option3,
                //         score: $('#optionsRadios3').checked ? 1 : 0
                //     },
                //     {
                //         question_option: $scope.option4,
                //         score: $('#optionsRadios4').checked ? 1 : 0
                //     }
                // ];
            console.log(question);
            question.$save(function(response) {
                $location.path('question/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(question) {
            if (question) {
                question.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === question) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.question.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var question = $scope.question;
                // question.options = [
                //     {
                //         question_option: $scope.option1,
                //         score: $('#optionsRadios1').checked ? 1 : 0
                //     },
                //     {
                //         question_option: $scope.option2,
                //         score: $('#optionsRadios2').checked ? 1 : 0
                //     },
                //     {
                //         question_option: $scope.option3,
                //         score: $('#optionsRadios3').checked ? 1 : 0
                //     },
                //     {
                //         question_option: $scope.option4,
                //         score: $('#optionsRadios4').checked ? 1 : 0
                //     }
                // ];
            question.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne = function() {
            $scope.question = Question.get({
                itemId: $stateParams.itemId
            });
        };
        
        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            Question.query(options, function(data) {
                $scope.items = data.items;
                console.log(data.items);
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
