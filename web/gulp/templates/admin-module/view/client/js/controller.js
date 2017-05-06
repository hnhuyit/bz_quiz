'use strict';

angular.module('<%= moduleName %>').controller('<%= controllerName %>Controller', ['$scope', '$stateParams', '$location','$window',<% if(status){ %>'Option',<% } %> 'Authentication','FileUploader', '<%= modelName %>',
    function($scope, $stateParams, $location, $window,<% if(status){ %>Option,<% } %> Authentication, FileUploader, <%= modelName %>) {
        $scope.authentication = Authentication;
        if (!Authentication.user.name) {
            $location.path('signin');
        }
        
        $scope.uploadApi = $window.settings.services.uploadApi;
        $scope.webUrl = $window.settings.services.webUrl;

        $scope.<%= modelItemName %> = new <%= modelName %>({});
        <% if(status){ %>
        $scope.statuses = Option.getStatus();
        $scope.<%= modelItemName %>.status = 1;
        <% } %>

        
         <% _.forEach(uploadObject, function(fieldSetting, field) { %>
        ///<%= field %> upload     
        $scope.isUpload<%= field %> = false;

        $scope.isInvalidFile0 = false;

        $scope.uploadPath = '/files/post/';

        var uploader<%= field %> = $scope.uploader<%= field %> = new FileUploader({
            url: $scope.uploadApi + '/v1/api/upload/image',
            formData: [{ type: 'post' }],
            autoUpload: true
        });

        // FILTERS
        uploader<%= field %>.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader<%= field %>.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader<%= field %>.onBeforeUploadItem = function(item) {
            $scope.$apply(function() {
                $scope.isUpload<%= field %> = true;
            });
        };
        uploader<%= field %>.onSuccessItem = function(fileItem, response, status, headers) {
            $scope.review_<%= field %> = $scope.webUrl + $scope.uploadPath + response.file.filename;
            if ($scope.<%= modelItemName %>) {
                $scope.<%= modelItemName %>.<%= field %> = $scope.uploadPath + response.file.filename;
            } else {
                $scope.<%= field %> = $scope.uploadPath + response.file.filename;
            }
        };

        uploader<%= field %>.onCompleteItem = function(fileItem, response, status, headers) {
            $scope.$apply(function() {
                $scope.isUpload<%= field %> = false;
            });
        };
        //end upload <%= field %>
        <% }) %>

        $scope.gotoList = function() {
            $location.path('<%= routeName %>');
        }
        //CRUD 
        $scope.create = function() {
            var <%= modelItemName %> = $scope.<%= modelItemName %>;
            <%= modelItemName %>.$save(function(response) {
                $location.path('<%= routeName %>/' + response._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(<%= modelItemName %>) {
            if (<%= modelItemName %>) {
                <%= modelItemName %>.$remove();
                for (var i in $scope.items) {
                    if ($scope.items[i] === <%= modelItemName %>) {
                        $scope.items.splice(i, 1);
                    }
                }
            } else {
                $scope.<%= modelItemName %>.$remove(function() {
                    $scope.gotoList();
                });
            }
        };

        $scope.update = function() {
            var <%= modelItemName %> = $scope.<%= modelItemName %>;
            <%= modelItemName %>.$update(function() {
                $scope.gotoList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.findOne = function() {
            $scope.<%= modelItemName %> = <%= modelName %>.get({
                itemId: $stateParams.itemId
            });
        };

        $scope.find = function() {
            var options = {
                page: $scope.currentPage,
                keyword: $scope.query,
            };
            <%= modelName %>.query(options, function(data) {
                $scope.items = data.items;
                $scope.totalItems = data.totalItems;
                $scope.itemsPerPage = data.itemsPerPage;
                $scope.numberVisiblePages = data.numberVisiblePages;
            });
        };
        //SEARCH AND PAGINATION
        $scope.currentPage = 1;

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.search = function() {
            $scope.find();
        };
        $scope.reset = function() {
            $scope.search.keyword = "";
            $scope.currentPage = 1;
            $scope.find();
        };
    }
]);
