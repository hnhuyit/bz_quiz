'use strict';

let config = {};

config.web = {
    facebook: {
        clientID: process.env.FACEBOOK_ID || '427079307489462',
        clientSecret: process.env.FACEBOOK_SECRET || 'd78875d70774594c0b93d646c07cb6ab',
        callbackURL: '/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'yXwFK6ff3fOc8dvessqKvd9Z8',
        clientSecret: process.env.TWITTER_SECRET || 'k0w9heOObYwlwchdRBQ6tmHiPQN5O26nwz5XDzxPWPtby6llNx',
        callbackURL: '/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '941481178075-mrmusgvq3asuq1relija3smn7psmogkh.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'sSIpuxYkac8r8LgXtVJ9pM6W',
        callbackURL: '/auth/google/callback'
    },
    assets: {
        js: [
            'public/assets/lib/jquery/dist/jquery.min.js',
            'public/assets/lib/bootstrap/dist/js/bootstrap.min.js',
            'public/assets/lib/angular/angular.min.js',
            'public/assets/lib/angular-cookies/angular-cookies.min.js',
            'public/assets/lib/socket.io-client/socket.io.js',
        ],
        jsbuild: [
            'public/assets/js/bundle.js',
            'public/assets/js/app.js',
        ],
        css: [
            'public/assets/lib/bootstrap/dist/css/bootstrap.min.css'
        ],
        cssbuild: [
            'public/assets/css/bundle.css'
        ]
    },
    adminassets: {
        css: [
            'adminassets/admin-lte/bootstrap/css/bootstrap.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css',
            'adminassets/admin-lte/plugins/datatables/dataTables.bootstrap.css',
            'adminassets/admin-lte/dist/css/skins/skin-blue.min.css',
            'adminassets/admin-lte/plugins/select2/select2.min.css',
            'adminassets/admin-lte/dist/css/AdminLTE.min.css',
            'adminassets/jsoneditor/dist/jsoneditor.min.css',
            'app/templates/admin/html/admin-*/client/style/*.css',
        ],
        js: [
            'https://cloud.tinymce.com/stable/tinymce.min.js',
            'adminassets/jquery/dist/jquery.min.js',
            'adminassets/bootstrap/dist/js/bootstrap.min.js',
            'adminassets/admin-lte/dist/js/app.min.js',
            'adminassets/angular/angular.js',
            'adminassets/angular-resource/angular-resource.js',
            'adminassets/angular-animate/angular-animate.js',
            'adminassets/angular-ui-router/release/angular-ui-router.js',
            'adminassets/angular-bootstrap/ui-bootstrap-tpls.js',
            'adminassets/angular-file-upload/dist/angular-file-upload.min.js',
            'adminassets/angular-sanitize/angular-sanitize.min.js',
            'adminassets/ui-select/dist/select.js',
            'adminassets/tinymce/tinymce.min.js',
            'adminassets/angular-ui-tinymce/dist/tinymce.min.js',
            'adminassets/admin-lte/plugins/select2/select2.min.js',
            'adminassets/angular-messages/angular-messages.min.js',
            'adminassets/angular-input-masks/releases/angular-input-masks-standalone.min.js',
            'adminassets/angular-local-storage/dist/angular-local-storage.js',
            'adminassets/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
            'adminassets/jsoneditor/dist/jsoneditor.min.js',
            'adminassets/ng-jsoneditor/ng-jsoneditor.js',
            'adminassets/angular-file-upload-shim/dist/angular-file-upload-shim.min.js',
            'adminassets/ng-file-upload/dist/ng-file-upload.min.js',
            'app/templates/admin/html/admin-core/client/js/app.js',
            'app/templates/admin/html/admin-core/client/js/config.js',
            'app/templates/admin/html/admin-core/client/js/service.js',
            'app/templates/admin/html/admin-*/client/js/*.js',
        ]
    },
    context: {
        cmsprefix: '/admin',
        app: {
            title: 'Web',
            description: '',
            keywords: ''
        },
        settings: {
            services: {
                userApi: 'http://cmsdemo.bizzon.com.vn/v1',
                contactApi: 'http://cmsdemo.bizzon.com.vn/v1',
                socketApi: 'http://cmsdemo.bizzon.com.vn/v1',
                uploadApi: 'http://cmsdemo.bizzon.com.vn/v1',
                webUrl: 'http://cmsdemo.bizzon.com.vn'
            }

        }
    }
};

module.exports = config;