goog.provide('bootstrap3.TimePicker');

goog.require('bootstrap3.ComboBox');

/**
 * ComboBox that allows user to select or enter a time.
 * Can be partnered with another TimePicker that is used to set the start - end times.
 *
 * @param {string} startTime - eg '09:00'
 * @param {string} endTime
 * @param {string=} opt_defaultTime
 * @param {bootstrap3.TimePicker=} opt_startTimePicker - if provided, show only times after the value of startTimePicker
 * 														and show the duration
 * @extends {bootstrap3.ComboBox}
 * @constructor
 */
bootstrap3.TimePicker = function( startTime, endTime, opt_defaultTime, opt_startTimePicker ) {
	bootstrap3.ComboBox.call( this );

	/**
	 * @type {bootstrap3.TimePicker}
	 */
	this.startTimePicker = opt_startTimePicker;
	this.restrictStartTime( startTime );

//	if( goog.isDef(opt_startTimePicker) ) {
//		this.restrictStartTime( opt_startTimePicker.getValue() );
//		this.getHandler().listen( opt_startTimePicker, goog.ui.Component.EventType.CHANGE, function(e) {
//			this.restrictStartTime( opt_startTimePicker.getValue(), true );
//		}, false, this );
//	}

	this.restrictEndTime( endTime );

	this.defaultValue = opt_defaultTime > this.startTime ? opt_defaultTime : this.startTime;

//	/**
//	 * @type {goog.debug.Logger}
//	 * @private
//	 */
//	this.logger_ = goog.debug.Logger.getLogger('bootstrap3.TimePicker');
};
goog.inherits(bootstrap3.TimePicker, bootstrap3.ComboBox);


bootstrap3.TimePicker.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	if( goog.isDef(this.startTimePicker) ) {
		this.restrictStartTime( this.startTimePicker.getValue(), true );
		this.getHandler().listen( this.startTimePicker, goog.ui.Component.EventType.CHANGE, function(e) {
			this.restrictStartTime( this.startTimePicker.getValue(), true );
		}, false, this );
	}

	this.setValue( this.input_.value || this.defaultValue );
	this.resetClasses();
};


/**
 * @param {string=} opt_extra_class
 */
bootstrap3.TimePicker.prototype.resetClasses = function(opt_extra_class) {
	var classes = bootstrap3.ComboBox.CLASS_NAME + ' time';
	if( opt_extra_class != undefined ) {
		classes += ' ' + opt_extra_class;
	}
	goog.dom.classes.set( this.getElement(), classes );
};

bootstrap3.TimePicker.prototype.onMenuSelected_ = function(e) {
	var el = this.getElement(),
		item = /** @type {!goog.ui.MenuItem} */ (e.target);
//	goog.dom.classes.remove( el, 'has-error' );
//	goog.dom.classes.remove( el, 'has-warning' );
	this.resetClasses();

	// The base implementation applies the caption as the <input> value.
	// Because we display "(1.5 hours)" etc, we need to apply the model.
	// goog.base(this, 'onMenuSelected_', e);
	var value = item.getModel();
	if (this.labelInput_.getValue() != value) {
		this.labelInput_.setValue(value);
		this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
	}
	this.dismiss();
	e.stopPropagation();
};

// if( this.visibleCount_ == 0 ) { this.labelInput_.setValue( this.lastToken_ ); }

/**
 * @inheritDoc
 */
bootstrap3.TimePicker.prototype.onInputEvent_ = function(e) {
//bootstrap3.TimePicker.prototype.handleInputChange_ = function() {
	// save the lastToken because it will be scrapped by super.handleInputChange_() even if invalid
//	var lastToken = this.lastToken_;

	this.resetClasses('open');
	var el = this.getElement(),
		value = this.labelInput_.getValue();
	if( value != '' ) {
		var match = value.match(/^[012]?\d(:([0-5](\d)?)?)?$/);
		if( match === null ) {
			goog.dom.classes.add( el, 'has-error' );
			return;
		}

		if( match[3] === undefined ) {
			goog.dom.classes.add( el, 'has-warning' );
//		} else {
//			goog.dom.classes.remove( el, 'has-warning' );
		}
	}

//TODO: goog.ui.ComboBox.prototype.getNumberOfVisibleItems_ or visibleCount_ = this.menu_.getChildCount()


//	console.info('onInputEvent: ' + value);
//	goog.dom.classes.remove( el, 'has-error' );
	goog.base(this, 'onInputEvent_', e);
};

bootstrap3.TimePicker.prototype.onComboMouseDown_ = function(e) {
	if( e.target == this.button_ ) {
		this.visibleCount_ = this.menu_.getChildCount();
	}
	goog.base(this, 'onComboMouseDown_', e);
};


//	// validate the input
//	var el = this.getElement(),
//		input = this.labelInput_;
//	if( input.getValue().match(/[012]?\d:?:[0-5]\d/) == null ) {
//		goog.dom.classes.add( el, 'has-error' );
//	} else {
//		goog.dom.classes.remove( el, 'has-error' );
//		goog.base(this, 'onInputEvent_', e);
////		goog.base(this, 'handleInputChange_');
//	}
//};

//goog.ui.ComboBox.prototype.getTokenText_ = function() {
//	// TODO(user): Implement multi-input such that getToken returns a substring
//	// of the whole input delimited by commas.
//	return goog.string.trim(this.labelInput_.getValue().toLowerCase());
//};

/**
 * @param {string} startTime
 * @param {boolean=} updateOptions - omit or set to false if being used in conjunction with restrictEndTime()
 */
bootstrap3.TimePicker.prototype.restrictStartTime = function( startTime, updateOptions ) {
	if( startTime == null ) { return; }
	this.startTime = startTime;

	if( updateOptions == true ) {
		this.updateOptions();
	}
};

/**
 * @param {string} endTime
 */
bootstrap3.TimePicker.prototype.restrictEndTime = function( endTime ) {
	this.endTime = endTime;
	this.updateOptions();
};

/**
 * @private
 */
bootstrap3.TimePicker.prototype.updateOptions = function() {
	this.removeAllItems();

	var eventStartTime = this.startTimePicker == null ? null : this.startTimePicker.getValue();
	var time = this.startTime, timeStr;
var i = 0;
	do {
		if( eventStartTime != null && eventStartTime != "" ) {
			timeStr = bootstrap3.TimePicker.getDeltaTime(eventStartTime, time);
		} else {
			timeStr = time;
		}

//console.info(timeStr + ", " + time);
		this.addItem( timeStr, time );
//					new goog.ui.MenuItem(timeStr, time) );
//					new goog.ui.ComboBoxItem(timeStr, time) );
		time = bootstrap3.TimePicker.incrementTimeString(time);

if(i++>20) { break; }
	} while( time <= this.endTime );
};

/**
 * @param {string} timeA '12:05'
 * @param {string} timeB '12:35'
 * @return {string} '12:35 (30 mins)' or '13:05 1.5 hrs'
 */
bootstrap3.TimePicker.getDeltaTime = function( timeA, timeB ) {
	var hours = parseInt( timeA.substr(0,2) ),
		minutesA = parseInt( timeA.substr(3) ) + hours * 60;

	hours = parseInt( timeB.substr(0,2) );

	var minutesB = parseInt( timeB.substr(3) ) + hours * 60,
		minutes = minutesB - minutesA;

	if( minutes == 0 ) {
		return timeA;
	}

	var str = timeB + ' (';
	if( minutes < 60 ) {
		str += minutes + ' mins)';
	} else if( minutes == 60 ) {
		str += '1 hr)';
	} else {
		str += (minutes / 60) + ' hrs)';
	}
	return str;
};

/**
 * Increments timeStr by 30 minutes
 * @param {string} timeStr
 * @return {string}
 */
bootstrap3.TimePicker.incrementTimeString = function( timeStr ) {
	var hours = parseInt( timeStr.substr(0,2) ),
		minutes = parseInt( timeStr.substr(3) ) + 30;
	hours += parseInt( minutes / 60 );		// need to call parseInt() to round
	minutes %= 60;

	return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
};
