webpackJsonp([0],{

/***/ 28:
/***/ (function(module, exports) {

angular.module('Contact', []);

/***/ }),

/***/ 29:
/***/ (function(module, exports) {

angular.module('Contact').controller("ContactController", ContactController);

function ContactController($scope, $filter, ContactService) {
    $scope.submit = function () {
        if ($scope.contactForm.$valid) {
            var data = { name: this.name, email: this.email, message: this.message };
            ContactService.submit(data).success(function (data, status, headers) {
                if (data.status == 1) {
                    $scope.contactSuccess = true;
                } else {
                    $scope.errors = data.messages;
                }
            });
        }
    };
}

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

angular.module('Contact').service("ContactService", ContactService);

function ContactService($http, $window) {
    return {
        submit: function (data) {
            return $http.post($window.settings.services.contactApi + '/api/contact', data);
        }
    };
};

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

var app = angular.module('myapp', ['ngCookies', 'Contact', 'Auth', 'Notify']).config(function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
});
angular.module('Core', []);

/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(io) {angular.module('Core').service("Socket", Socket).service("PubSub", PubSub);

function Socket($http, $cookies, $window) {
    var cookieKey = window.cmsname + '-token';
    var jwt = $cookies.get(cookieKey);

    console.log('Token: ' + jwt);
    if (!jwt || !jwt.length) {
        console.log('There is no token');
    }

    var socket = io($window.settings.services.socketApi);
    socket.on('connect', function () {
        socket.emit('authenticate', { token: jwt }); //send the jwt
        socket.on('authenticated', function () {
            // use the socket as usual
            console.log('User is authenticated');
        });
        socket.on('unauthorized', function (msg) {
            console.log("unauthorized: " + JSON.stringify(msg.data));
            throw new Error(msg.data.type);
        });
    });
    return socket;
}

function PubSub(Socket) {
    var container = [];
    return {
        getChannel: function (options) {

            var collectionName = options.collectionName;
            var action = options.action;
            var modelId = options.modelId;
            var method = options.method;

            var names = [];

            names.push(collectionName, action, modelId, method);
            names = names.filter(function (item) {
                //remove empty element
                return item ? true : false;
            });
            var channel = names.join('/');
            return channel;
        },
        subscribe: function (options, callback) {
            if (options) {
                var channel = this.getChannel(options);
                console.log("subscribe: " + channel);
                Socket.on(channel, callback);
                container.push(channel);
            } else {
                throw 'Options must be an object';
            }
        },
        publish: function (options, data, callback) {
            if (options) {
                var channel = this.getChannel(options);
                console.log("publish: " + channel);
                Socket.emit(channel, data, callback);
            } else {
                throw 'Options must be an object';
            }
        },
        unSubscribe: function (options) {
            var channel = this.getChannel(options);
            var index = container.indexOf(channel);
            container.splice(index, 1);
        },
        unSubscribeAll: function () {
            for (var index = 0; index < container.length; index++) {
                Socket.removeAllListeners(container[index]);
            }
            container = [];
        }

    };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),

/***/ 33:
/***/ (function(module, exports) {

angular.module('Notify', ['Core']);

/***/ }),

/***/ 34:
/***/ (function(module, exports) {

angular.module('Notify').controller("NotifyController", NotifyController);

function NotifyController($scope, $filter, NotifyService, PubSub) {

    $scope.messages = [];

    var findIndexOfMessage = function (message) {
        return $scope.messages.findIndex(function (element, index, array) {
            //console.log('message id :'+ message._id);
            if (element._id == message._id) {
                return true;
            }
            return false;
        });
    };

    var onMessages = function (data) {
        console.log(data);
        $scope.messages = data;
        $scope.$apply();
    };

    var onMessageCreated = function (message) {
        $scope.messages.push(message);
        $scope.action = "Created: " + message.title;
        $scope.$apply();
    };
    var onMessageDeleted = function (message) {
        console.log(message);
        $scope.action = "Deleted: " + message.title;
        var index = findIndexOfMessage(message);
        console.log(index);
        $scope.messages.splice(index, 1);
        $scope.$apply();
    };
    var onMessageUpdated = function (message) {
        console.log(message);
        $scope.action = "Updated: " + message.title;
        var index = findIndexOfMessage(message);
        $scope.messages[index] = message;
        $scope.$apply();
    };
    var onPriceUpdated = function (message) {
        console.log(message);
        $scope.action = "Updated: " + message.title;
        var index = findIndexOfMessage(message);
        $scope.messages[index] = message;
        $scope.$apply();
    };
    var onRoomJoined = function (data) {
        console.log("Join Room: " + data.room);
        $scope.action = "Join Room: " + data.room;
        $scope.$apply();

        //listening message after join room
        //get messages
        var options = { collectionName: 'messages', action: 'all' };
        PubSub.publish(options, onMessages); //emit
        //listening message change by other user
        PubSub.subscribe({ collectionName: 'message', action: 'created' }, onMessageCreated); //on
        PubSub.subscribe({ collectionName: 'message', action: 'deleted' }, onMessageDeleted);
        PubSub.subscribe({ collectionName: 'message', action: 'updated' }, onMessageUpdated);

        PubSub.subscribe({ collectionName: 'product', action: 'priceUpdated' }, onPriceUpdated);
    };
    $scope.totalMessage = 0;

    //join room
    //var rooms = ['notification','product-1'];
    $scope.joinRoom = function () {
        var rooms = $scope.myrooms;
        var options = { collectionName: 'room', action: 'join' };
        PubSub.publish(options, { roomId: rooms }, onRoomJoined);
    };

    $scope.deleteMessage = function () {};
    $scope.updateMessage = function () {};
    $scope.newMessage = function () {};
};

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

angular.module('Notify').service("NotifyService", NotifyService);

function NotifyService(PubSub) {
    return {};
};

/***/ }),

/***/ 36:
/***/ (function(module, exports) {

angular.module('Auth', []);

/***/ }),

/***/ 37:
/***/ (function(module, exports) {

angular.module('Auth').controller('AuthController', AuthController);

function AuthController($scope, $filter, AuthService, $cookies) {

    $scope.register = register;
    $scope.login = login;
    $scope.logout = logout;
    $scope.myaccount = myaccount;
    $scope.updateMyAccount = updateMyAccount;
    $scope.changePassword = changePassword;
    $scope.reset = reset;
    $scope.forgot = forgot;

    function register() {
        if ($scope.registerForm.$valid) {
            var data = {
                name: this.name,
                email: this.email,
                password: this.password,
                cfpassword: this.cfpassword
            };
            AuthService.register(data).then(function (res) {
                $scope.registerSuccess = true;
                window.location.href = '/login';
            }).catch(function (res) {
                $scope.errors = [res.data.message];
            });
        }
    };

    function login() {
        if ($scope.loginForm.$valid) {
            var data = {
                email: this.email,
                password: this.password
            };
            AuthService.login(data).then(function (res) {
                $scope.loginSuccess = true;
                console.log(res.data.token);
                $cookies.put('token', res.data.token);
                window.location.href = '/';
            }).catch(function (res) {
                $scope.errors = [res.data.message];
            });
        }
    };

    function logout() {
        AuthService.logout().then(function (res) {
            $cookies.put('token', '');
            window.location.href = '/';
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function myaccount() {
        AuthService.account().then(function (res) {
            $scope.user = res.data;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function updateMyAccount() {
        var data = {
            email: this.user.email,
            name: this.user.name
        };
        AuthService.updateAccount(data).then(function (res) {
            $scope.updateSuccess = true;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function changePassword() {
        var data = {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmNewPassword: this.confirmNewPassword
        };
        AuthService.changepassword(data).then(function (res) {
            $scope.updateSuccess = true;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function reset() {
        var data = {
            newPassword: this.newPassword,
            confirmNewPassword: this.confirmNewPassword
        };
        var resetPasswordToken = angular.element('#resetPasswordToken').val();
        console.log(resetPasswordToken);
        AuthService.reset(resetPasswordToken, data).then(function (res) {
            $scope.updateSuccess = true;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };

    function forgot() {
        var data = { email: this.email };
        AuthService.forgot(data).then(function (res) {
            $scope.updateSuccess = true;
        }).catch(function (res) {
            $scope.errors = [res.data.message];
        });
    };
}

/***/ }),

/***/ 38:
/***/ (function(module, exports) {

angular.module('Auth').service('AuthService', AuthService);

function AuthService($http, $window) {
    return {
        register: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/register', data);
        },
        login: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/login', data);
        },
        forgot: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/forgot', data);
        },
        account: function () {
            return $http.get($window.settings.services.userApi + '/api/user/account');
        },
        logout: function () {
            return $http.get($window.settings.services.userApi + '/api/user/logout');
        },
        updateAccount: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/updateprofile', data);
        },
        profile: function () {
            return $http.get($window.settings.services.userApi + '/api/user/profile');
        },
        changepassword: function (data) {
            return $http.post($window.settings.services.userApi + '/api/user/changepassword', data);
        },
        reset: function (token, data) {
            return $http.post($window.settings.services.userApi + '/api/user/reset?token=' + token, data);
        }
    };
}

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 42:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 43:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 75:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(41);
__webpack_require__(28);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(42);
__webpack_require__(31);
__webpack_require__(32);
__webpack_require__(43);
__webpack_require__(33);
__webpack_require__(34);
__webpack_require__(35);
__webpack_require__(36);
__webpack_require__(37);
module.exports = __webpack_require__(38);


/***/ })

},[75]);
//# sourceMappingURL=../main.map