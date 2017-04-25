angular
    .module('Home')
    .controller('HomeController', HomeController)
    .controller('TeacherController', TeacherController)
    .controller('StudentController', StudentController);

function HomeController($scope, $filter, SubjectFactory, QuizFactory, QuestionFactory, AuthFactory, $cookies, Notice, toastr, localStorageService) {



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
function StudentController($scope, SubjectFactory, QuizFactory) {

    SubjectFactory.getSubjectsByStudent(function(data){
        $scope.listSubjects = data.items;
    });

    QuizFactory.getQuizzesBySubject(function(data){
        $scope.listQuizzes = data.items;
    });

    $scope.joinSubject = function joinSubject() {
        let key = $scope.key;
        
        SubjectFactory.getSubjectByKey({key:key}, function(data) {
            let message = 'Bạn đã tham gia môn học ' + data.name;
            toastr.success(message, 'Thong bao');
        });
    }

}