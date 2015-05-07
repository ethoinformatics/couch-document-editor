var tmpl = require('./index.vash'),
	$ = require('jquery'),
	request = require('superagent'),
	storage = require('jocal'),
	FieldNamePicker = require('./field-name-picker.js'),
	geoJsonViewer = require('./geojson-viewer.js');

$(function(){
	$('body').append(tmpl({}));

	var $database = $('#database'),
		$id = $('#_id'),
		$rev = $('#_rev'),
		$textArea = $('textarea');

	[$database, $id, $textArea].map(_rememberInput);

	$('.js-get').click(function(){
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

	$('.js-put').click(function(){
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

	$('.js-post').click(function(){
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

	$('.js-delete').click(function(){
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

	$('#render-geojson').click(function(){
		var o = JSON.parse($textArea.val());
		if (!o) return;

		var fieldNamePicker = new FieldNamePicker(o);
		$('body').append(fieldNamePicker.$element);
		fieldNamePicker.on('picked', function(geoJson){
			geoJsonViewer(geoJson);

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
