'use strict';

// Users controller
angular.module('users').controller('UsersController', ['$rootScope', '$scope', '$log', '$stateParams', '$location', 'Authentication', 'Users', 'Option', '$sce', 'Notice', '$timeout', 'localStorageService',

    function ($rootScope, $scope, $log, $stateParams, $location, Authentication, Users, Option, $sce, Notice, $timeout, localStorageService) {

        if (!Authentication.user.name) {
            $location.path('signin');
        }
        var localStorageName = "user.filterData";
        $scope.search = {};
        $scope.isLoading = false;
        $scope.gotoList = gotoList;
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        $scope.statuses = Option.getStatus();
        $scope.userRoles = Option.getRoles();
        $scope.rowsSelected = {};
        $scope.create = create;
        $scope.update = update;
        $scope.findOne = findOne;
        $scope.setPage = setPage;
        $scope.pageChanged = pageChanged;
        $scope.find = find;
        $scope.confirmRemove = confirmRemove;
        $scope.remove = remove;
        $scope.movetoTrashMultiRows = movetoTrashMultiRows;
        $scope.changeStatus = changeStatus;
        $scope.processChangeStatus = processChangeStatus;
        $scope.changeStatusMultiRows = changeStatusMultiRows;
        $scope.sellectAll = sellectAll;
        $scope.putback = putback;
        $scope.filter = filter;


        function showLoading() {
            $scope.isLoading = true;
        }

        function hideLoading() {
            $timeout(function () {
                $scope.isLoading = false;
            }, 500);
        }

        function gotoList() {
            $location.path('users');
        }
        // Create new user
        function create(isValid, type) {
            var user = new Users({
                name: this.name,
                email: this.email,
                password: this.password,
                cfpassword: this.cfpassword,
                status: this.status,
                roles: this.roles
            });

            // Redirect after save
            user.$save(function (response) {
                if (response._id) {
                    if (type == 'save&list') {
                        $scope.gotoList();
                    } else {
                        $location.path('users/' + response._id + '/edit');
                        $scope.name = '';
                        $scope.submitted = false;
                        // $scope.succes = 'Save user success!';
                    }
                } else {
                    Notice.setNotice(response.message, "ERROR");
                }

            }, function (errorResponse) {
                Notice.setNotice(errorResponse.data.message, "ERROR");
            });
        };

        /**
         * function update user
         */
        function update(isValid, type) {
            var user = $scope.user;
            delete user.__v;
            delete user.password_token;
            delete user.created;
            delete user.provider;
            delete user.activeToken;

            $scope.$log = $log;
            user.password = $scope.password;
            user.cfpassword = $scope.cfpassword;
            user.$update(function (response) {
                if (response.error) {
                    Notice.setNotice(response.message, "ERROR");
                } else {
                    Notice.setNotice("Update user success!", 'SUCCESS');
                    if (type == 'save&list') {
                        gotoList();
                    } else {
                        Notice.requireChange();
                    }
                }
            }, function (errorResponse) {
                // $scope.error = errorResponse.data.message;
                Notice.setNotice(errorResponse.data.message, "ERROR");
            });
        };

        /**
         * function Find One
         */
        function findOne() {
            $scope.user = Users.get({
                userId: $stateParams.userId
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

        function getOptionsQuery() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                role: $scope.search.role,
                status: $scope.search.status
            };
            return options;
        }

        function setScopeAfterQuery(data) {
            $scope.users = data.items;
            $scope.totalItems = data.totalItems;
            $scope.totalPage = data.totalPage;
            $scope.itemsPerPage = data.itemsPerPage;
            $scope.numberVisiblePages = data.numberVisiblePages;
        }

        function getListData() {

            showLoading();
            // Reset selected row
            $scope.rowsSelected = {};

            // get filter from local storage
            getFilterToLocalStorage();

            Users
                .query(getOptionsQuery(), function (data) {
                    setScopeAfterQuery(data);
                    hideLoading();
                });
        }

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
                    $scope.search.role = filterData.search.role ? filterData.search.role : null;
                    $scope.search.status = Number.isInteger(filterData.search.status) ? Number(filterData.search.status) : null;
                }

            }
        }
        // Find a list of Posts
        function find() {
            getListData();
        };

        function filter() {
            setPage(1);
            setFilterToLocalStorage();
            getListData();
        };
        //reset
        $scope.reset = function () {
            $scope.search.keyword = "";
            $scope.search.role = "";
            $scope.search.status = "";
            $scope.currentPage = 1;
            setFilterToLocalStorage();
            getListData();
        };

        // Remove existing User
        function confirmRemove(userId, deletePermanent) {

            $scope.currentUserId = userId;
            $scope.deletePermanent = deletePermanent;

            if (deletePermanent) {
                $scope.confirmMessage = "Do you want to delete permanent this user ?";
                $scope.confirmDeleteBtn = "Delete Permanent";
            } else {
                $scope.confirmMessage = "Do you want to move to trash this user ?";
                $scope.confirmDeleteBtn = "Move to trash";
            }
        }

        // Remove Function
        function remove(userId, deletePermanent) {
            // Check User is trash
            var userId = $scope.currentUserId;
            if ($scope.deletePermanent) {
                var user = Users.get({
                    userId: userId
                });
                user.$remove({
                    userId: userId
                });
                Notice.setNotice("Delete user success!", 'SUCCESS');
                // Close Popup Confirm
                $('.modal').modal('hide');
            } else {
                Users.moveToTrash({
                    id: userId,
                }, function (response) {
                    console.log(response);
                    if (response.status) {
                        // Close Popup Confirm
                        $('.modal').modal('hide');
                        Notice.setNotice(response.message, 'SUCCESS', true);
                    }
                });
            }

            for (var i in $scope.users) {
                if ($scope.users[i]._id === userId) {
                    $scope.users.splice(i, 1);
                }
            }

            if ($stateParams.userId) {
                $scope.gotoList();
            } else {
                Notice.requireChange();
            }
            $scope.currentUserId = null;
        };

        // movetoTrashMultiRows Function
        function movetoTrashMultiRows() {
            var rowsSelected = $scope.rowsSelected;
            if (angular.equals({}, rowsSelected)) {
                Notice.setNotice("Choose Items before delete", 'INFO', true);
                $('.modal').modal('hide');
            } else {
                Users.deleteMultiRows({
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
        function changeStatus(userId, status) {

            $scope.currentUserId = userId;
            $scope.currentStatus = status;

            if (status == 1) {
                $scope.confirmMessage = $sce.trustAsHtml("Do you want to change status from <b>Publish</b> to <b>Unpublish</b>?");
            } else {
                $scope.confirmMessage = $sce.trustAsHtml("Do you want to change status from <b>Unpublish</b> to <b>Publish</b>?");
            }
        }

        function processChangeStatus() {
            var userId = $scope.currentUserId;
            var currentStatus = $scope.currentStatus;

            Users.changeStatus({
                id: userId,
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
                Users.changeStatusMultiRows({
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

        function putback(userId) {
            Users.get({
                userId: userId
            }, function (result) {
                result.status = 0;
                result.password = null;
                result.cfpassword = null;
                result.$update({}, function (resp) {
                    if (resp._id) {
                        for (var i in $scope.users) {
                            if ($scope.users[i]._id === userId) {
                                $scope.users.splice(i, 1);
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

        function sellectAll() {
            var rowsSelected = {};
            if ($scope.selectAll) {
                var users = $scope.users;
                users.forEach(function (user) {
                    rowsSelected[user._id] = true;
                });
                console.log(rowsSelected);
            }
            $scope.rowsSelected = rowsSelected;
        }
    }
]);