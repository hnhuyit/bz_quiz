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
        required: [
            'jquery',
            'tether',
            'bootstrap',
            'angular',
            'angular-cookies',
            'socket.io-client',
            'bootstrap/dist/css/bootstrap.css'
        ],
        include: {
            css: [
                'adminassets/admin-lte/bootstrap/css/bootstrap.min.css',
                'adminassets/font-awesome/css/font-awesome.min.css',
                'adminassets/ionicons/dist/css/ionicons.min.css',
                'adminassets/admin-lte/dist/css/AdminLTE.min.css',
                'adminassets/admin-lte/plugins/iCheck/flat/blue.css',
                'adminassets/admin-lte/plugins/morris/morris.css',
                'adminassets/admin-lte/plugins/jvectormap/jquery-jvectormap-1.2.2.css',
                'adminassets/admin-lte/plugins/datepicker/datepicker3.css',
                'adminassets/admin-lte/plugins/iCheck/all.css',
                'adminassets/admin-lte/plugins/daterangepicker/daterangepicker.css',
                'adminassets/admin-lte/plugins/timepicker/bootstrap-timepicker.min.css',
                'adminassets/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css',
                'adminassets/admin-lte/plugins/datatables/dataTables.bootstrap.css',
                'adminassets/admin-lte/dist/css/skins/skin-blue.min.css',
                'adminassets/admin-lte/plugins/select2/select2.min.css',
                'adminassets/admin-lte/dist/css/AdminLTE.min.css',
                'adminassets/admin-lte/dist/css/skins/_all-skins.min.css',
                'adminassets/angular-toastr/dist/angular-toastr.min.css',
                'app/templates/web/html/web-*/client/css/*.scss',
            ],
            js: [
                'adminassets/ckeditor/ckeditor.js',
                'adminassets/jquery/dist/jquery.min.js',
                'adminassets/jquery-ui/ui/widget.js',
                'adminassets/tether/dist/js/tether.js',
                'adminassets/bootstrap/dist/js/bootstrap.min.js',
                'adminassets/admin-lte/bootstrap/js/bootstrap.min.js',
                'adminassets/admin-lte/plugins/select2/select2.full.min.js',
                'adminassets/admin-lte/plugins/input-mask/jquery.inputmask.js',
                'adminassets/admin-lte/plugins/input-mask/jquery.inputmask.date.extensions.js',
                'adminassets/admin-lte/plugins/input-mask/jquery.inputmask.extensions.js',
                'adminassets/admin-lte/plugins/sparkline/jquery.sparkline.min.js',
                'adminassets/admin-lte/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',
                'adminassets/admin-lte/plugins/jvectormap/jquery-jvectormap-world-mill-en.js',
                'adminassets/admin-lte/plugins/knob/jquery.knob.js',
                'adminassets/moment/moment.js',
                'adminassets/admin-lte/plugins/daterangepicker/daterangepicker.js',
                'adminassets/admin-lte/plugins/datepicker/bootstrap-datepicker.js',
                'adminassets/admin-lte/plugins/timepicker/bootstrap-timepicker.min.js',
                'adminassets/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js',
                'adminassets/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js',
                'adminassets/admin-lte/plugins/iCheck/icheck.min.js',
                'adminassets/admin-lte/plugins/fastclick/fastclick.js',
                'adminassets/admin-lte/dist/js/app.min.js',
                'adminassets/admin-lte/dist/js/demo.js',
                'adminassets/socket.io-client/dist/socket.io.min.js',
                'adminassets/angular/angular.js',
                'adminassets/angular-cookies/angular-cookies.min.js',
                'adminassets/angular-resource/angular-resource.js',
                'adminassets/angular-animate/angular-animate.js',
                'adminassets/angular-ui-router/release/angular-ui-router.js',
                'adminassets/angular-bootstrap/ui-bootstrap-tpls.js',
                'adminassets/angular-file-upload/dist/angular-file-upload.min.js',
                'adminassets/angular-sanitize/angular-sanitize.min.js',
                'adminassets/angular-toastr/dist/angular-toastr.tpls.min.js',
                'adminassets/ui-select/dist/select.js',
                'adminassets/tinymce/tinymce.min.js',
                'adminassets/angular-ui-tinymce/dist/tinymce.min.js',
                'adminassets/angular-messages/angular-messages.min.js',
                'adminassets/angular-input-masks/releases/angular-input-masks-standalone.min.js',
                'adminassets/angular-local-storage/dist/angular-local-storage.js',
                'adminassets/bootstrap-ui-datetime-picker/dist/datetime-picker.min.js',
                'adminassets/jsoneditor/dist/jsoneditor.min.js',
                'adminassets/ng-jsoneditor/ng-jsoneditor.js',
                'adminassets/angular-file-upload-shim/dist/angular-file-upload-shim.min.js',
                'adminassets/ng-file-upload/dist/ng-file-upload.min.js',
                'app/templates/web/html/web-*/client/js/*.js',
                'app/templates/web/html/web-core/client/js/config.js',
                'app/templates/web/html/web-core/client/js/service.js',
                'app/templates/web/html/web-core/client/js/directive.js',
                'app/templates/web/html/web-core/client/js/factory.js',
            ]
        }
    },
    adminassets: {
        css: [
            'adminassets/admin-lte/bootstrap/css/bootstrap.min.css',
            'adminassets/font-awesome/css/font-awesome.min.css',
            'adminassets/ionicons/dist/css/ionicons.min.css',
            'adminassets/admin-lte/dist/css/AdminLTE.min.css',
            'adminassets/admin-lte/dist/css/skins/_all-skins.min.css',
            'adminassets/admin-lte/plugins/iCheck/flat/blue.css',
            'adminassets/admin-lte/plugins/iCheck/all.css',
            'adminassets/admin-lte/plugins/morris/morris.css',
            'adminassets/admin-lte/plugins/jvectormap/jquery-jvectormap-1.2.2.css',
            'adminassets/admin-lte/plugins/datepicker/datepicker3.css',
            'adminassets/admin-lte/plugins/daterangepicker/daterangepicker.css',
            'adminassets/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css',
            'adminassets/admin-lte/plugins/datatables/dataTables.bootstrap.css',
            'adminassets/admin-lte/dist/css/skins/skin-blue.min.css',
            'adminassets/admin-lte/plugins/select2/select2.min.css',
            'adminassets/admin-lte/dist/css/AdminLTE.min.css',
            'adminassets/jsoneditor/dist/jsoneditor.min.css',
            'app/templates/admin/html/admin-*/client/style/*.css',
        ],
        js: [
            'adminassets/ckeditor/ckeditor.js',
            'adminassets/jquery/dist/jquery.min.js',
            'adminassets/jquery-ui/ui/widget.js',
            'adminassets/tether/dist/js/tether.js',
            'adminassets/bootstrap/dist/js/bootstrap.min.js',
            'adminassets/admin-lte/bootstrap/js/bootstrap.min.js',
            'adminassets/admin-lte/plugins/sparkline/jquery.sparkline.min.js',
            'adminassets/admin-lte/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js',
            'adminassets/admin-lte/plugins/jvectormap/jquery-jvectormap-world-mill-en.js',
            'adminassets/admin-lte/plugins/knob/jquery.knob.js',
            'adminassets/moment/moment.js',
            'adminassets/admin-lte/plugins/daterangepicker/daterangepicker.js',
            'adminassets/admin-lte/plugins/datepicker/bootstrap-datepicker.js',
            'adminassets/admin-lte/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js',
            'adminassets/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js',
            'adminassets/admin-lte/plugins/iCheck/icheck.min.js',
            'adminassets/admin-lte/plugins/fastclick/fastclick.js',
            'adminassets/admin-lte/dist/js/app.min.js',
            'adminassets/admin-lte/dist/js/demo.js',
            'adminassets/admin-lte/plugins/select2/select2.min.js',
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
};

module.exports = config;