angular
    .module('Question')
    .controller('QuestionsController', QuestionsController);

function QuestionsController($scope, $filter, $window, $location, $timeout, QuestionService, QuestionFactory, SubjectFactory, ChapterFactory, OptionFactory, Option, $cookies, toastr, localStorageService) {


    //Var
    var localStorageName = "question.filterData";
    $scope.search = {};
    $scope.rowsSelected = {};
    $scope.isLoading = false;
    $scope.currentPage = 1;   
    $scope.chapterList = [];

    $scope.typeQuestions = Option.getTypeQuestions();
    $scope.levels        = Option.getLevels();
    SubjectFactory.query(function(data){
    	$scope.subjectLists = data.items;
    });


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
        }, 2000);
    }
    function getListData() {

        showLoading();
        // Reset selected row
        $scope.rowsSelected = {};

        // get filter from local storage
        getFilterToLocalStorage();

        QuestionFactory
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
            question_type: $scope.search.question_type,
            level: $scope.search.level,
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

    ////////////////
    $scope.resetOptions = function() {
        $scope.question.subject_id    = "";
        $scope.question.question_type = "";
        $scope.question.level         = "";
        $scope.question.chapter_id    = "";
        setAddQuestion();
    };
    $scope.resetQuestion = function() {
        $scope.question.name  = "";
        $scope.question.desc  = "";
        $scope.options.name1  = "";
        $scope.options.name2  = "";
        $scope.options.name3  = "";
        $scope.options.name4  = "";
        $scope.options.score1 = false;
        $scope.options.score2 = false;
        $scope.options.score3 = false;
        $scope.options.score4 = false;
        setAddQuestion();
    };

    $scope.create = function() {
        let question = new QuestionFactory($scope.question);
            question.options = [
                {name: $scope.options.name1, score: $scope.options.score1 === '1' ? 1 : 0, is_correct: $scope.options.score1 === '1' ? true : false},
                {name: $scope.options.name2, score: $scope.options.score2 === '1' ? 1 : 0, is_correct: $scope.options.score2 === '1' ? true : false},
                {name: $scope.options.name3, score: $scope.options.score3 === '1' ? 1 : 0, is_correct: $scope.options.score3 === '1' ? true : false},
                {name: $scope.options.name4, score: $scope.options.score4 === '1' ? 1 : 0, is_correct: $scope.options.score4 === '1' ? true : false}
            ];
        console.log($scope.options.score4);

        question.$save(function(response){
            console.log(response);
            $scope.resetQuestion();
            toastr.success(response.message, 'Thông báo');
        }, function(err) {
            console.log(err);
            toastr.error(response.data.message, 'Thông báo');
        });


        // question.$save(function(response){
        //     console.log(response);
            
        //     for(let i=0; i<options.length; i++) {
        //         let option = new OptionFactory(options[i]);
        //             option.question_id = response.question._id;
        //             option.$save(function(response) {
        //                 console.log(response);
        //                 // if(response.is_correct) {
        //                 //     question.correct_option = response._id;
        //                 //     question.$update(function(response) {
        //                 //         console.log(response);
        //                 //     });
        //                 // }

        //             }, function(err) {
        //                 console.log(err);
        //             });
        //     }
        //     $scope.resetQuestion();
        //     toastr.success(response.message, 'Thông báo');
        // }, function(err) {
        //     console.log(err);
        //     toastr.error(response.data.message, 'Thông báo');
        // });

        // console.log('options', options, question);

            

        // question.$save(function(response) {
        //     $location.path('chapter/' + response._id);
        // }, function(errorResponse) {
        //     $scope.error = errorResponse.data.message;
        // });
    };


    var addQuestion = "question.addQuestion";
    $scope.question = {};

    $scope.getChapter = function() {
        ChapterFactory.query({subject_id: $scope.question.subject_id}, function(data){
            $scope.chapterLists = data.items;
        });
    }

    function setAddQuestion() {
        localStorageService.set(addQuestion, {
            question: $scope.question
        });
    }

    function getAddQuestion() {
        var createQuestion = localStorageService.get(addQuestion);
        // console.log(createQuestion);
        if (createQuestion.question) {
            $scope.question.question_type = createQuestion.question.question_type  ?  Number(createQuestion.question.question_type ): 0;
            $scope.question.level         = createQuestion.question.level         ?  Number(createQuestion.question.level) : 0;
            $scope.question.chapter_id    = createQuestion.question.chapter_id      ? createQuestion.question.chapter_id : null;
            $scope.question.subject_id    = createQuestion.question.subject_id      ? createQuestion.question.subject_id : null;
        }
    }
    
    $scope.filterAddQuestion = function() {
        $scope.getChapter();
        setAddQuestion();
        getAddQuestion();
    };
    $scope.findAddQuestion = function() {
        getAddQuestion();
    };

    // var radios = $('input[name="score"]');

    // for (var i = 0, length = radios.length; i < length; i++) {
    //     if (radios[i].checked) {
    //         console.log('111111111');
    //     } else {
    //         console.log('000000000');

    //     }
    // }
}

