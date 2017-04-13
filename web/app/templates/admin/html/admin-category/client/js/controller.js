'use strict';

// Categories controller
angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Option', 'Authentication', 'Categories',
    function($scope, $stateParams, $location, Option, Authentication, Categories) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        $scope.types = Option.getTypes();
        $scope.statuses = Option.getStatus();
        $scope.gotoList = function() {
            $location.path('categories');
        }


        // Create new Category
        $scope.create = function() {
            // Create new Category object
            var category = new Categories({
                name: this.name,
                slug: this.slug,
                type: this.type,
                status: this.status,
                description: this.description
            });

            // Redirect after save
            category.$save(function(response) {
                $location.path('categories/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Category
        $scope.remove = function(category) {
            if (category) {
                category.$remove();

                for (var i in $scope.categories) {
                    if ($scope.categories[i] === category) {
                        $scope.categories.splice(i, 1);
                    }
                }
            } else {
                $scope.category.$remove(function() {
                    //$location.path('categories');
                    $scope.gotoList();
                });
            }
        };

        // Update existing Category
        $scope.update = function() {
            var category = $scope.category;
            delete category.__v;
            delete category.created;
            category.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Category
        $scope.findOne = function() {
            $scope.category = Categories.get({
                categoryId: $stateParams.categoryId
            });
        };

        $scope.currentPage = 1;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            getListData();
        };

        function getListData() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };

            Categories.query(options, function(data) {
                $scope.categories = data.items;
                $scope.totalItems = data.totalItems;
                $scope.itemsPerPage = data.itemsPerPage;
                $scope.numberVisiblePages = data.numberVisiblePages;
            });
        }

        // Find a list of Posts
        $scope.find = function() {
            getListData();
        };
        //search
        $scope.search = function() {
            getListData();
        };
        //reset
        $scope.reset = function() {
            $scope.search.keyword = "";
            $scope.currentPage = 1;
            getListData();
        };
    }
]);
