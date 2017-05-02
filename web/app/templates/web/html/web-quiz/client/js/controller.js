angular
    .module('Quiz')
    .controller('QuizController', QuizController)
    .controller('AttemptQuizController', AttemptQuizController);

function QuizController($scope, $filter, QuizService, QuizFactory, QuizQuestionFactory, GroupFactory, SubjectFactory, QuestionFactory, $cookies, toastr) {

	// console.log(QuizFactory);
    GroupFactory.query(function(data){
    	$scope.groupList = data.items;
    });

    SubjectFactory.query(function(data){
    	$scope.subjectList = data.items;
    });

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
    
    $scope.addQuestion = function(question_id, quiz_id) {
            
        let qq = new QuizQuestionFactory({
            question_id: question_id,
            quiz_id: quiz_id
        });

        qq.$save(function(response) {
            $scope.item = response;
            console.log(response);
            toastr.success(response.message, 'Thông báo');
        }, function(err) {
            $scope.error = errorResponse.data.message;
        });

        // if(quiz_id) {
        //     QuizQuestionFactory.query(function(data){

        //         let quiz_ids = [];
        //         for(var i=0; i<data.totalItems; i++) {
        //             quiz_ids[i] = data.items[i].quiz_id;
        //         }

        //         if(!quiz_ids.includes(quiz_id)) {
        //             let qq = new QuizQuestionFactory({
        //                 question_id: [question_id],
        //                 quiz_id: quiz_id
        //             });

        //             qq.$save(function(response) {
        //                 console.log(response);
        //             }, function(err) {
        //                 $scope.error = errorResponse.data.message;
        //             });
        //         }
        //          else {

        //             let qq = new QuizQuestionFactory({
        //                 question_id: [question_id],
        //                 quiz_id: quiz_id
        //             });
                    
        //             qq.$update(function(response) {
        //                 console.log(response);

        //             }, function(errorResponse) {
        //                 $scope.error = errorResponse.data.message;
        //             });
        //         }
        //     });
        // }


    };
}

function AttemptQuizController($scope, $filter, $window, $location, QuizFactory, QuizQuestionFactory, GroupFactory, SubjectFactory, QuestionFactory, toastr) {

    //Ser permission
    //
    //

    //Var
    var url = $location.$$absUrl;
    var idQuiz = url.substr(url.length-32,24);

    //Method
    $scope.getQuestionbyQuiz = function() {
        QuizQuestionFactory.query({quiz_id: idQuiz}, function(data) {
            let qqs = data.items;
            let questions = [];
            qqs.forEach(function(qq) {
                questions.push(qq.question_id);
            });
            // console.log(questions);
            $scope.questions = questions;
        });
    }
    $scope.find = function() {
        $scope.quiz = QuizFactory.get({itemId: idQuiz});
        $scope.getQuestionbyQuiz();
    }


    //Init data
    // $scope.find();
};
