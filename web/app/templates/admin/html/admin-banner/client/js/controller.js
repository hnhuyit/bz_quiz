'use strict';

// Banners controller
angular.module('banners').controller('BannersController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Banners', 'Option', 'FileUploader', 'Categories',
    function($scope, $stateParams, $location, $window, Authentication, Banners, Option, FileUploader, Categories) {

        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        $scope.uploadApi = $window.settings.services.uploadApi;
        $scope.webUrl = $window.settings.services.webUrl;
        $scope.statuses = Option.getStatus();

        $scope.features = Option.getFeatures();

        $scope.positions = Option.getPositions();

        $scope.isUploadImage = false;

        $scope.isInvalidFile = false;

        $scope.bannerPath = '/files/banner/';

        var uploader = $scope.uploader = new FileUploader({
            url: $scope.uploadApi + '/api/upload/image',
            formData: [{ type: 'banner' }],
            autoUpload: true,

        });

        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onBeforeUploadItem = function(item) {
            $scope.$apply(function() {
                $scope.isUploadImage = true;
            });
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            $scope.review_image = $scope.webUrl + $scope.bannerPath + response.file.filename;

            if ($scope.banner) {
                $scope.banner.image = $scope.bannerPath + response.file.filename;
            } else {
                $scope.image = $scope.bannerPath + response.file.filename;
            }
        };

        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            $scope.$apply(function() {
                $scope.isUploadImage = false;
            });
        };
        $scope.categories = Categories.query({type: 'banner'});

        $scope.gotoList = function() {
            $location.path('banners');
        }

        // Create new Banner
        $scope.create = function() {
            // Create new Banner object
            var banner = new Banners({
                title: this.title,
                subtitle: this.subtitle,
                link: this.link,
                image: this.image,
                description: this.description,
                status: this.status,
                category: this.category,
                position: this.position,
            });
            console.log(banner.category, 'po');
            if (banner.category === undefined) {
                $scope.categories = Categories.query(function(resp) {
                    banner.category = [];
                    for (var i = 0; i < resp.items.length; i++)
                        banner.category.push(resp.items[i]._id);
                    banner.$save(function(response) {
                        $location.path('banners/' + response._id);

                        // Clear form fields
                        $scope.title = '';
                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                });
            } else {
                // Redirect after save
                banner.$save(function(response) {
                    $location.path('banners/' + response._id);

                    // Clear form fields
                    $scope.title = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        // Remove existing Banner
        $scope.remove = function(banner) {
            if (banner) {
                banner.$remove();

                for (var i in $scope.banners) {
                    if ($scope.banners[i] === banner) {
                        $scope.banners.splice(i, 1);
                    }
                }
            } else {
                $scope.banner.$remove(function() {
                    //$location.path('banners');
                    $scope.gotoList();
                });
            }
        };

        // Update existing Banner
        $scope.update = function() {
            var banner = $scope.banner;
            delete banner.__v;
            delete banner.created;
            if (banner.category === undefined) {
                $scope.categories = Categories.query(function(resp) {
                    banner.category = [];
                    for (var i = 0; i < resp.items.length; i++)
                        banner.category.push(resp.items[i]._id);
                    banner.$update({ bannerId: banner._id }, function(resp) {
                        //$location.path('banners/' + banner._id);
                        //console.log("Da vao");//
                        $scope.gotoList();

                    }, function(errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                });
            } else {
                banner.$update({ bannerId: banner._id }, function(resp) {
                    //$location.path('banners/' + banner._id);
                    //console.log("Da vao");//
                    $scope.gotoList();

                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }

        }

        // Find a list of Banners
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
            $scope.categories = Categories.query(function(resp) {
                Banners.query(options, function(data) {
                    $scope.banners = data.items;
                    $scope.totalItems = data.totalItems;
                    $scope.category = [];
                    $scope.itemsPerPage = data.itemsPerPage;
                    $scope.numberVisiblePages = data.numberVisiblePages;
                    for (var i = 0; i < data.items.length; i++) {
                        for (var j = 0; j < data.items[i].category.length; j++) {
                            for (var h = 0; h < resp.items.length; h++)
                            //$scope.banners[i].category[j] = resp.items[0];
                                if (data.items[i].category[j] === resp.items[h]._id)
                                $scope.banners[i].category[j] = resp.items[h];
                        }
                    }

                });
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

        // Find existing Banner
        $scope.findOne = function() {
            $scope.banner = Banners.get({
                bannerId: $stateParams.bannerId
            }, function(data) {
                if ($scope.banner.image) {
                    $scope.review_image = $scope.webUrl + $scope.banner.image;

                }
            });

        };
    }
]);
