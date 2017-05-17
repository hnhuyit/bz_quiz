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

function AttemptQuizController($scope, $timeout, $location, QuizFactory, OptionFactory, AnwserFactory, toastr) {

    //Ser permission
    

    //Var
    var url = $location.$$absUrl;
    var idQuiz = url.substr(url.length-32,24);

    $scope.find = function() {
        $scope.quiz = QuizFactory.get({itemId: idQuiz});
    }

    
    //Init data
    $scope.submitQuiz = function() {
        let anwser = new AnwserFactory();
        anwser.quiz_id = idQuiz;
        anwser.question_name = $scope.questions.name;
        anwser.option_name = $scope.options.name;

        console.log(anwser);

        
        // anwser.$save(function(anwser) {
        //     // console.log(anwser);
        // }, function(err) {
        //     console.log(err);
        // });
    }
};
