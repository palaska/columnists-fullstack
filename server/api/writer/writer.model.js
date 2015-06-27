'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WriterSchema = new Schema({
  name: String,
  active: Boolean,
  articles: [String],
  lastarticle: String,
  lastarticlesnewspaper: String,
  lastarticleslink: String
});

module.exports = mongoose.model('Writer', WriterSchema);