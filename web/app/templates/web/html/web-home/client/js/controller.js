angular
    .module('Home')
    .controller('HomeController', HomeController);

function HomeController($scope, $filter, SubjectFactory, QuizFactory, AuthFactory, $cookies, toastr, localStorageService) {

    // $scope.loading = true;

    QuizFactory.query(function(data){
        // console.log(data);
        $scope.totalQuiz = data.totalItems;
    });
    SubjectFactory.query(function(data){
        $scope.totalSubject = data.totalItems;
    });
    // AuthFactory.query(function(data){
    //     $scope.totalUser = data.totalItems;
    // });
}