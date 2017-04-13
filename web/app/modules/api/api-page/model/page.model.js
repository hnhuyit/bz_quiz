'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Page Schema
 */
var PageSchema = new Schema({
    title: {
        type: String,
        default: '',
        required: 'Please fill title',
        trim: true
    },
    slug: {
        type: String,
        default: '',
        trim: true
    },
    content: {
        type: String,
        default: '',
        required: 'Please fill content',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

PageSchema.index({ slug: 1 });


PageSchema.pre('update', function(next) {
    if (!this.slug) {
        this.slug = slug(this.title);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
PageSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slug(this.title);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});

module.exports = mongoose.model('Page', PageSchema);
