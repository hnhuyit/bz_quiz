angular
    .module('Chapter')
    .controller('ChapterController', ChapterController);

function ChapterController($scope, $filter, ChapterService, SubjectFactory, $cookies, toastr, localStorageService) {

	// console.log(localStorageService);

  //   localStorageService.set('chapter.create', {name: 11111111});

  //   $scope.find = function() {
		// // getChapterToLocalStorage();
  //   }


    SubjectFactory.query(function(data){
    	$scope.subjectList = data.items;
    });

}