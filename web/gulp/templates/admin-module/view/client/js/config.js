'use strict';

ApplicationConfiguration.registerModule('<%= moduleName %>');
angular.module('<%= moduleName %>').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', '<%= humanizedPluralName %>', '<%= routeName %>', 'dropdown', '/<%= routeName %>(/create)?');
        Menus.addSubMenuItem('topbar', '<%= routeName %>', 'List <%= humanizedPluralName %>', '<%= routeName %>');
        Menus.addSubMenuItem('topbar', '<%= routeName %>', 'New <%= humanizedSingularName %>', '<%= routeName %>/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('list<%= modelName %>', {
            url: '/<%= routeName %>',
            templateUrl: '/modules/admin-<%= moduleName %>/list-<%= modelItemName %>.html'
        }).
        state('create<%= modelName %>', {
            url: '/<%= routeName %>/create',
            templateUrl: '/modules/admin-<%= moduleName %>/create-<%= modelItemName %>.html'
        }).
        state('view<%= modelName %>', {
            url: '/<%= routeName %>/:itemId',
            templateUrl: '/modules/admin-<%= moduleName %>/view-<%= modelItemName %>.html'
        }).
        state('edit<%= modelName %>', {
            url: '/<%= routeName %>/:itemId/edit',
            templateUrl: '/modules/admin-<%= moduleName %>/edit-<%= modelItemName %>.html'
        });
    }
]);
