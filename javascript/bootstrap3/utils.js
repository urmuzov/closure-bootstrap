goog.provide('bootstrap3.utils');

/**
 * @param {goog.events.BrowserEvent} event
 * @param {Element} element - the element we think we've moused out of
 * @return {boolean} true if leaving <code>element</code>,
 * 		false if moused into a child of <code>element</code> (and therefore still within <code>element</code>)
 */
bootstrap3.utils.checkMouseOut = function( event, element ) {
	// this is the element we've moved to
	var reltg = event.relatedTarget || event.target; // || event.toElement;
	while( reltg != undefined && reltg.tagName != 'BODY' ){
		if (reltg == element ){ return false; }
		reltg = reltg.parentNode;
	}
	return true;
};

/**
 * @param {Element} element
 * @return {number}
 */
bootstrap3.utils.indexOfElementWithinParent = function( element ) {
	var index = 0;
	while( element ) {
		element = goog.dom.getPreviousElementSibling( element );
		index++;
	}
	return index;
};
