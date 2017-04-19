'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
    name: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    slug: {
        type: String,
        trim: true
    },
    desc: {
        type: String,
        default: '',
        trim: true
    },
    user_id: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
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
    }
});
SubjectSchema.index({ slug: 1 });

SubjectSchema.pre('update', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
SubjectSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
module.exports = mongoose.model('Subject', SubjectSchema);
