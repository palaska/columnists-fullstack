'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WriterSchema = new Schema({
  name: String,
  articles: [String],
  lastarticle: String,
  lastarticlesnewspaper: String,
  lastarticleslink: String,
  lastarticlesdate: String
});

module.exports = mongoose.model('Writer', WriterSchema);