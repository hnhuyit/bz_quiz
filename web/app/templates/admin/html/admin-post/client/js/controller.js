'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$stateParams', '$location', '$window', 'Option', 'Authentication', 'FileUploader', 'Posts', 'Categories', '$sce', 'Notice', '$timeout', 'localStorageService',

    function ($scope, $stateParams, $location, $window, Option, Authentication, FileUploader, Posts, Categories, $sce, Notice, $timeout, localStorageService) {

        if (!Authentication.user.name) {
            $location.path('signin');
        }
        var localStorageName = "post.filterData";

        $scope.tinymceOptions = {
            automatic_uploads: true,
            file_picker_callback: function (callback, value, meta) {
                if (meta.filetype == 'image') {
                    $('#upload').trigger('click');
                    $('#upload').on('change', function () {
                        var file = this.files[0];
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            callback(e.target.result, {
                                alt: ''
                            });
                        };
                        reader.readAsDataURL(file);
                    });
                }
            },
            plugins: 'link code fullscreen textcolor table media searchreplace visualblocks advlist lists media image imagetools codesample link',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | forecolor table searchreplace link | bullist numlist outdent indent | fullscreen | image media | code codesample'
        };

        $scope.isLoading = false;
        $scope.currentPage = 1;
        $scope.rowsSelected = {};
        $scope.uploadApi = $window.settings.services.uploadApi;
        $scope.webUrl = $window.settings.services.webUrl;
        $scope.statuses = Option.getStatus();
        $scope.features = Option.getFeatures();
        $scope.authentication = Authentication;
        $scope.setPage = setPage;
        $scope.pageChanged = pageChanged;
        $scope.confirmRemove = confirmRemove;
        $scope.sellectAll = sellectAll;
        $scope.changeStatus = changeStatus;
        $scope.update = update;
        $scope.create = create;
        $scope.processChangeStatus = processChangeStatus;
        $scope.remove = remove;
        $scope.changeStatusMultiRows = changeStatusMultiRows;
        $scope.movetoTrashMultiRows = movetoTrashMultiRows;
        $scope.search = {};
        $scope.reset = reset;
        $scope.find = find;
        $scope.putback = putback;
        $scope.gotoList = gotoList;

        function showLoading() {
            $scope.isLoading = true;
        }

        function hideLoading() {
            $timeout(function () {
                $scope.isLoading = false;
            }, 500);
        }


        ///thumb upload

        $scope.isUploadImage0 = false;
        $scope.isInvalidFile0 = false;
        $scope.postPath = '/files/post/';

        var uploader0 = $scope.uploader0 = new FileUploader({
            url: $scope.uploadApi + '/api/upload/image',
            formData: [{ type: 'post' }],
            autoUpload: true
        });

        // FILTERS
        uploader0.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader0.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader0.onBeforeUploadItem = function (item) {
            $scope.$apply(function () {
                $scope.isUploadImage0 = true;
            });
        };
        uploader0.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.review_thumb = $scope.webUrl + $scope.postPath + response.file.filename;
            if ($scope.post) {
                $scope.post.thumb = $scope.postPath + response.file.filename;
            } else {
                $scope.thumb = $scope.postPath + response.file.filename;
            }
        };

        uploader0.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.$apply(function () {
                $scope.isUploadImage0 = false;
            });
        };
        //////

        $scope.isUploadImage = false;

        $scope.isInvalidFile = false;

        var uploader = $scope.uploader = new FileUploader({
            url: $scope.uploadApi + '/api/upload/image',
            formData: [{ type: 'post' }],
            autoUpload: true
        });

        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onBeforeUploadItem = function (item) {
            $scope.$apply(function () {
                $scope.isUploadImage = true;
            });
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.review_image = $scope.webUrl + $scope.postPath + response.file.filename;
            if ($scope.post) {
                $scope.post.image = $scope.postPath + response.file.filename;
            } else {
                $scope.image = $scope.postPath + response.file.filename;
            }
        };

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.$apply(function () {
                $scope.isUploadImage = false;
            });
        };

        function gotoList() {
            $location.path('posts');
        }

        $scope.categories = Categories.query({ type: 'post' });

        // Create new Post
        function create() {
            // Create new Post object
            var post = new Posts({
                title: this.title,
                slug: this.slug,
                feature: this.feature,
                teaser: this.teaser,
                image: this.image,
                thumb: this.thumb,
                content: this.content,
                status: this.status,
                category: this.category,
                attrs: this.attrs
            });

            // Redirect after save
            post.$save(function (response) {
                $scope.message = 'post success';
                $location.path('posts/' + response._id);

                // Clear form fields
                $scope.title = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Update existing Post       

        function update(isValid, type) {

            var post = $scope.post;
            delete post.created;
            delete post.__v;

            post.$update(function (response) {
                if (response.error) {
                    Notice.setNotice(response.message, "ERROR");
                } else {
                    Notice.setNotice("Update post success!", 'SUCCESS');
                    if (type == 'save&list') {
                        gotoList();
                    } else {
                        Notice.requireChange();
                    }
                }
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Post
        $scope.findOne = function () {
            $scope.post = Posts.get({
                postId: $stateParams.postId
            }, function () {
                if ($scope.post.thumb) {
                    $scope.review_thumb = $scope.webUrl + $scope.post.thumb;
                }
                if ($scope.post.image) {
                    $scope.review_image = $scope.webUrl + $scope.post.image;
                }
            });
        };

        function setPage(pageNo) {
            $scope.currentPage = pageNo;
        };

        function pageChanged(page) {
            setPage(page);
            setFilterToLocalStorage();
            getListData();
        };

        function setFilterToLocalStorage() {
            localStorageService.set(localStorageName, {
                currentPage: $scope.currentPage,
                search: $scope.search
            });
        }

        function getFilterToLocalStorage() {
            var filterData = localStorageService.get(localStorageName);
            if (!$.isEmptyObject(filterData)) {
                $scope.currentPage = Number.isInteger(filterData.currentPage) ? Number(filterData.currentPage) : 1;
                if (!$.isEmptyObject(filterData.search)) {
                    $scope.search.keyword = filterData.search.keyword ? filterData.search.keyword : "";
                    $scope.search.category = filterData.search.category ? filterData.search.category : null;
                    $scope.search.status = Number.isInteger(filterData.search.status) ? Number(filterData.search.status) : null;
                    $scope.search.feature = Number.isInteger(filterData.search.feature) ? Number(filterData.search.feature) : null;
                }
            }
        }

        function getOptionsQuery() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                category: $scope.search.category,
                status: $scope.search.status,
                feature: $scope.search.feature
            };
            return options;
        }

        function setScopeAfterQuery(data) {
            $scope.posts = data.items;
            $scope.totalItems = data.totalItems;
            $scope.totalPage = data.totalPage;
            $scope.itemsPerPage = data.itemsPerPage;
            $scope.numberVisiblePages = data.numberVisiblePages;
        }

        function getListData() {
            $scope.rowsSelected = {};

            // get filter from local storage
            getFilterToLocalStorage();

            // save to local store
            Posts.query(getOptionsQuery(), function (data) {
                setScopeAfterQuery(data);
                hideLoading();
            });
        }

        $scope.filter = function () {
            setPage(1);
            setFilterToLocalStorage();
            getListData();
        }

        // Find a list of Posts
        function find() {
            showLoading();
            getListData();
        };

        //reset
        function reset() {
            $scope.search.keyword = "";
            $scope.search.category = "";
            $scope.search.status = "";
            $scope.search.feature = "";
            $scope.currentPage = 1;
            setFilterToLocalStorage();
            getListData();
        };
        /**
         * 
         * 
         */
        function sellectAll() {
            var rowsSelected = {};
            if ($scope.selectAll) {
                var posts = $scope.posts;
                posts.forEach(function (post) {
                    rowsSelected[post._id] = true;
                });
                console.log(rowsSelected);
            }
            $scope.rowsSelected = rowsSelected;
        }

        // Remove Function
        function remove(postId, deletePermanent) {
            // Check User is trash
            var postId = $scope.currentPostId;
            if ($scope.deletePermanent) {
                var post = Posts.get({
                    postId: postId
                });
                post.$remove({
                    postId: postId
                });
                Notice.setNotice("Delete post success!", 'SUCCESS');
                // Close Popup Confirm
                $('.modal').modal('hide');
            } else {
                Posts.moveToTrash({
                    id: postId,
                }, function (response) {
                    console.log(response);
                    if (response.status) {
                        // Close Popup Confirm
                        $('.modal').modal('hide');
                        Notice.setNotice(response.message, 'SUCCESS', true);
                    }
                });
            }

            for (var i in $scope.posts) {
                if ($scope.posts[i]._id === postId) {
                    $scope.posts.splice(i, 1);
                }
            }

            if ($stateParams.postId) {
                $scope.gotoList();
            } else {
                Notice.requireChange();
            }
            $scope.currentPostId = null;
        };

        // movetoTrashMultiRows Function
        function movetoTrashMultiRows() {
            var rowsSelected = $scope.rowsSelected;
            if (angular.equals({}, rowsSelected)) {
                Notice.setNotice("Choose Items before delete", 'INFO', true);
                $('.modal').modal('hide');
            } else {
                Posts.deleteMultiRows({
                    rowsSelected: $scope.rowsSelected,
                    currentStatusFilter: search.status
                }, function (response) {
                    if (response.status) {
                        getListData();
                        Notice.setNotice(response.message, 'SUCCESS', true);
                        // Close Popup Confirm
                        $('.modal').modal('hide');
                    }
                });
            }

        };
        // Change status
        function changeStatus(postId, status) {
            $scope.currentPostId = postId;
            $scope.currentStatus = status;

            if (status == 1) {
                $scope.confirmMessage = $sce.trustAsHtml("Do you want to change status from <b>Publish</b> to <b>Unpublish</b>?");
            } else {
                $scope.confirmMessage = $sce.trustAsHtml("Do you want to change status from <b>Unpublish</b> to <b>Publish</b>?");
            }
        }

        // Remove existing User
        function confirmRemove(postId, deletePermanent) {

            $scope.currentPostId = postId;
            $scope.deletePermanent = deletePermanent;

            if (deletePermanent) {
                $scope.confirmMessage = "Do you want to delete permanent this user ?";
                $scope.confirmDeleteBtn = "Delete Permanent";
            } else {
                $scope.confirmMessage = "Do you want to move to trash this user ?";
                $scope.confirmDeleteBtn = "Move to trash";
            }
        }

        function processChangeStatus() {

            var postId = $scope.currentPostId;
            var currentStatus = $scope.currentStatus;

            Posts.changeStatus({
                id: postId,
                currentStatus: currentStatus
            }, function (response) {
                if (response.status) {
                    $('.modal').modal('hide');
                    getListData();
                    Notice.setNotice(response.message, 'SUCCESS', true);
                }
            });
        }

        function changeStatusMultiRows(status) {
            var rowsSelected = $scope.rowsSelected;
            if (angular.equals({}, rowsSelected)) {
                Notice.setNotice("Choose Items before change status", 'INFO', true);
                $('.modal').modal('hide');
            } else {
                Posts.changeStatusMultiRows({
                    rowsSelected: $scope.rowsSelected,
                    status: status
                }, function (response) {
                    if (response.status) {
                        // location.reload();
                        $('.modal').modal('hide');
                        getListData();
                        // Reset  All Checked
                        $scope.rowsSelected = {};
                        $scope.selectAll = false;

                        // Set Notice
                        Notice.setNotice(response.message, 'SUCCESS', true);
                    }
                });
            }

        }

        function putback(postId) {
            Posts.get({
                postId: postId
            }, function (result) {
                result.status = 0;
                delete result.__v;
                result.$update({}, function (resp) {
                    if (resp._id) {
                        for (var i in $scope.posts) {
                            if ($scope.posts[i]._id === postId) {
                                $scope.posts.splice(i, 1);
                            }
                        }
                        Notice.setNotice("Put user back success!", 'SUCCESS');
                        Notice.requireChange();
                        $scope.submitted = false;
                    } else {
                        Notice.setNotice(resp.message, 'ERROR', true);
                    }
                }, function (errorResponse) {
                    Notice.setNotice(errorResponse.data.message, 'ERROR', true);
                });
            });
        };
    }
]);