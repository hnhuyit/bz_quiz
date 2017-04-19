'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Quiz Schema
 */
var QuizSchema = new Schema({
    name: {
        type: 'String',
        trim: true,
        index: true,
        required: true
    },
    slug: {
        type: 'String',
        trim: true
    },
    description: {
        type: 'String',
        editor: 1
    },
    start_date: {
        type: 'Date'
    },
    end_date: {
        type: 'Date'
    },
    duration: {
        type: 'Number',
        default: 0
    },
    maximum_attempts: {
        type: 'Number',
        default: 0
    },
    pass_percentage: {
        type: 'Number',
        default: 0
    },
    user_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    subject_id: {
        type: Schema.ObjectId,
        ref: 'Subject'
    },
    group_id: [{
        type: Schema.ObjectId,
        ref: 'Group'
    }],
    view_answer: {
        type: 'Number',
        default: 1
    },
    with_login: {
        type: 'Number',
        default: 1
    },
    number_of_question: {
        type: 'Number',
    },
    status: {
        type: 'Number',
        default: 1
    },
    created: {
        type: 'Date'
    },
    modified: {
        type: 'Date'
    }
});


QuizSchema.index({ slug: 1 });


QuizSchema.pre('update', function(next) {
    
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    
    this.modified = Date.now();
    next();
});
QuizSchema.pre('save', function(next) {
    
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    
    if(this.isNew){ 
        this.created = Date.now();
    }
    this.modified = Date.now();
    next();
});

module.exports = mongoose.model('Quiz', QuizSchema);
