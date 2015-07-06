/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /forms              ->  index
 * POST    /forms              ->  create
 * GET     /forms/:id          ->  show
 * PUT     /forms/:id          ->  update
 * DELETE  /forms/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Form = require('./form.model');

// Get list of forms
exports.index = function(req, res) {
  Form.find(function (err, forms) {
    if(err) { return handleError(res, err); }
    return res.json(200, forms);
  });
};

// Get a single Form
exports.show = function(req, res) {
  Form.findById(req.params.id, function (err, form) {
    if(err) { return handleError(res, err); }
    if(!form) { return res.send(404); }
    return res.json(form);
  });
};



// Creates a new form in the DB.
exports.create = function(req, res) {
  Form.create(req.body, function(err, form) {
    var nodemailer = require('nodemailer');

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
            user: 'columnistsapp@yahoo.com',
            pass: 'abcd123098'
        }
    });


    if(err) { return handleError(res, err); }
    var writers    = req.body.writers,
        articles   = "";

    function asynclooper(i, wris) {
      var request = require('request'),
          cheerio = require('cheerio');
      if(i < wris.length ) {
        var newspaper = wris[i].lastarticlesnewspaper;
        request('http://' + wris[i].lastarticleslink, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);
            var reallink = $('a.ypDevam')[0].attribs.href;
            request(reallink, function (err, res, body){
              if (!err && res.statusCode == 200) {
                var $$ = cheerio.load(body);
                switch(newspaper) {
                
                  case "Cumhuriyet":
                    var articlehtml = $$('#article-body').html();
                    if(articlehtml){
                      articles = articles + 
                      '<div style="padding:10px;border-color:#8AC007;border-style:solid;border-width:2px;border-radius: 5px;">' +
                      '<h2>'+ wris[i].name + ' - '+'Cumhuriyet'+'</h2>\n' +
                      '<h3>'+ wris[i].lastarticle + '</h3>\n' +
                      articlehtml +
                      '</div>'+
                      '\n<p style="text-align: center;"><span class="large">-- -- --</span></p>\n';
                    }        
                  break;

                  case "Habertürk":
                    var articlehtml = $$('.news-content-text').html();
                    if(articlehtml){
                      articles = articles + 
                      '<div style="padding:10px;border-color:#8AC007;border-style:solid;border-width:2px;border-radius: 5px;">' +
                      '<h2>'+ wris[i].name + ' - '+'Habertürk'+'</h2>\n' +
                      '<h3>'+ wris[i].lastarticle + '</h3>\n' +
                      articlehtml +
                      '</div>'+
                      '\n<p style="text-align: center;"><span class="large">-- -- --</span></p>\n';
                    }
                  break;

                  case "Vatan":
                    var articlehtml = $$('#divAdnetKeyword').html();
                    if(articlehtml){
                      articles = articles + 
                      '<div style="padding:10px;border-color:#8AC007;border-style:solid;border-width:2px;border-radius: 5px;">' +
                      '<h2>'+ wris[i].name + ' - '+'Vatan'+'</h2>\n' +
                      '<h3>'+ wris[i].lastarticle + '</h3>\n' +
                      articlehtml +
                      '</div>'+
                      '\n<p style="text-align: center;"><span class="large">-- -- --</span></p>\n';
                    }
                  break;

                  case "Milliyet":
                    var articlehtml = $$('#divAdnetKeyword3').html();
                    if(articlehtml){
                      articles = articles + 
                      '<div style="padding:10px;border-color:#8AC007;border-style:solid;border-width:2px;border-radius: 5px;">' +
                      '<h2>'+ wris[i].name + ' - '+'Milliyet'+'</h2>\n' +
                      '<h3>'+ wris[i].lastarticle + '</h3>\n' +
                      articlehtml +
                      '</div>'+
                      '\n<p style="text-align: center;"><span class="large">-- -- --</span></p>\n';
                    }
                  break;

                  case "Sözcü":
                    var articlehtml = $$('.content').html();
                    if(articlehtml){
                      articles = articles + 
                      '<div style="padding:10px;border-color:#8AC007;border-style:solid;border-width:2px;border-radius: 5px;">' +
                      '<h2>'+ wris[i].name + ' - '+'Sözcü'+'</h2>\n' +
                      '<h3>'+ wris[i].lastarticle + '</h3>\n' +
                      articlehtml +
                      '</div>'+
                      '\n<p style="text-align: center;"><span class="large">-- -- --</span></p>\n';
                    }
                  break;
                  
									case "Zaman":
                    var articlehtml = $$('span[itemprop="articleBody"]').html();
                    if(articlehtml){
                      articles = articles + 
                      '<div style="padding:10px;border-color:#8AC007;border-style:solid;border-width:2px;border-radius: 5px;">' +
                      '<h2>'+ wris[i].name + ' - '+'Zaman'+'</h2>\n' +
                      '<h3>'+ wris[i].lastarticle + '</h3>\n' +
                      articlehtml +
                      '</div>'+
                      '\n<p style="text-align: center;"><span class="large">-- -- --</span></p>\n';
                    }
                  break;

									/*
									 *case "Akşam":
									 *  var articlehtml = $$('.double-wide').html();
									 *  console.log(articlehtml);
									 *  if(articlehtml){
									 *    articles = articles +
									 *    '<div style="padding:10px;border-color:#8AC007;border-style:solid;border-width:2px;border-radius: 5px;">' +
									 *    '<h2>'+ wris[i].name + ' - '+'Akşam'+'</h2>\n' +
									 *    '<h3>'+ wris[i].lastarticle + '</h3>\n' +
									 *    articlehtml +
									 *    '</div>'+
									 *    '\n<p style="text-align: center;"><span class="large">-- -- --</span></p>\n';
									 *  }
									 *break;
									 */

									/*
									 *case "Star":
                   *  var articlehtml = $$('#detaytext').html();
                   *  if(articlehtml){
                   *    articles = articles + 
                   *    '<div style="padding:10px;border-color:#8AC007;border-style:solid;border-width:2px;border-radius: 5px;">' +
                   *    '<h2>'+ wris[i].name + ' - '+'Star'+'</h2>\n' +
                   *    '<h3>'+ wris[i].lastarticle + '</h3>\n' +
                   *    articlehtml +
                   *    '</div>'+
                   *    '\n<p style="text-align: center;"><span class="large">-- -- --</span></p>\n';
                   *  }
                   *break;
									 */
                }
                asynclooper(i+1,wris);
              }
            });        
          }
      //return res.json(201, form);
        });
      } else {
          var mailOptions = {
          from: '✤ Columnists ✤ <columnistsapp@yahoo.com>', // sender address
          to: req.body.emails, // list of receivers
          subject: 'Köşe Yazıları', // Subject line
          text: '', // plaintext body
          html: articles
        }


				transporter.sendMail(mailOptions, function(error, info){
					if(error){
						console.log(error);
					}else{
						console.log('Message sent: ' + info.response);
						console.log(mailOptions);
					}
				});


      }
    }
    asynclooper(0,writers);

  });
};


// Updates an existing form in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Form.findById(req.params.id, function (err, form) {
    if (err) { return handleError(res, err); }
    if(!form) { return res.send(404); }
    var updated = _.merge(form, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, form);
    });
  });
};

// Deletes a form from the DB.
exports.destroy = function(req, res) {
  Form.findById(req.params.id, function (err, form) {
    if(err) { return handleError(res, err); }
    if(!form) { return res.send(404); }
    form.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
