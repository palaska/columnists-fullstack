'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  link: String,
  newspaper: String
});

module.exports = mongoose.model('Article', ArticleSchema);