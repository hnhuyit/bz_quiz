'use strict';

// Settings controller
angular.module('settings').controller('SettingsController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Settings', 'Option', 'FileUploader', 'Categories', '$http', '$timeout', 'Notice', 'Upload',
    function($scope, $stateParams, $location, $window, Authentication, Settings, Option, FileUploader, Categories, $http, $timeout, Notice, Upload) {

        $scope.authentication = Authentication;

        if (!Authentication.user.name) {
            $location.path('signin');
        }
        $scope.uploadApi = $window.settings.services.uploadApi;
        $scope.webUrl = $window.settings.services.webUrl;
        $scope.statuses = Option.getStatus();
        $scope.isLoading = false;
        $scope.features = Option.getFeatures();

        $scope.value_types = [{
            name: 'String',
            value: 'string'
        }, {
            name: 'Textarea',
            value: 'textarea'
        }, {
            name: 'Json',
            value: 'json'
        }, {
            name: 'Boolean',
            value: 'boolean'
        }, {
            name: 'Number',
            value: 'number'
        }, {
            name: 'Image',
            value: 'image'
        }, {
            name: 'DateTime',
            value: 'date'
        }];

        $scope.value_type = 'string';

        $scope.value_boolean = [{
            name: 'True',
            value: true
        }, {
            name: 'False',
            value: false
        }];

        $scope.json_editor_opt = {
            mode: 'tree'
        };

        $scope.prettyJson = function(value_type, obj) {
            if (value_type == 'json') {
                $scope.changeValue('json', obj);
                delete obj['$$hashKey'];
                return angular.toJson(obj, true);
            }
            return null;
            // console.log(typeof(obj));
            // if (typeof (obj) == 'object') {
            //     $scope.changeValue('json', obj);
            //     delete obj['$$hashKey'];
            // }
            // if (typeof (obj) == 'string') {
            //     try {
            //         obj = JSON.parse(obj);
            //     } catch (e) {
            //         console.log(e);
            //         obj = obj;
            //     }
            // }
            // return angular.toJson(obj, true);
        };

        $scope.changeOptions = function() {
            $scope.json_editor_opt.mode = $scope.json_editor_opt.mode == 'tree' ? 'code' : 'tree';
        };

        $scope.gotoList = function() {
            $location.path('settings');
        }

        $scope.disabled = {};

        $scope.enabledRestart = function(variable, seconds) {
            $scope.disabled[variable] = true;
            $timeout(function() {
                $scope.disabled[variable] = false;
            }, (seconds || 5) * 1000);
        };

        $scope.enabledRestart('restartDisabled', 5);

        // Create new Setting
        $scope.create = function(isValid, gotoList, form) {
            // console.log("form", form);
            $scope.submitted = true;
            if ($scope.value_type == 'image' && !$scope.f) {
                $scope.imageValidate = "Please select an image file";
            }
            if ($scope.value_type == 'image' && !$scope.value) {
                isValid = true;
            }
            if ($scope.imageValidate) {
                isValid = false;
            }
            if (!isValid) {
                Notice.setNotice("Please check your fields and try again!", 'ERROR', true);
                return;
            }
            var saveSetting = function(setting) {
                setting.$save(function(response) {
                    // ActionLogs.create({
                    //     type: 'create',
                    //     model: 'setting',
                    //     target: {
                    //         target_id: response._id
                    //     },
                    // });
                    Notice.setNotice("Create setting success!", 'SUCCESS');
                    if (gotoList) {
                        $location.path(`settings`);
                    } else {
                        $location.path(`settings/${response._id}/edit`);
                    }
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };
            // Create new Setting object
            var setting = new Settings({
                key: this.key,
                value_type: this.value_type,
                description: this.description,
                status: this.status
            });
            var file = $scope.f;
            if (file && this.value_type == 'image') {
                file.upload = Upload.upload({
                    url: $scope.uploadApi + "/api/upload/image",
                    data: {
                        file: file,
                        type: 'settings'
                    }
                });
                file.upload.then(function(response) {
                    $timeout(function() {
                        file.result = response.data;
                        console.log("Success:", response);
                        setting.value = response.data.file.filename;
                        saveSetting(setting);
                    });
                }, function(response) {
                    if (response.status > 0)
                    // $scope.errorMsg = response.status + ': ' + response.data;
                        console.log("Error:", response);
                }, function(evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            } else {
                console.log("Value", this.value, typeof(this.value));
                setting.value = typeof(this.value) == 'object' ? JSON.stringify(this.value) : this.value;

                if (setting.value_type == 'date') {
                    setting.value = tmp['date'];
                }
                console.log("Value", setting.value);
                saveSetting(setting);
            }
        };
        // Remove existing Setting
        $scope.remove = function(settingId) {
            if (confirm("Do you want to remove?")) {

                var setting = Settings.get({
                    settingId: settingId
                });

                setting.$remove({
                    settingId: settingId
                }, function() {
                    // ActionLogs.create({
                    //     type: 'delete',
                    //     model: 'setting',
                    //     target: {
                    //         target_id: settingId,
                    //         target_title: setting.key || setting._id
                    //     },
                    // });
                });

                for (var i in $scope.settings) {
                    if ($scope.settings[i]._id === settingId) {
                        $scope.settings.splice(i, 1);
                    }
                }

                Notice.setNotice("Delete setting success!", 'SUCCESS');

                if ($stateParams.settingId) {
                    $scope.gotoList();
                } else {
                    Notice.requireChange();
                }
            }
        };

        // Update existing Setting
        $scope.update = function(isValid, gotoList) {
            $scope.submitted = true;
            if ($scope.imageValidate) {
                isValid = false;
            }
            if (!isValid) {
                Notice.setNotice("Please check your fields and try again!", 'ERROR', true);
                return;
            }

            var updateSetting = function(setting) {
                setting.$update({
                    settingId: setting._id
                }, function(resp) {
                    if (resp._id) {
                        // ActionLogs.create({
                        //     type: 'update',
                        //     model: 'setting',
                        //     target: {
                        //         target_id: resp._id
                        //     },
                        // });
                        Notice.setNotice('Update setting success!', 'SUCCESS');
                        if (gotoList) {
                            $scope.gotoList();
                        } else {
                            Notice.requireChange();
                            $scope.submitted = false;
                            $scope.setting = parseSetting(resp);
                        }
                    } else {
                        Notice.setNotice(resp.message, 'ERROR', true);
                    }

                }, function(errorResponse) {
                    console.log('===', errorResponse);
                    Notice.setNotice(errorResponse.data.message, 'ERROR', true);
                });
            };

            var setting = $scope.setting;
            delete setting.__v;
            delete setting.created;
            var file = $scope.f;
            if (file && $scope.setting.value_type == 'image') {
                file.upload = Upload.upload({
                    url: $scope.uploadApi + "/api/upload/image",
                    data: {
                        file: file,
                        type: 'settings',
                        filename: $scope.setting.value,
                        old_filename: $scope.setting.value
                    }
                });
                file.upload.then(function(response) {
                    $timeout(function() {
                        file.result = response.data;
                        console.log("Success:", response);
                        setting.value = response.data.file.filename;
                        updateSetting(setting);
                    });
                }, function(response) {
                    if (response.status > 0)
                    // $scope.errorMsg = response.status + ': ' + response.data;
                        console.log("Error:", response);
                }, function(evt) {
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            } else {
                setting.value = typeof(setting.value) == 'object' ? JSON.stringify(setting.value) : setting.value;
                if (setting.value_type == 'date') {
                    setting.value = tmp['date'];
                }
                updateSetting(setting);
            }
        }

        // Find a list of Settings
        $scope.currentPage = 1;
        $scope.search = {};

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function(page) {
            $scope.currentPage = page;
            getListData();
        };

        function getListData() {
            $scope.isLoading = true;
            $timeout(function() {
                $scope.isLoading = false;
            }, 500);
            var options = {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
            };
            // localStorageService.set('setting.filterData', {
            //     currentPage: $scope.currentPage,
            //     search: $scope.search
            // });
            $scope.categories = Categories.query(function(resp) {
                Settings.query(options, function(data) {
                    $scope.settings = data.items;
                    $scope.deny = data.deny;
                    $scope.totalItems = data.totalItems;
                    $scope.category = [];
                    $scope.itemsPerPage = data.itemsPerPage;
                    $scope.numberVisiblePages = data.numberVisiblePages;
                    $scope.totalPage = data.totalPage || 1;
                });
            });
        }

        // Find a list of Posts
        $scope.find = function() {
            // if (!$.isEmptyObject($location.search())) {
            //     var filterData = $location.search();
            //     $scope.currentPage = Number(filterData.currentPage) || 1;
            //     $scope.search.keyword = filterData.keyword;
            // } else {
            //     var filterData = localStorageService.get('setting.filterData');
            //     if (filterData) {
            //         // console.log("filter by local store", filterData);
            //         $scope.currentPage = filterData.currentPage;
            //         $scope.search = filterData.search;
            //     }
            // }
            // ActionLogs.create({
            //     type: 'list',
            //     model: 'setting',
            // });
            getListData();
        };
        //search
        $scope.filter = function() {
            $scope.currentPage = 1;
            getListData();
        };
        //reset
        $scope.reset = function() {
            $scope.search = {};
            $scope.currentPage = 1;
            getListData();
        };

        // Find existing Setting
        $scope.findOne = function() {
            $scope.setting = Settings.get({
                settingId: $stateParams.settingId
            }, function(data) {
                // if ($scope.setting.image) {
                //     $scope.review_image = $scope.webUrl + $scope.setting.image;
                // }
                $scope.setting = parseSetting($scope.setting);
                tmp[$scope.setting.value_type] = $scope.setting.value;
                // ActionLogs.create({
                //     type: 'view',
                //     model: 'setting',
                //     target: {
                //         target_id: $stateParams.settingId
                //     },
                // });
            });
        };

        var tmp = {
            string: '',
            boolean: true,
            json: {
                "key": "value"
            },
            number: 0,
            date: new Date()
        };

        $scope.changeValueType = function(value_type, edit_mode) {
            if (value_type == 'number') {
                $scope.input_value_type = 'number';
            } else {
                $scope.input_value_type = 'text';
            }
            var edit_mode = typeof(edit_mode) != 'undefined' ? edit_mode : false;
            var value = edit_mode ? $scope.setting.value : $scope.value;
            value = tmp[value_type];
            if (edit_mode) {
                $scope.setting.value = value;
            } else {
                $scope.value = value;
            }
        };

        $scope.changeValue = function(value_type, value) {
            // console.log(value_type, value);
            // if (value) {

            if (value_type == 'date') {
                tmp[value_type] = new Date(value).getTime().toString();
            } else {
                tmp[value_type] = value;
            }
            // }
            // console.log("Tmp: ", tmp);
        };

        $scope.isOpen = {
            start_date: false
        };

        // Open Calendar
        $scope.openCalendar = function() {
            $scope.isOpen.start_date = true;
        }

        function parseSetting(input) {
            // console.log("Value", input);
            switch (input.value_type) {
                case 'boolean':
                    if (input.value == 'false') {
                        input.value = false;
                    } else {
                        input.value = true;
                    }
                    break;
                case 'json':
                    try {
                        input.value = JSON.parse(input.value);
                    } catch (e) {}
                    break;
                case 'date':
                    input.value = new Date(parseInt(input.value));
                    break;
                case 'number':
                    input.value = Number(input.value.toString());
                    break;
            }
            return input;
        }

        $scope.getCommonApi = function(api_name, disabledVar, seconds) {
            function parse(input) {
                console.log(input);
                try {
                    var output = JSON.parse(input);
                    return JSON.stringify(output);
                } catch (e) {
                    return input;
                }
            }
            // console.log("ádsasaddsasasad");
            $http.get($window.settings.services.userApi + '/api/schedule/' + api_name + '/123456').then(function(response) {
                if (response.status == 200) {
                    response = response.data
                    Notice.setNotice(parse(response), 'INFO', true);
                    $scope.enabledRestart(disabledVar, seconds);
                }
            }).catch(function(response) {
                Notice.setNotice(parse(response), 'INFO', true);
                $scope.enabledRestart(disabledVar, seconds);
            });
        }

        $scope.controlPanels = [{
            name: "Restart schedule",
            disabledVar: 'restartDisabled',
            description: "Khởi động lại danh sách công việc trong schedule, ví dụ sau khi cập nhật 'sms_remind_time'",
            action: 'getCommonApi',
            variable: ['restartSchedule', 'restartDisabled', 5]
        }, {
            name: "Check GHN order info",
            disabledVar: 'runGHNDisabled',
            description: "Kiểm tra lập tức các đơn hàng đang được vận chuyển bằng GHN và xử lý chúng",
            action: 'getCommonApi',
            variable: ['ghnOrderInfo', 'runGHNDisabled', 3]
        }, {
            name: "Run sms remind",
            disabledVar: 'smsReminder',
            description: "Khởi động lập tức chức năng sms reminder",
            action: 'getCommonApi',
            variable: ['smsReminder', 'smsReminder', 3]
        }, {
            name: "Run check & unban",
            disabledVar: 'checkUnban',
            description: "Khởi động lập tức chức năng kiểm tra và dỡ lệnh cấm user",
            action: 'getCommonApi',
            variable: ['checkUnban', 'checkUnban', 3]
        }];

        $scope.runControlAction = function(name, action, variable) {
            $scope[action](...variable);
            // ActionLogs.create({
            //     type: 'orther',
            //     model: 'setting',
            //     message: 'run setting control panel action ' + name,
            // });
        };

        $scope.uploadFiles = function(file, errFiles) {
            $scope.imageValidate = "";
            if (errFiles.length > 0) {
                $scope.imageValidate = "Vui lòng chọn tệp tin ảnh và kích thước không quá 10MB.";
            } else if (file) {
                var width = file.$ngfWidth,
                    height = file.$ngfHeight;
                if (width > 250) {
                    var ratio = width / 250;
                    var optionsThumb = {
                        width: 250,
                        height: ratio * height
                    };
                    Upload.resize(file, optionsThumb).then(function(resizedFile) {
                        $scope.f = resizedFile;
                    });
                } else {
                    $scope.f = file;
                }
                $scope.errFile = errFiles && errFiles[0];
            }
        };

        $scope.cancelUpload = function(status) {
            $scope.f = null;
            $scope.errFile = null;
        };

        $scope.renderSettingImage = function(setting) {
            return $window.settings.services.webUrl + '/files/settings/' + setting.value;
        };
    }
]);