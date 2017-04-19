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
var ChapterSchema = new Schema({
    name: {
        type: 'String',
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
    user_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: Number,
        default: 1
    },
    subject_id: {
        type: Schema.ObjectId,
        ref: 'Subject'
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date
    }
});
ChapterSchema.index({ slug: 1 });

ChapterSchema.pre('update', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
ChapterSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
module.exports = mongoose.model('Chapter', ChapterSchema);
