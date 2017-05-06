'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * <%= modelName %> Schema
 */
var <%= modelName %>Schema = new Schema(<%= mongooseSchema %>);

<% if(slug){ %>
<%= modelName %>Schema.index({ slug: 1 });
<% } %>

<%= modelName %>Schema.pre('update', function(next) {
    <% if(slug){ %>
    if (!this.slug) {
        this.slug = slug(this.<%= slug %>);
    }
    this.slug = this.slug.toLowerCase();
    <% } %>
    this.modified = Date.now();
    next();
});
<%= modelName %>Schema.pre('save', function(next) {
    <% if(slug){ %>
    if (!this.slug) {
        this.slug = slug(this.<%= slug %>);
    }
    this.slug = this.slug.toLowerCase();
    <% } %>
    if(this.isNew){ 
        this.created = Date.now();
    }
    this.modified = Date.now();
    next();
});

module.exports = mongoose.model('<%= modelName %>', <%= modelName %>Schema);
