angular
    .module('Quiz')
    .controller('QuizController', QuizController)
    .controller('AttemptQuizController', AttemptQuizController);

function QuizController($scope, $filter, $timeout, QuizService, QuizFactory, GroupFactory, SubjectFactory, QuestionFactory, $cookies, toastr, localStorageService) {


    //Var
    var localStorageName = "quiz.filterData";
    $scope.search = {};
    $scope.rowsSelected = {};
    $scope.isLoading = false;
    $scope.currentPage = 1;
    GroupFactory.query(function(data){$scope.groupLists = data.items;});
    SubjectFactory.query(function(data){$scope.subjectLists = data.items;});


    //Method
    $scope.setPage = setPage;
    $scope.pageChanged = pageChanged;
    $scope.find = find;
    $scope.filter = filter;

    function showLoading() {
        $scope.isLoading = true;
    }

    function hideLoading() {
        $timeout(function () {
            $scope.isLoading = false;
        }, 500);
    }
    function getListData() {

        showLoading();
        // Reset selected row
        $scope.rowsSelected = {};

        // get filter from local storage
        getFilterToLocalStorage();

        QuizFactory
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
                $scope.search.subject_id = filterData.search.subject_id ? filterData.search.subject_id : null;
                $scope.search.group_id = filterData.search.group_id ? filterData.search.group_id : null;
            }

        }
    }
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
            subject_id: $scope.search.subject_id,
            group_id: $scope.search.group_id,
        };
        return options;
    }

    function setScopeAfterQuery(data) {
        $scope.quizzes = data.items;
        $scope.totalItems = data.totalItems;
        $scope.totalPage = data.totalPage;
        $scope.itemsPerPage = data.itemsPerPage;
        $scope.numberVisiblePages = data.numberVisiblePages;
    }
    $scope.reset = function reset() {
        $scope.search.keyword = "";
        $scope.search.subject_id = "";
        $scope.search.group_id = "";
        $scope.currentPage = 1;
        setFilterToLocalStorage();
        getListData();
    };

    // QuizFactory.getQuizzesByStudent(function(data){

    //     let quizzes = [];
    //     data.items.forEach(function(qzs){
    //         qzs.forEach(function(qz){
    //             quizzes.push(qz);
    //         })
    //     });
    //     $scope.items = quizzes;
    // });

    // QuestionFactory.query(function(data){
    // 	console.log(data);
    // });
    
    $scope.createQuestion = function(question_id, quiz_id) {
        let options = {
            question_id: question_id,
            quiz_id: quiz_id
        }
        QuizFactory.createQuestion(options, function(quiz) {
            
            toastr.success(quiz.message, 'Thông báo');

        }, function(err) {
            $scope.error = errorResponse.data.message;
        });
    }
}

function AttemptQuizController($scope, $timeout, $location, helperService, QuizFactory, QuestionFactory, AnwserFactory, toastr) {

    //Ser permission
    
    $scope.defaultConfig = {
        'allowBack': true,
        'allowReview': true,
        'autoMove': false,  // if true, it will move to next question automatically when answered.
        'duration': 0,  // indicates the time in which quiz needs to be completed. post that, quiz will be automatically submitted. 0 means unlimited.
        'pageSize': 1,
        'requiredAll': false,  // indicates if you must answer all the questions before submitting.
        'richText': false,
        'shuffleQuestions': false,
        'shuffleOptions': false,
        'showClock': false,
        'showPager': true,
        'theme': 'none', 
        'isQuiz': false
    }

    //Var
    var url = $location.$$absUrl;
    var idQuiz = url.substr(url.length-32,24);
    $scope.btnReview = false;

    $scope.find = function() {
        $scope.quiz = {};
        QuizFactory.get({itemId: idQuiz}, function(data) {
            $scope.quiz = data
            $scope.config = helperService.extend({}, $scope.defaultConfig);
            $scope.questions = data.question_ids;
            $scope.totalItems = data.question_ids.length;
            $scope.itemsPerPage = $scope.defaultConfig.pageSize;
            $scope.currentPage = 1;
            $scope.mode = 'quiz';
            
            $scope.$watch('currentPage + itemsPerPage', function () {
             var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
               end = begin + $scope.itemsPerPage;

             $scope.filteredQuestions = $scope.questions.slice(begin, end);
            });
        });
    }

    //If you wish, you may create a separate factory or service to call loadQuiz. To keep things simple, i have kept it within controller.
    // $scope.loadQuiz = function (file) {
    //     $http.get(file)
    //      .then(function (res) {
    //          $scope.quiz = res.data.quiz;
    //          $scope.config = helper.extend({}, $scope.defaultConfig, res.data.config);
    //          $scope.questions = $scope.config.shuffleQuestions ? helper.shuffle(res.data.questions) : res.data.questions;
    //          $scope.totalItems = $scope.questions.length;
    //          $scope.itemsPerPage = $scope.config.pageSize;
    //          $scope.currentPage = 1;
    //          $scope.mode = 'quiz';

    //          $scope.$watch('currentPage + itemsPerPage', function () {
    //              var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
    //                end = begin + $scope.itemsPerPage;

    //              $scope.filteredQuestions = $scope.questions.slice(begin, end);
    //          });
    //      });
    // }

    $scope.goTo = function (index) {
        if (index > 0 && index <= $scope.totalItems) {
            $scope.currentPage = index;
            $scope.mode = 'quiz';
        }
    }
    $scope.onSelect = function (question, option) {
        // console.log(question);
        if (question) {
            question.options.forEach(function (element, index, array) {
                if (element._id != option._id) {
                    element.selected = false;
                    // question.answered = element._id;
                }
            });
        }

        if ($scope.config.autoMove == true && $scope.currentPage < $scope.totalItems)
            $scope.currentPage++;
    }

    $scope.onSubmit = function () {
        var answer = {};
            answer.quiz_id = idQuiz;
            answer.user_answer = [];

        QuizFactory.get({itemId: idQuiz}, function(data) {
            answer.teacher_id = data.user_id;

            $scope.questions.forEach(function (q, index) {
                q.options.forEach(function (o, index) {
                    if(o.selected) {
                        answer.user_answer.push({
                            question_id: q._id, 
                            option_name: o._id, 
                            option_score: o.score
                        });
                    }
                });
            });
            
            let ans = new AnwserFactory(answer);
            ans.$save(function(data) {
                // console.log(data);
                $scope.result = data;
                $scope.defaultConfig.isQuiz = true;
                $scope.mode = 'result';
                $scope.btnReview = true;
            }, function(err) {
                console.log(err);
            });

        });


        // Post your data to the server here. answers contains the questionId and the users' answer.
        //$http.post('api/Quiz/Submit', answers).success(function (data, status) {
        //    alert(data);
        //});
        // console.log($scope.questions);
        // console.log('answer', answer);
        // $scope.mode = 'result';
        // $scope.btnReview = true;
    }

    $scope.pageCount = function () {
        return Math.ceil($scope.questions.length / $scope.itemsPerPage);
    };

    $scope.isAnswered = function (index) {
        var answered = 'Not Answered';
        $scope.questions[index].options.forEach(function (element, index, array) {
            if (element.selected == true) {
                answered = 'Answered';
                return false;
            }
        });
        return answered;
    };

    $scope.isCorrect = function (question) {
        var result = 'correct';
        question.options.forEach(function (option, index, array) {
            if (helperService.toBool(option.selected) != option.is_correct) {
                result = 'wrong';
                return false;
            }
        });
        return result;
    };

    
};
