angular
    .module('Question')
    .controller('QuestionsController', QuestionsController);

function QuestionsController($scope, $filter, $window, $location, QuestionService, QuestionFactory, SubjectFactory, ChapterFactory, OptionFactory, Option, $cookies, toastr) {

    
    SubjectFactory.query(function(data){
    	$scope.subjectList = data.items;
    });
    $scope.chapterList = [];

    $scope.typeQuestions = Option.getTypeQuestions();
    $scope.levels = Option.getLevels();

    $scope.getChapter = function() {
        // console.log(11111);
        ChapterFactory.query({subject_id: $scope.question.subject_id}, function(data){
            $scope.chapterList = data.items;
            // console.log(data);
        });
    }
    $scope.isCheck = false;

    $scope.reset = function() {
        $scope.question.name = "";
        $scope.question.desc = "";
        $scope.options.name1 = "";
        $scope.options.name2 = "";
        $scope.options.name3 = "";
        $scope.options.name4 = "";
        $scope.isCheck = false;
    };

    //CRUD 
    $scope.create = function() {
        // let question = $scope.question;
        let options = [
            {name: $scope.options.name1, score: $scope.options.score1 || 0},
            {name: $scope.options.name2, score: $scope.options.score2 || 0},
            {name: $scope.options.name3, score: $scope.options.score3 || 0},
            {name: $scope.options.name4, score: $scope.options.score4 || 0}
        ];
        let question = new QuestionFactory($scope.question);

        question.$save(function(response){
            console.log(response);
            
            for(let i=0; i<options.length; i++) {
                let option = new OptionFactory(options[i]);
                    option.question_id = response.question._id;
                    option.$save(function(response) {
                        console.log(response);
                        // if(response.is_correct) {
                        //     question.correct_option = response._id;
                        //     question.$update(function(response) {
                        //         console.log(response);
                        //     });
                        // }

                    }, function(err) {
                        console.log(err);
                    });
            }
            $scope.reset();
            toastr.success(response.message, 'Thông báo');
        }, function(err) {
            console.log(err);
            toastr.error(response.data.message, 'Thông báo');
        });

        // console.log('options', options, question);

            

        // question.$save(function(response) {
        //     $location.path('chapter/' + response._id);
        // }, function(errorResponse) {
        //     $scope.error = errorResponse.data.message;
        // });
    };
}
