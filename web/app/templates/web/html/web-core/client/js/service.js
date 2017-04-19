angular.module('Core')
    .service("Socket", Socket)
    .service("PubSub", PubSub)
    .service("Menus", Menus);

//Menu service used for managing  menus
function Menus() {
    // Define a set of default roles
    this.defaultRoles = ['*'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision 
    var shouldRender = function(user) {
        if (user) {
            if (!!~this.roles.indexOf('*')) {
                return true;
            } else {
                for (var userRoleIndex in user.roles) {
                    for (var roleIndex in this.roles) {
                        if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                            return true;
                        }
                    }
                }
            }
        } else {
            return this.isPublic;
        }

        return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function(menuId) {
        if (menuId && menuId.length) {
            if (this.menus[menuId]) {
                return true;
            } else {
                throw new Error('Menu does not exists');
            }
        } else {
            throw new Error('MenuId was not provided');
        }

        return false;
    };

    // Get the menu object by menu id
    this.getMenu = function(menuId) {
        // Validate that the menu exists
        this.validateMenuExistance(menuId);

        // Return the menu object
        return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function(menuId, isPublic, roles) {
        // Create the new menu
        this.menus[menuId] = {
            isPublic: isPublic || false,
            roles: roles || this.defaultRoles,
            items: [],
            shouldRender: shouldRender
        };

        // Return the menu object
        return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function(menuId) {
        // Validate that the menu exists
        this.validateMenuExistance(menuId);

        // Return the menu object
        delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
        // Validate that the menu exists
        this.validateMenuExistance(menuId);

        // Push new menu item
        this.menus[menuId].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            menuItemType: menuItemType || 'item',
            menuItemClass: menuItemType,
            uiRoute: menuItemUIRoute || ('/' + menuItemURL),
            isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
            roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
            position: position || 0,
            items: [],
            shouldRender: shouldRender
        });

        // Return the menu object
        return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
        // Validate that the menu exists
        this.validateMenuExistance(menuId);

        // Search for menu item
        for (var itemIndex in this.menus[menuId].items) {
            if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
                // Push new submenu item
                this.menus[menuId].items[itemIndex].items.push({
                    title: menuItemTitle,
                    link: menuItemURL,
                    uiRoute: menuItemUIRoute || ('/' + menuItemURL),
                    isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
                    roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
                    position: position || 0,
                    shouldRender: shouldRender
                });
            }
        }

        // Return the menu object
        return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function(menuId, menuItemURL) {
        // Validate that the menu exists
        this.validateMenuExistance(menuId);

        // Search for menu item to remove
        for (var itemIndex in this.menus[menuId].items) {
            if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                this.menus[menuId].items.splice(itemIndex, 1);
            }
        }

        // Return the menu object
        return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function(menuId, submenuItemURL) {
        // Validate that the menu exists
        this.validateMenuExistance(menuId);

        // Search for menu item to remove
        for (var itemIndex in this.menus[menuId].items) {
            for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                    this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                }
            }
        }

        // Return the menu object
        return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar');
}

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
            names = names.filter(function (item) { //remove empty element
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

    }
}