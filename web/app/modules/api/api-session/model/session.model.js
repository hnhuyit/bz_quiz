'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
    valid: { type: Boolean },
    id: { type: String },
    uid: { type: String },
    name: { type: String },
    scope: [
        {
            type: String
        }
    ],
    exp: {
        type: Number
    }
});

module.exports = mongoose.model('Session', SessionSchema);