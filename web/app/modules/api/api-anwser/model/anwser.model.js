'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Anwser Schema
 */
var AnwserSchema = new Schema({
	user_id: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	quiz_id: {
		type: Schema.ObjectId,
		ref: 'Quiz'
	},
	question_name: {
		type: Schema.ObjectId,
		ref: 'Question'
	},
	option_name: {
		type: Schema.ObjectId,
		ref: 'Option'
	},
	option_score: {
		type: 'Number',
		default: 0
	},
	// user_answer: [{
	// 	question_id: {
	// 		type: Schema.ObjectId,
	// 		ref: 'Question'
	// 	},
	// 	q_option: {
	// 		type: 'String',
	// 		default: ""
	// 	},
	// 	q_score: {
	// 		type: 'Number',
	// 		default: 0
	// 	},
	// }],
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



AnwserSchema.pre('update', function(next) {
    
    this.modified = Date.now();
    next();
});
AnwserSchema.pre('save', function(next) {
    
    if(this.isNew){ 
        this.created = Date.now();
    }
    this.modified = Date.now();
    next();
});

module.exports = mongoose.model('Anwser', AnwserSchema);
