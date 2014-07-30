goog.provide('bootstrap3.Slider');
goog.provide('bootstrap3.slider.Legend');

goog.require('bootstrap3.utils');

//goog.require('goog.a11y.aria');
goog.require('goog.debug.Logger');
goog.require('goog.ui.SliderBase');
goog.require('goog.ui.Component');

/**
 * @author Nicholas Albion
 * @fileoverview A slider implementation that allows to select a value within a
 * range by dragging a thumb. The selected value is exposed through getValue().
 *
 * To decorate, the slider should be bound to an element with the class name
 * 'slider-[vertical / horizontal]' containing a child with the classname
 * 'slider-handle'.
 *
 * Undecorated DOM:
 * <td>
 *   <label class="control-label" for="my_slider">Rating</label>
 * <td>
 * <td>
 *   <div id="my_slider">50</div>
 *   <input type="hidden" value="50" name="my_slider">
 *   <p class="hint">Satisfactory</p>
 * </td>
 *
 * or
 *
 * <div class="form-group">
 *   <label class="control-label" for="my_slider">Rating</label>
 *   <input type="range" class="form-control" value="50" name="my_slider" id="my_slider">
 *   <p class="hint">Satisfactory</p>
 * </div>
 *
 * Decorated:
 * If the browser does not support <input type="range">:
 *
 *   <div id="my_slider" class="slider">
 *     <div class="slider-handle" style="left: 50%;"></div>
 *   </div>
 *   <p class="hint">Satisfactory</p>
 *
 * var slider = new bootstrap3.Slider();
 * slider.decorate( document.getElementById('my_slider').parentNode );
 */


/**
 * eg: {0:"Msg for zero", 50:"Msg for <= 50", 100:"Msg for <= 100"}
 * @typedef {Object.<number, string>}
 */
bootstrap3.slider.Legend;

/**
 * This creates a slider object.
 * @param {bootstrap3.slider.Legend=} legend
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.SliderBase}
 */
bootstrap3.Slider = function( legend, opt_domHelper ) {
	goog.ui.SliderBase.call(this, opt_domHelper);
//	this.rangeModel.setExtent(0);

	/**
	 * eg: {0:"Msg for zero", 50:"Msg for <= 50", 100:"Msg for <= 100"}
	 * @type {bootstrap3.slider.Legend|undefined}
	 * @private
	 */
	this.legend_ = legend;

	/**
	 * @type {goog.debug.Logger}
	 */
	this.logger_ = goog.debug.Logger.getLogger('bootstrap3.Slider');
//	this.logger_.setLevel(goog.debug.Logger.Level.FINER);
};
goog.inherits(bootstrap3.Slider, goog.ui.SliderBase);

/** @type {HTMLElement} */
bootstrap3.Slider.prototype.inputElement;


/** @inheritDoc */
bootstrap3.Slider.prototype.decorateInternal = function(element) {

	//read initial values from markup and remove the text, initialising the slider
	var value;
	if( element.value !== undefined ) {
		// decorating the <input type="hidden/range"> directly
		value = element.value;
		this.inputElement = element;
	} else {
		this.inputElement = element.getElementsByTagName('input')[0];

		var valueDiv = /** @type {HTMLElement|undefined} */(goog.dom.getFirstElementChild( element ));
		if( valueDiv.value ) { // == this.inputElement ) {
			value = valueDiv.value;
			valueDiv = null;
		} else {
//			if( goog.dom.classes.has(valueDiv, bootstrap3.Slider.CSS_CLASS_PREFIX) ) {
//				value = goog.dom.getNextElementSibling(valueDiv).value;
//				bootstrap3.Slider.superClass_.decorateInternal.call(this, valueDiv);
//			} else {
			value = valueDiv.textContent;
			//gog.dom.getNextElementSibling(valueDiv).value = value;
			valueDiv.innerHTML = '';
//			}
		}
	}

	value = parseInt( value, 10 );

	//(may need to restore this if we use the component registry) this.legend_ = this.legendSet_[d.id].legend;

	if( this.inputElement.type != 'range' ) {
		// If the HTML tries to create a range input in an old browser, it will end up as a text input control.
		this.inputElement.type = 'hidden';	// this doesn't work on Firefox: goog.style.showElement( this.inputElement, false );
		goog.dom.classes.set( valueDiv, bootstrap3.Slider.CSS_CLASS_PREFIX );
		bootstrap3.Slider.superClass_.decorateInternal.call(this, valueDiv);
	} else {
		if( valueDiv ) {
			goog.style.showElement( valueDiv, false );
		}
		goog.dom.classes.set( this.inputElement, 'form-control ' + bootstrap3.Slider.CSS_CLASS_PREFIX );
		goog.ui.Component.prototype.decorateInternal.call(this, valueDiv || element);
	}

	var max = this.inputElement.getAttribute('max');
	if( max != null ) {
		max = parseInt(max, 10);
	} else {
		max = 100;
	}
	this.setMaximum(max);
	if( !isNaN(value) ) {
		this.setValue(value);
		this.setRatingValue( value, this.legend_ );
	}
};

bootstrap3.Slider.prototype.enterDocument = function() {
	if( this.inputElement.type != 'range' ) {
		goog.base(this, 'enterDocument');
	} else {
		goog.ui.Component.prototype.enterDocument.call(this);
	}
	// rather than call addEventListner(), use getHandler.listen() as the Component base class will call removeAll() in exitDocument() 
	//this.addEventListener(goog.ui.Component.EventType.CHANGE, function() {
	var target = (this.inputElement.type == 'range') ? this.inputElement : this;
	this.getHandler().listen( target, goog.ui.Component.EventType.CHANGE, function(event) {
		var value = (event.target == this) ? this.getValue() : parseInt(event.target.value);
		this.setRatingValue( value );
//		this.setValue( value );
	});
};


/**
 * The prefix we use for the CSS class names for the slider and its elements.
 * @type {string}
 */
bootstrap3.Slider.CSS_CLASS_PREFIX = goog.getCssName('slider'); //goog-slider');

/**
 * CSS class name for the single thumb element.
 * @type {string}
 */
bootstrap3.Slider.THUMB_CSS_CLASS = goog.getCssName(bootstrap3.Slider.CSS_CLASS_PREFIX, 'handle'); //thumb');

/**
 * Returns CSS class applied to the slider element.
 * @param {goog.ui.SliderBase.Orientation} orient Orientation of the slider.
 * @return {string} The CSS class applied to the slider element.
 * @protected
 */
bootstrap3.Slider.prototype.getCssClass = function(orient) {
//	return bootstrap3.Slider.CSS_CLASS_PREFIX;
	return orient == goog.ui.SliderBase.Orientation.VERTICAL ?
		goog.getCssName(bootstrap3.Slider.CSS_CLASS_PREFIX, goog.ui.SliderBase.Orientation.VERTICAL) :
		goog.getCssName(bootstrap3.Slider.CSS_CLASS_PREFIX, goog.ui.SliderBase.Orientation.HORIZONTAL);
};

/** @inheritDoc */
bootstrap3.Slider.prototype.createThumbs = function() {
	var element = this.getElement(),
		thumb = goog.dom.getElementsByTagNameAndClass( null, bootstrap3.Slider.THUMB_CSS_CLASS, element )[0];

	if (!thumb) {
		thumb = this.createThumb_();
		element.appendChild(thumb);
	}
	this.valueThumb = this.extentThumb = thumb;
};


/**
 * Creates the thumb element.
 * @return {HTMLDivElement} The created thumb element.
 * @private
 */
bootstrap3.Slider.prototype.createThumb_ = function() {
	var thumb = this.getDomHelper().createDom('div', bootstrap3.Slider.THUMB_CSS_CLASS);
	goog.a11y.aria.setRole(thumb, goog.a11y.aria.Role.BUTTON);
	return /** @type {HTMLDivElement} */ (thumb);
};


/** @inheritDoc */
bootstrap3.Slider.prototype.getThumbCoordinateForValue_ = function(val) {
	var coord = new goog.math.Coordinate;

	if (this.valueThumb) {
		var min = this.getMinimum();
		var max = this.getMaximum();
		// This check ensures the ratio never take NaN value, which is possible when
		// the slider min & max are same numbers (i.e. 1).
		var ratio = (val == min && min == max) ? 0 : (val - min) / (max - min);

//		if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
//			var thumbHeight = this.valueThumb.offsetHeight;
//			var h = this.getElement().clientHeight - thumbHeight;
//			var bottom = Math.round(ratio * h);
//			coord.y = h - bottom;
//		} else {
		var w = this.getElement().clientWidth; // - this.valueThumb.offsetWidth;
		var left = Math.round(ratio * w);
		coord.x = left;
//		}
	}
	return coord;
};


bootstrap3.Slider.prototype.setValue = function( value ) {
	if( goog.isString(value) ) {
		value = parseInt(value, 10);
	}
	bootstrap3.Slider.superClass_.setValue.call(this, value);
//	this.setRatingValue( value );
};

/**
 * Updates the hint and, if present, the placeholder
 * @param {number} value - the integer value for the slider and hidden <input>
 */
bootstrap3.Slider.prototype.setRatingValue = function( value ) {
	var parentEl = this.getElement().parentElement,	// The row containing <p class="hint">,	<input type="text"> and <input type="hidden">
		hint;

	if( parentEl.className == 'slider' ) { // .tagName.toUpperCase() == 'TD' ) {
		parentEl = parentEl.parentElement;
	}

	var hintP = goog.dom.getElementByClass('hint', parentEl);
	if( hintP ) {
		if( this.legend_ != null ) {
			// Test at http://jsperf.com/for-in-object indicates that for best performance:
			// 'for( Object.keys(data) )' is best for Chrome, otherwise, 'for var in'
			for( var i in this.legend_ ) {
				if( i > value ) { break; }
				hint = this.legend_[/** @type {number} */(i)];
			}
		}

		value += '';	// by far, the most efficient way to cast number to string. @see http://jsperf.com/number-to-string3
		if( hint ) {
			//var text = goog.dom.getRawTextContent( hintP );
			var text = bootstrap3.utils.getElementsByTagNameAndAttribute('input', 'type', 'text', parentEl)[0];
			if( goog.isDef(text) ) {
				text.setAttribute('placeholder', hint);
			} // else
			goog.dom.setTextContent( hintP, value + ': ' + hint );

		} else {
			goog.dom.setTextContent( hintP, value );
		}
	}

	//goog.dom.setTextContent( this.inputElement, value );
	this.inputElement.value = value;
};
