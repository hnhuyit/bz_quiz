'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageModel = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  channel: { type: String, default: 'global'},
});

module.exports = mongoose.model('Message', messageModel);