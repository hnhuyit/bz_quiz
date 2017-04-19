'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Group Schema
 */
var GroupSchema = new Schema({
    name: {
        type: 'String',
        trim: true,
        index: true,
        required: true
    },
    slug: {
        type: 'String',
        trim: true,
    },
    status: {
        type: 'Number',
        default: 1
    },
    valid_for_days: {
        type: 'Number',
        default: 0
    },
    price: {
        type: 'Number',
        default: 0
    },
    description: {
        type: 'String',
        textarea: 1
    },
    created: {
        type: 'Date'
    },
    modified: {
        type: 'Date'
    }
});


GroupSchema.index({ slug: 1 });


GroupSchema.pre('update', function(next) {
    
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    
    this.modified = Date.now();
    next();
});
GroupSchema.pre('save', function(next) {
    
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

module.exports = mongoose.model('Group', GroupSchema);
