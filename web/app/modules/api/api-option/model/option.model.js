'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Option Schema
 */
var OptionSchema = new Schema({
    name: {
        type: String,
        trim: true,
        index: true,
        required: true
    },
    slug: {
        type: String,
        default: '',
        trim: true
    },
    name_match: {
        type: String,
        default: '',
        trim: true
    },
    is_correct: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    question_id: {
        type: Schema.ObjectId,
        ref: 'Question'
    },
    user_id: {
        type: Schema.ObjectId,
        ref: 'User'
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
    }
});
OptionSchema.index({ slug: 1 });

OptionSchema.pre('update', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
OptionSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
module.exports = mongoose.model('Option', OptionSchema);
