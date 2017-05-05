'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Result Schema
 */
var ResultSchema = new Schema({
	quiz_id: {
		type: Schema.ObjectId,
		ref: 'Quiz'
	},
	user_id: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	result_status: {
		type: 'String',
		default: ''
	},
	start: {
		type: 'Date'
	},
	end: {
		type: 'Date'
	},
	score_obtained: {
		type: 'Number',
		default: 0
	},
	percentage_obtained: {
		type: 'Number',
		default: 0
	},
	total_time: {
		type: 'Number',
		default: 0
	},
	created: {
		type: 'Date'
	},
	modified: {
		type: 'Date'
	}
});



ResultSchema.pre('update', function(next) {
    
    this.modified = Date.now();
    next();
});
ResultSchema.pre('save', function(next) {
    
    if(this.isNew){ 
        this.created = Date.now();
    }
    this.modified = Date.now();
    next();
});

module.exports = mongoose.model('Result', ResultSchema);
