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
var QuestionSchema = new Schema({
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
    question_type: {
        type: 'Number',
        required: true
    },
    chapter_id: {
        type: Schema.ObjectId,
        ref: 'Chapter'
    },
    subject_id: {
        type: Schema.ObjectId,
        ref: 'Subject'
    },
    user_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    level: {
        type: 'Number',
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    no_times_corrected: {
        type: 'Number',
        default: 0
    },
    no_times_incorrected: {
        type: 'Number',
        default: 0
    },
    no_times_unattempted: {
        type: 'Number',
        default: 0
    },
    correct_option: {
        type: Schema.ObjectId,
        ref: 'Option'
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date
    }
});
QuestionSchema.index({ slug: 1 });

QuestionSchema.pre('update', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
QuestionSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    this.modified = Date.now();
    next();
});
module.exports = mongoose.model('Question', QuestionSchema);
