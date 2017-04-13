'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contacts',
    function($scope, $stateParams, $location, Authentication, Contacts) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        $scope.gotoList = function() {
            $location.path('contacts');
        }

        // Create new Contact
        $scope.create = function() {
            // Create new Contact object
            var contact = new Contacts({
                name: this.name,
                email: this.email,
                phone: this.phone,
                address: this.address,
                messages: this.messages
            });

            // Redirect after save
            contact.$save(function(response) {
                $location.path('contacts/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Contact
        $scope.remove = function(contact) {
            if (contact) {
                contact.$remove();

                for (var i in $scope.contacts) {
                    if ($scope.contacts[i] === contact) {
                        $scope.contacts.splice(i, 1);
                    }
                }
            } else {
                $scope.contact.$remove(function() {
                    //$location.path('contacts');
                    $scope.gotoList();
                });
            }
        };

        // Update existing Contact
        $scope.update = function() {
            var contact = $scope.contact;
            delete contact.__v;
            delete contact.created;
            contact.$update(function() {
                //$location.path('contacts/' + contact._id);
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Contact
        $scope.findOne = function() {
            $scope.contact = Contacts.get({
                contactId: $stateParams.contactId
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

            Contacts.query(options, function(data) {
                $scope.contacts = data.items;
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
