'use strict';

angular.module('question').controller('QuestionsController', ['$scope', '$stateParams', '$location','$window', '$sce', '$timeout', 'Option', 'Authentication', 'Question', 'Subject', 'Chapter', 'Notice', 'localStorageService',
    function($scope, $stateParams, $location, $window, $sce, $timeout, Option, Authentication, Question, Subject, Chapter, Notice, localStorageService) {
        //set permission
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }

        //Var
        var localStorageName = "question.filterData";
        $scope.search = {};
        $scope.isLoading = false;
        $scope.currentPage = 1;
        $scope.question = new Question({});
        $scope.statuses = Option.getStatus();
        $scope.typeQuestions = Option.getTypeQuestions();
        $scope.levels = Option.getLevels();
        $scope.rowsSelected = {};
        Subject.query(function(data){$scope.subjectList = data.items});
        Chapter.query(function(data){$scope.chapterList = data.items});
        $scope.question.status = 1;

        //Method
        $scope.create = create;
        $scope.update = update;
        $scope.findOne = findOne;
        $scope.setPage = setPage;
        $scope.pageChanged = pageChanged;
        $scope.find = find;
        $scope.remove = remove;
        $scope.filter = filter;
        $scope.changeStatus = changeStatus;
        $scope.processChangeStatus = processChangeStatus;
        // $scope.sellectAll = sellectAll;
         


        function showLoading() {
            $scope.isLoading = true;
        }

        function hideLoading() {
            $timeout(function () {
                $scope.isLoading = false;
            }, 500);
        }

        function gotoList() {
            $location.path('question');
        }

        function create() {
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

        function update() {
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

        function remove(question) {
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

        function getListData() {

            showLoading();
            // Reset selected row
            $scope.rowsSelected = {};

            // get filter from local storage
            getFilterToLocalStorage();

            Question
                .query(getOptionsQuery(), function (data) {
                    setScopeAfterQuery(data);
                    hideLoading();
                });
        }

        function setFilterToLocalStorage() {
            localStorageService.set(localStorageName, {
                currentPage: $scope.currentPage,
                search: $scope.search
            });
        }


        function getFilterToLocalStorage() {
            var filterData = localStorageService.get(localStorageName);
            if (!$.isEmptyObject(filterData)) {
                $scope.currentPage = Number.isInteger(filterData.currentPage) ? Number(filterData.currentPage) : 1;
                if (!$.isEmptyObject(filterData.search)) {
                    $scope.search.keyword = filterData.search.keyword ? filterData.search.keyword : "";
                    $scope.search.question_type = filterData.search.question_type ? filterData.search.question_type : null;
                    $scope.search.level = filterData.search.level ? filterData.search.level : null;
                    $scope.search.status = Number.isInteger(filterData.search.status) ? Number(filterData.search.status) : null;
                }

            }
        }

        function findOne() {
            $scope.question = Question.get({
                itemId: $stateParams.itemId
            });
        };
        
        function find() {
            getListData();
        };

        function filter() {
            setPage(1);
            setFilterToLocalStorage();
            getListData();
        };

        function setPage(pageNo) {
            $scope.currentPage = pageNo;
        };

        function pageChanged(page) {
            setPage(page);
            setFilterToLocalStorage();
            getListData();
        };

        function getOptionsQuery() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                question_type: $scope.search.question_type,
                level: $scope.search.level,
                status: $scope.search.status
            };
            return options;
        }

        function setScopeAfterQuery(data) {
            $scope.questions = data.items;
            $scope.totalItems = data.totalItems;
            $scope.totalPage = data.totalPage;
            $scope.itemsPerPage = data.itemsPerPage;
            $scope.numberVisiblePages = data.numberVisiblePages;
        }

        $scope.reset = function reset() {
            $scope.search.keyword = "";
            $scope.search.question_type = "";
            $scope.search.level = "";
            $scope.search.status = "";
            $scope.currentPage = 1;
            setFilterToLocalStorage();
            getListData();
        };
        function changeStatus(questionId, status) {

            $scope.currentQuestionId = questionId;
            $scope.currentStatus = status;

            if (status == 1) {
                $scope.confirmMessage = $sce.trustAsHtml("Do you want to change status from <b>Publish</b> to <b>Unpublish</b>?");
            } else {
                $scope.confirmMessage = $sce.trustAsHtml("Do you want to change status from <b>Unpublish</b> to <b>Publish</b>?");
            }
        }

        function processChangeStatus() {
            var questionId = $scope.currentQuestionId;
            var currentStatus = $scope.currentStatus;

            Question.changeStatus({
                id: questionId,
                currentStatus: currentStatus
            }, function (response) {
                if (response.status) {
                    $('.modal').modal('hide');
                    getListData();
                    Notice.setNotice(response.message, 'SUCCESS', true);
                }
            });
        }
        // function sellectAll() {
        //     var rowsSelected = {};
        //     if ($scope.selectAll) {
        //         var users = $scope.users;
        //         users.forEach(function (user) {
        //             rowsSelected[user._id] = true;
        //         });
        //         console.log(rowsSelected);
        //     }
        //     $scope.rowsSelected = rowsSelected;
        // }
    }
]);
