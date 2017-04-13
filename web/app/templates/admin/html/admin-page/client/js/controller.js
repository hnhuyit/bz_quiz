'use strict';

// Pages controller
angular.module('pages').controller('PagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pages',
    function($scope, $stateParams, $location, Authentication, Pages) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        $scope.gotoList = function() {
            $location.path('pages');
        }

        // Create new Page
        $scope.create = function() {
            // Create new Page object
            var page = new Pages({
                title: this.title,
                slug: this.slug,
                content: this.content
            });

            // Redirect after save
            page.$save(function(response) {
                $location.path('pages/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Page
        $scope.remove = function(page) {
            if (page) {
                page.$remove();

                for (var i in $scope.pages) {
                    if ($scope.pages[i] === page) {
                        $scope.pages.splice(i, 1);
                    }
                }
            } else {
                $scope.page.$remove(function() {
                    //$location.path('pages');
                    $scope.gotoList();
                });
            }
        };

        // Update existing Page
        $scope.update = function() {
            var page = $scope.page;
            delete page.__v;
            delete page.created;
            page.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Page
        $scope.findOne = function() {
            $scope.page = Pages.get({
                pageId: $stateParams.pageId
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

            Pages.query(options, function(data) {
                $scope.pages = data.items;
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
