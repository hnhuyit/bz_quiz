exports.home = {
    handler: function (request, reply) {
        reply.view('web/html/web-home/index', {
            title: 'BZ CMS | Hapi ' + request.server.version,
            message: 'Welcome to BZ CMS'
        });
    },
}