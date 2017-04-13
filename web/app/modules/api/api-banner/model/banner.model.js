'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Banner Schema
 */
var BannerSchema = new Schema({
    title: {
        type: String,
        default: '',
        required: 'Please fill banner title',
        trim: true
    },
    subtitle: {
        type: String,
        default: '',
        trim: true
    },
    link: {
        type: String,
        default: '',
        trim: true
    },
    image: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: Number,
        default: 1
    },
    category: [{
        type: Schema.ObjectId,
        ref: 'Category'
    }],
    position: {
        type: String,
        default: 'right',
        trim: true,
        enum: ['home', 'right']
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Banner', BannerSchema);
