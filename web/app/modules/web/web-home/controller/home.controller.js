exports.home = {
    handler: function (request, reply) {
    	console.log('request', request.auth.credentials)
        if (request.auth.credentials !== null) {
	        return reply.view('web/html/web-home/index');
        };

        reply.view('web/html/web-home/home', {
            title: 'BZ CMS | Hapi ' + request.server.version,
            message: 'Welcome to BZ CMS'
        });
    },
}