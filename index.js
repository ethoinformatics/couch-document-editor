require('./index.less');

var tmpl = require('./index.vash');
var $ = require('jquery');
var request = require('superagent');
var storage = require('jocal');

var $btnGet, $btnPut, $btnPost, $btnDelete;
$(function(){
	$('body').append(tmpl({}));

	$btnGet = $('.js-get');
	$btnPut = $('.js-put');
	$btnPost = $('.js-post');
	$btnDelete = $('.js-delete');

	var $database = $('#database'),
		$id = $('#_id'),
		$rev = $('#_rev'),
		$textArea = $('textarea');

	[$database, $id].map(_rememberInput);

	$btnGet.click(function(){
		request.get($database.val()+'/'+$id.val())
			.type('json')
			.end(function(err, res){
				if (err){
					return _showError(err, res);
				}

				var json = JSON.parse(res.text);
				$textArea.val(JSON.stringify(json, '\t', 2));

				$id.val(json._id);
				$rev.val(json._rev);
				_showSuccess(res);

			});
	});

	$btnPut.click(function(){
		var o = JSON.parse($textArea.val());
		request.put($database.val()+'/'+$id.val())
			.type('json')
			.send(o)
			.end(function(err, res){
				if (err){
					return _showError(err, res);
				}

				var json = JSON.parse(res.text);
				o._id = json.id; 
				o._rev = json.rev; 
				$rev.val(json.rev);

				$textArea.val(JSON.stringify(o, '\t', 2));
				_showSuccess(res);

			});
	});

	$btnPost.click(function(ev){
		var o = JSON.parse($textArea.val());
		request.post($database.val())
			.type('json')
			.send(o)
			.end(function(err, res){
				if (err){
					return _showError(err, res);
				}

				var json = JSON.parse(res.text);
				o._rev = json.rev; 
				$id.val(json.id);
				$rev.val(json.rev);

				$textArea.val(JSON.stringify(o, '\t', 2));
				_showSuccess(res);

			});
	});

	$btnDelete.click(function(){
		request.del($database.val()+'/'+$id.val())
			.type('json')
			.query({rev: $rev.val()})
			.end(function(err, res){
				if (err){
					return _showError(err, res);
				}

				_showSuccess(res);
			});
	});
});

function _showUrl(res){
	$('.js-url').html('<b>'+res.req.method + '</b> ' + res.req.url);
}

function _showError(err, res){
	_showUrl(res);
	$('.js-message').css('color', 'red')
		.text(err.toString());
}

function _showSuccess(res){
	_showUrl(res);
	$('.js-message').css('color', 'green')
		.text(res.statusText);
}

function _rememberInput($el){
	var previousValue = storage($el.attr('id'));
	if (previousValue)
		$el.val(previousValue);

	$el.on('change', function(){
		storage($el.attr('id'), $el.val());
	});
}
