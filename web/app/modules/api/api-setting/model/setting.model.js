'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    key: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    value: {
        type: String,
    },
    value_type: {
        type: String,
        default: 'string'
    },
    description: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('Setting', settingSchema);