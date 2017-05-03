angular
    .module('Home')
    .controller('HomeController', HomeController)
    .controller('TeacherController', TeacherController)
    .controller('StudentController', StudentController);

function HomeController($scope, $filter, SubjectFactory, QuizFactory, QuestionFactory, AuthFactory, $cookies, Notice, toastr, localStorageService) {

    $scope.quizLists = QuizFactory.getQuizzesByNoLogin({});
    console.log($scope.quizLists);

}
function TeacherController($scope, SubjectFactory, QuizFactory, QuestionFactory) {

    QuizFactory.query(function(data){
        $scope.totalQuiz = data.totalItems;
    });

    SubjectFactory.query(function(data){
        $scope.totalSubject = data.totalItems;
    });
        
    QuestionFactory.query(function(data){
        $scope.totalQuestion = data.totalItems;
    });

}
function StudentController($scope, SubjectFactory, QuizFactory, toastr) {

    $scope.listSubjects = SubjectFactory.getSubjectsByStudent({});
    $scope.listQuizzes = QuizFactory.getQuizzesBySubject({});

    $scope.joinSubject = function joinSubject() {
        let key = $scope.key;
        
        SubjectFactory.getSubjectByKey({key:key}, function(data) {
            let message = 'Bạn đã tham gia môn học ' + data.name;
            toastr.success(message, 'Thông báo');
        }, function(err) {
            console.log(err);
            toastr.error(err.data.message, 'Thông báo');
        });
    }

}