goog.provide('bootstrap3.TextAreaForm');

goog.require('goog.ui.Component');
goog.require('goog.string');
goog.require('goog.net.XhrIo');

/**
 * A simple form with a text area and cancel/save buttons that collapse when not focussed
 *
 * <form class="textarea-form"><!-- optional class: "focus" -->
 *   <textarea class="form-control" rows="1" placeholder="Add a note...">value</textarea>
 *   <div class="form-group">
 *   <a class="btn btn-danger"><i class="glyphicon glyphicon-remove"></i> Cancel</a>&nbsp;
 *   <a class="btn btn-success"><i class="glyphicon glyphicon-ok"></i> Save</a>
 *   </div>
 * </form>
 *
 * @param {string} value
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.Component}
 */
bootstrap3.TextAreaForm = function( value, opt_domHelper ) {
	goog.ui.Component.call(this, opt_domHelper);

	/**
	 * @type {string}
	 * @private
	 */
	this.value = value;
};
goog.inherits(bootstrap3.TextAreaForm, goog.ui.Component);

/**
 * @type {string}
 * @private
 */
bootstrap3.TextAreaForm.prototype.previousValue;


bootstrap3.TextAreaForm.prototype.enterDocument = function() {
	var _this = this,
		form = /** @type{HTMLFormElement) */(this.getElement());
	this.textarea = form.getElementsByTagName('textarea')[0]; // goog.dom.getElementsByTagNameAndClass( 'textarea', null, form );
	if( goog.isDef( this.value ) ) {
		this.textarea.value = this.value;
	} else {
		this.value = this.textarea.value;
	}
	this.previousValue = this.value;

	this.getHandler()
		.listen( this.textarea,
				goog.events.EventType.FOCUS,
//				goog.ui.Component.EventType.FOCUS,
				this.onFocus, false, this )
//		.listen( this.textarea, goog.ui.Component.EventType.BLUR, this.onFocus, false, this )
		.listen( goog.dom.getElementByClass('btn-danger', form),
				goog.events.EventType.CLICK, function(event) {
			this.value = this.textarea.value = this.previousValue;
			this.onFocus(event);
		}, false, this )
		.listen( goog.dom.getElementByClass('btn-success', form),
				goog.events.EventType.CLICK, function(event) {
			this.previousValue = this.textarea.value;
			var name = this.textarea.name; //  getAttribute('name')
			var value = goog.string.urlEncode( this.textarea.value );
			var url = form.action;
			goog.net.XhrIo.send( url, function(event) {
				//TODO: does this cause a memory leak?
				_this.onFocus(event);
			}, 'POST', name + '=' + value );
		});
};

/**
 * Expand the form for goog.ui.Component.EventType.FOCUS, otherwise collapse the form.
 * @param {goog.events.Event} event
 */
bootstrap3.TextAreaForm.prototype.onFocus = function(event) {
	var form = this.getElement();
//	this.previousValue = this.value;
	//event.preventDefault();
	goog.dom.classes.enable( form, 'focus', event.type == goog.ui.Component.EventType.FOCUS );
};
