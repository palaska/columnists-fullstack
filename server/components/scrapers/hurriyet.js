var request    = require('request'),
	cheerio    = require('cheerio');

request('http://www.gazeteoku.com/tum-yazarlar.html', function (err, res, body) {
				if (!err && res.statusCode == 200) {
					var $ = cheerio.load(body);
					var list = $('div.yazarlist').find('li');