'use strict';

var schedule = require('node-schedule');

var Writer = require('../api/writer/writer.model'),
	Article = require('../api/article/article.model');

var request    = require('request'),
	cheerio    = require('cheerio');

// Update DB with new Writers/Articles

var rule = new schedule.RecurrenceRule();
rule.minute = [0,5,10,15,20,25,30,35,40,45,50,55];

var j = schedule.scheduleJob(rule, function(){
    Writer.find({}).lean().exec(function (err, dbwriters) {
		Article.find({}).lean().exec(function(err, dbarticles){
			console.log("CHECKING DB UPDATES!..");
			request('http://www.gazeteoku.com/tum-yazarlar.html', function (err, res, body) {
				if (!err && res.statusCode == 200) {
					var $ = cheerio.load(body);
					var list = $('div.yazarlist').find('li');
					list.each(function (){
						var writer = this.children[2].next.children[2].next.children[0].data;
						writer = writer.substr(33, writer.length - 62);
						var articlelink = 'www.gazeteoku.com' + this.children[7].attribs.href;
						var newspaper = this.children[3].children[5].children[0].data;
						var articletitle = this.children[7].attribs.title;	

						var currentArticle = {"title":articletitle,
											  "link":articlelink,
											  "newspaper":newspaper};

						var currentWriter = {"name":writer,
											 "active":true,
											 "articles":[],
											 "lastarticle":articletitle,
											 "lastarticlesnewspaper":newspaper,
											 "lastarticleslink":articlelink
											};

						var includesWriter = false;
						var includesArticle = false;

						for(var i=0;i<dbwriters.length;i++){
							if(dbwriters[i].name == writer){
								includesWriter = true;
							}
						}

						if(!includesWriter){
							console.log("!!!DEBUG: Creating new Writer and Article!");
							Writer.create(currentWriter, function(err, wri){
								Article.create(currentArticle,function(err, art){
									wri.articles.unshift(art._id);
									wri.save();
								});
							});
						} else {
						
							for(var i=0;i<dbarticles.length;i++){
								if(dbarticles[i].title == articletitle){
									includesArticle = true;
								}
							}

							if(!includesArticle){
								console.log("!!!DEBUG: Creating new Article!");
								Article.create(currentArticle, function(err, art){
									if(err) { return handleError(res, err); }
									Writer.findOne({name:writer}, function(err, wri){
										wri.articles.unshift(art._id);
										wri.lastarticle = art.title;
										wri.lastarticlesnewspaper = art.newspaper;
										wri.lastarticleslink = art.link;
										wri.save();
									});
								});
							}
						}

					});
				}
			});
		});
	});
});
