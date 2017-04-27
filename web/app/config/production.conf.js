'use strict';

let config = {};

config.web = {
    assets: {
        js: [
            'public/assets/dist/site/scripts/main.js',
            'public/assets/dist/site/scripts/vendor.js',
        ],
        css: [
            'public/assets/dist/site/styles/main.css',
            'public/assets/dist/site/styles/vendor.css',
        ]
    },
    adminassets: {
        js: [
            'public/assets/dist/admin/scripts/main.js',
            'public/assets/dist/admin/scripts/vendor.js',
        ],
        css: [
            'public/assets/dist/admin/styles/main.css',
            'public/assets/dist/admin/styles/vendor.css',
        ]
    }
};

module.exports = config;