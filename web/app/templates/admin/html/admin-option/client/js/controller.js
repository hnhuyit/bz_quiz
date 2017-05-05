// 'use strict';

// angular.module('option').controller('OptionsController', ['$scope', '$stateParams', '$location','$window','Option', 'Authentication','FileUploader', 'Option',
//     function($scope, $stateParams, $location, $window,Option, Authentication, FileUploader, Option) {
//         $scope.authentication = Authentication;
//         if (!Authentication.user.name) {
//             $location.path('signin');
//         }
        
//         $scope.uploadApi = $window.settings.services.uploadApi;
//         $scope.webUrl = $window.settings.services.webUrl;

//         $scope.option = new Option({});
        
//         $scope.statuses = Option.getStatus();
//         $scope.option.status = 1;
        

        
         

//         $scope.gotoList = function() {
//             $location.path('option');
//         }
//         //CRUD 
//         $scope.create = function() {
//             var option = $scope.option;
//             option.$save(function(response) {
//                 $location.path('option/' + response._id);
//             }, function(errorResponse) {
//                 $scope.error = errorResponse.data.message;
//             });
//         };

//         $scope.remove = function(option) {
//             if (option) {
//                 option.$remove();
//                 for (var i in $scope.items) {
//                     if ($scope.items[i] === option) {
//                         $scope.items.splice(i, 1);
//                     }
//                 }
//             } else {
//                 $scope.option.$remove(function() {
//                     $scope.gotoList();
//                 });
//             }
//         };

//         $scope.update = function() {
//             var option = $scope.option;
//             option.$update(function() {
//                 $scope.gotoList();

//             }, function(errorResponse) {
//                 $scope.error = errorResponse.data.message;
//             });
//         };

//         $scope.findOne = function() {
//             $scope.option = Option.get({
//                 itemId: $stateParams.itemId
//             });
//         };

//         $scope.find = function() {
//             var options = {
//                 page: $scope.currentPage,
//                 keyword: $scope.query,
//             };
//             Option.query(options, function(data) {
//                 $scope.items = data.items;
//                 $scope.totalItems = data.totalItems;
//                 $scope.itemsPerPage = data.itemsPerPage;
//                 $scope.numberVisiblePages = data.numberVisiblePages;
//             });
//         };
//         //SEARCH AND PAGINATION
//         $scope.currentPage = 1;

//         $scope.setPage = function(pageNo) {
//             $scope.currentPage = pageNo;
//         };

//         $scope.search = function() {
//             $scope.find();
//         };
//         $scope.reset = function() {
//             $scope.search.keyword = "";
//             $scope.currentPage = 1;
//             $scope.find();
//         };
//     }
// ]);
