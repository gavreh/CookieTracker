'use strict';
var request = require('request');

exports.init = function(req, res) {
	res.render('newOrder/index');
};

exports.newOrderPost = function(req, res) {
	console.log("newOrderPost:", req.body);
	var workflow = req.app.utility.workflow(req, res);

	workflow.on('validate', function() {
		if (!req.body.name) {
			workflow.outcome.errfor.name = 'required';
		}

		if (!req.body.phone) {
			workflow.outcome.errfor.email = 'required';
		}

		if (!req.body.address) {
			workflow.outcome.errfor.message = 'required';
		}

		if (workflow.hasErrors()) {
			return workflow.emit('response');
		}

		workflow.emit('saveOrder');
	});

	workflow.on('saveOrder', function() {
		var agsRequest = {
			"attributes": {}
		};
		if (req.body.name) {
			agsRequest.attributes.NAME = req.body.name;
		}
		if (req.body.address) {
			agsRequest.attributes.ADDRESS = req.body.address;
		}
		if (req.body.email) {
			agsRequest.attributes.EMAIL = req.body.email;
		}

		if (req.body.phone) {
			agsRequest.attributes.PHONE = req.body.phone;
		}
		if (req.body.paid) {
			agsRequest.attributes.PAID = req.body.paid;
		}
		if (req.body.cookieorder) {
			agsRequest.attributes.COOKIEORDER = req.body.cookieorder;
		}
		if (req.body.location) {
			var locationArr = req.body.location.split(",");
			var y = locationArr[0];
			var x = locationArr[1];
			agsRequest.geometry = {
				"y": y,
				"x": x,
				"spatialReference" : {"wkid" : 4326}
			};
		}

		// Pass through the cookie
		var j = request.jar();
		var cookie = request.cookie("connect.sid=" + req.cookies['connect.sid']);
		j.setCookie(cookie, req.app.get('addFeatureAddress'));

		// Send the request
		var reqObj = {
			jar: j,
			"rejectUnauthorized": false,
			"method": "POST",
			uri: req.app.get('addFeatureAddress'),
			form: {
				features: JSON.stringify([agsRequest]),
				f: "json"
			}
		};
		request(reqObj, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				res.send(body);
			} else {
				res.send(error);
			}
		});
	});

	workflow.emit('validate');
};

exports.sendMessage = function(req, res) {
	var workflow = req.app.utility.workflow(req, res);

	workflow.on('validate', function() {
		if (!req.body.name) {
			workflow.outcome.errfor.name = 'required';
		}

		if (!req.body.email) {
			workflow.outcome.errfor.email = 'required';
		}

		if (!req.body.message) {
			workflow.outcome.errfor.message = 'required';
		}

		if (workflow.hasErrors()) {
			return workflow.emit('response');
		}

		workflow.emit('sendEmail');
	});

	workflow.on('sendEmail', function() {
		req.app.utility.sendmail(req, res, {
			from: req.app.get('smtp-from-name') + ' <' + req.app.get('smtp-from-address') + '>',
			replyTo: req.body.email,
			to: req.app.get('system-email'),
			subject: req.app.get('project-name') + ' contact form',
			textPath: 'contact/email-text',
			htmlPath: 'contact/email-html',
			locals: {
				name: req.body.name,
				email: req.body.email,
				message: req.body.message,
				projectName: req.app.get('project-name')
			},
			success: function(message) {
				workflow.emit('response');
			},
			error: function(err) {
				workflow.outcome.errors.push('Error Sending: ' + err);
				workflow.emit('response');
			}
		});
	});

	workflow.emit('validate');
};