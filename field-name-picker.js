var $ = require('jquery'),
	tmpl = require('./field-name-picker.vash'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

function _getFieldNames(obj){
	var fields = [];
	_onGetFieldNames(obj, '', fields);
	return fields;
}

function _onGetFieldNames(obj, parentKey, fields){
	Object.keys(obj)
		.forEach(function(key){
			var completeKey = [parentKey, key].filter(Boolean).join('.');
			var value = obj[key];
			if (typeof value != 'object') return;

			fields.push(completeKey);
			_onGetFieldNames(value, completeKey, fields);
		});
}

function FieldNamePicker(obj){
	var self = this;
	EventEmitter.call(self);
	var $element = $(tmpl({fieldNames: _getFieldNames(obj)}));

	$element.find('.js-cancel').click(function(){
		$element.remove();
	});

	function _emitPicked(o){
		$element.remove();
		self.emit('picked', o);
	}
	$element.find('.js-okay').click(function(){
		var key = $element.find('select').val(),
			geojson = obj;

		if (key.trim() == '---')
			return _emitPicked(geojson);

		key.split('.')
			.forEach(function(partialKey){
				geojson = geojson[partialKey];
			});

		_emitPicked(geojson);
	});

	self.$element = $element;
}

util.inherits(FieldNamePicker, EventEmitter);
module.exports = FieldNamePicker;


