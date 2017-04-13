exports.contact = {
    handler: function(request, reply) {
        let meta = {
            title: 'Contact us',
            description: ''
        };        
        reply.view('web/html/web-contact/index', meta);
    },
}
