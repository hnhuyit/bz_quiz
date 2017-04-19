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
var QuizQuestionSchema = new Schema({
    user_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    quiz_id: {
        type: Schema.ObjectId,
        ref: 'Quiz'
    },
    question_id: {
        type: Schema.ObjectId,
        ref: 'Question'
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


QuizQuestionSchema.index({ slug: 1 });


QuizQuestionSchema.pre('update', function(next) {
    
    this.modified = Date.now();
    next();
});
QuizQuestionSchema.pre('save', function(next) {
    
    if(this.isNew){ 
        this.created = Date.now();
    }
    this.modified = Date.now();
    next();
});

module.exports = mongoose.model('QuizQuestion', QuizQuestionSchema);
