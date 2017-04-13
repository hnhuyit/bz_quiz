'use strict';


exports.viewLogin = {
    auth: false,
    handler: function(request, reply) {
        var configManager = request.server.configManager;
        var cmsprefix = configManager.get('web.context.cmsprefix');
        
        if (request.auth.isAuthenticated) {
            return reply.redirect(cmsprefix);
        };
        return reply.view('admin/html/admin-auth/signin');
    },
}