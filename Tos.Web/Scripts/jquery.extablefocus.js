/** ç≈èIçXêVì˙ : 2018-02-21 **/
/*
 * exTableFocus 1.1.0 - jQuery plugin
 * modefied by nagao.h
 * Applicable single row only
 * Cell moveable is focusUp/focusDown Only
 * Modefied for jQuery3.2.1
 */
/*
 * 	exTableFocus 0.1.0 - jQuery plugin
 *	written by Cyokodog	
 *
 *	Copyright (c) 2010 Cyokodog (http://d.hatena.ne.jp/cyokodog/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */

(function($){
	var API = function(api){
		var api = $(api),api0 = api[0];
		for(var name in api0)
			(function(name){
				if($.isFunction( api0[name] ))
					api[ name ] = (/^get[^a-z]/.test(name)) ?
						function(){
							return api0[name].apply(api0,arguments);
						} : 
						function(){
							var arg = arguments;
							api.each(function(index){
								var apix = api[index];
								apix[name].apply(apix,arg);
							})
							return api;
						}
			})(name);
		return api;
	}

	$.ex = $.ex || {};
	$.ex.tableFocus = function(targets , option){
		var o = this,
		c = o.config = $.extend({} , $.ex.tableFocus.defaults , option);
		if (c.index == undefined) return $(targets).exTableFocus(option);
		c.targets = targets;
		c.target = c.targets.eq(c.index);
		o._bindEvent();
	}
	$.extend($.ex.tableFocus.prototype, {
		_bindEvent : function(){
			var o = this, c = o.config;
//			c.target.delegate(c.focusExpr, 'focus keydown keyup', function(evt){
			c.target.on('focus keydown keyup', c.focusExpr, function (evt) {
			    if (!c.currentField || c.currentField[0] != evt.target) {
					c.currentField = $(evt.target);
					c.currentCell = c.currentField.parents('td:eq(0)');
					if (c.currentRow) c.currentRow.removeClass(c.currentRowClass);
					c.currentRow = c.currentCell.parents('tr:eq(0)').addClass(c.currentRowClass);
				}
//				if (evt.type == 'keyup' && !$.browser.opera) {
				if (evt.type == 'keyup') {
				    if (evt.keyCode == c.ctrlKey) c.isCtrl = false;
					else if (evt.keyCode == c.shiftKey) c.isShift = false;
				}
				else
//				if (evt.type == 'keydown' && !$.browser.opera) {
				if (evt.type == 'keydown') {
				    //var currentTagName = c.currentField.attr('tagName');
			        var currentTagName = c.currentField.prop('tagName');
				    if (evt.keyCode == c.ctrlKey) c.isCtrl = true;
					else if (evt.keyCode == c.shiftKey) c.isShift = true;
					else
					//if ((evt.keyCode == c.leftKey || evt.keyCode == c.rightKey)
					//	&& (c.isShift || /^(A)$/.test(currentTagName))
					//) {
					//	evt.keyCode == c.leftKey ? o.focusLeft() : o.focusRight();
					//	return false;
					//}
					//else
					if (c.overrideTabControl && c.tabKey == evt.keyCode) {
						if (c.verticalTabControl) {
							c.isShift ? o.focusUp() : o.focusDown();
						}
						//else {
						//	c.isShift ? o.focusLeft() : o.focusRight();
						//}
						return false;
					}
					else
					if (c.overrideCrControl && c.crKey == evt.keyCode && currentTagName != 'A') {
						if (c.verticalCrControl) {
							c.isShift ? o.focusUp() : o.focusDown();
                        }
						else {
							o.focusRight();
						}
						return false;
					}
					else
					if ((evt.keyCode == c.downKey || evt.keyCode == c.upKey)
						&& (c.isShift || !/^(TEXTAREA|SELECT)$/.test(currentTagName))
					) {
						evt.keyCode == c.upKey ? o.focusUp() : o.focusDown();
						return false;
					}
				}
			});
		},
		//_isMozillaSelect : function(target) {
		//	var o = this, c = o.config;
		//	return $.browser.mozilla && (target || c.currentField).attr('tagName') == 'SELECT';
		//},
		_focusField : function(fields , retryEvent){
			var o = this, c = o.config;
			c.focusSuccess = false;
			var nextElem;
			fields.each(function(index){
				var elem = fields.eq(index);
				//if (!elem.is(':hidden')) {
				if (!elem.is(':hidden')
				 && !elem.prop('readonly')
				 && !elem.prop('disabled')) {
				    nextElem = elem;
					return false;
				}
			});
			if (!nextElem) {
				if (retryEvent) {
					retryEvent();
				}
			}
			else{
				nextElem = $(nextElem);
				//if (o._isMozillaSelect() || o._isMozillaSelect(nextElem)) {
				//	nextElem.focus().attr('disabled',true);
				//	setTimeout(function(){
				//		nextElem.attr('disabled',false).focus();
				//		if (c.selectValue) nextElem.select();
				//	},0);
				//}
				//else {
					nextElem = $(nextElem).focus();
					if (c.selectValue) nextElem.select();
				//}
				c.focusSuccess = true;
			}
			return o;
		},
		_moveRow : function ( direction, currentCell ){
			var o = this, c = o.config;
			if (!currentCell) currentCell = c.currentCell;
			//var cellIndex = currentCell.attr('cellIndex');
			//var nextCell = currentCell.parent()[direction]().find('td').eq(cellIndex);
			var cellIndex = currentCell.prop('cellIndex');
			var thisParent = currentCell.parent().parent();
			var thisRow = thisParent[direction]();
			var nextCell = thisRow.find('td').eq(cellIndex);
			if (nextCell.length == 0) {
			    //if (o._isMozillaSelect()) o._focusField(c.currentField);
				return o;
			}
			var fields = nextCell.find(c.focusExpr);
			if (direction == 'prev') fields = $(fields.get().reverse());
			o._focusField(fields , function(){
				o._moveRow(direction, nextCell);
			});
			return o;
		},
		_moveCol : function ( direction, currentCell ){
			var o = this, c = o.config;
			if (!currentCell) currentCell = c.currentCell;
			var nextCell = currentCell[direction]();
			if (nextCell.length == 0) {
			        //if (o._isMozillaSelect()) o._focusField(c.currentField);
				return o;
			}
			var fields = nextCell.find(c.focusExpr);
			if (direction == 'prev') fields = $(fields.get().reverse());
			o._focusField(fields , function(){
				o._moveCol(direction, nextCell);
			});
			return o;
		},
		_moveSibling : function ( direction ){
			var o = this, c = o.config;
			var findSelf = false,sibling = [];
			c.currentCell.find(c.focusExpr).each(function(){
				if (c.currentField[0] == this) findSelf = true;
				else
				if ((findSelf && direction == 'next') || (!findSelf && direction == 'prev')) {
					sibling.push(this);
				}
			});
			if (direction == 'prev') sibling = sibling.reverse();
			o._focusField($(sibling));
			return o;
		},
		focusDown : function(){
			var o = this, c = o.config;
			o._moveSibling('next');
			if (!c.focusSuccess) {
				o._moveRow('next');
			}
			return o;
		},
		focusUp : function(){
			var o = this, c = o.config;
			o._moveSibling('prev');
			if (!c.focusSuccess) {
				o._moveRow('prev');
			}
			return o;
		},
		focusLeft : function(){
			var o = this, c = o.config;
			o._moveSibling('prev');
			if (!c.focusSuccess) {
				o._moveCol('prev');
			}
			return o;
		},
		focusRight : function(){
			var o = this, c = o.config;
			o._moveSibling('next');
			if (!c.focusSuccess) {
				o._moveCol('next');
			}
			return o;
		}
	});
	$.ex.tableFocus.defaults = {
		api : false,
		focusExpr : 'select,input,textarea,a',
		currentRowClass : 'ex-table-current-row',
		overrideTabControl : false,
		verticalTabControl : false,
		overrideCrControl : false,
		verticalCrControl : false,
		selectValue : true,
		tabKey : '9',
		crKey : '13',
		shiftKey : '16',
		ctrlKey : '17',
		downKey : '40',
		upKey : '38',
		leftKey : '37',
		rightKey : '39'
	}
	$.fn.exTableFocus = function(option){
		var targets = this,api = [];
		targets.each(function(index) {
			var target = targets.eq(index);
			var obj = target.data('ex-table-focus') ||
				new $.ex.tableFocus( targets , $.extend(option ||{} ,{index : index}));
			api.push(obj);
			target.data('ex-table-focus',obj);
		});
		return option && option.api ? API(api) : targets;
	}
})(jQuery);
