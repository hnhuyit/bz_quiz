'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Category Schema
 */
var CategorySchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Category name',
        trim: true
    },
    slug: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
    },
    ordering: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    taxanomy: {
        type: Schema.ObjectId,
        ref: 'Taxanomy'
    },
    type: {
        type: String,
        enum: ['product', 'post', 'banner']
    },
    status: {
        type: Number,
        default: 1
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
    },
    attrs: {
        title: String,
        description: String,
        keyword: String
    }
});

CategorySchema.index({ slug: 1 });

CategorySchema.pre('update', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
CategorySchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
module.exports = mongoose.model('Category', CategorySchema);
