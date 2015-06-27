'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FormSchema = new Schema({
	emails: String,
	writers: [String]
});

module.exports = mongoose.model('Form', FormSchema);