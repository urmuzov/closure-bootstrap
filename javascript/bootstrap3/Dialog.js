goog.provide('bootstrap3.Dialog');

//goog.require('goog.ui.Component');
goog.require('goog.ui.Dialog');

/**
 * A Dialog styled with Twitter Bootstrap.
 * @see http://getbootstrap.com/javascript/#modals
 * @see http://www.sitepoint.com/understanding-bootstrap-modals/
 * <pre>
 * <div class="modal fade" id="basicModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
 *   <div class="modal-dialog">
 *     <div class="modal-content">
 *       <div class="modal-header">
 *         <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&amp;times;</button>
 *         <h4 class="modal-title" id="myModalLabel">Modal title</h4>
 *       </div>
 *       <div class="modal-body">
 *         <h3>Modal Body</h3>
 *       </div>
 *       <div class="modal-footer">
 *         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
 *         <button type="button" class="btn btn-primary">Save changes</button>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 * </pre>
 *
 * goog.ui.Dialog is a bit different:
 * <pre>
 * <div(or iframe) class="modal-dialog-bg"></div> <!-- sibling before modal-dialog -->
 * <div class="modal-dialog">
 *   <div class="modal-dialog-title">
 *     <span class="modal-dialog-title-text">Title</span>
 *     <span class="modal-dialog-title-close">X</span>
 *   </div>
 *   <div class="modal-dialog-content">
 *     Content
 *   </div>
 *   <div class="modal-dialog-buttons">
 *     <button>...
 *   </div>
 * </div>
 * </pre>
 *
 * @constructor
 * @param {string=} opt_class - eg 'modal-dialog modal-lg' or 'modal-dialog modal-sm'
 * @extends {goog.ui.ComboBox}
 * extends {goog.ui.ModalPopup}
 */
bootstrap3.Dialog = function( opt_class, opt_useIframeMask, opt_domHelper) {
	goog.ui.ModalPopup.call(this, opt_useIframeMask, opt_domHelper);

	/**
	 * CSS class name for the dialog element, also used as a class name prefix for
	 * related elements.  Defaults to goog.getCssName('modal-dialog').
	 * @type {string}
	 * @private
	 */
	this.class_ = opt_class || 'modal-dialog';

	this.buttons_ = goog.ui.Dialog.ButtonSet.createOkCancel();
};
goog.inherits(bootstrap3.Dialog, goog.ui.Dialog);


bootstrap3.Dialog.prototype.setModalInternal_ = function(modal) {
	// TODO: implement setModalInternal_
//	this.modal_ = modal;
//	if (this.isInDocument()) {
//		var dom = this.getDomHelper();
//		var bg = this.getBackgroundElement();
//		if (modal) {
//			dom.insertSiblingBefore(bg, this.getElement());
//		} else {
//			dom.removeNode(bgIframe);
//			dom.removeNode(bg);
//		}
//	}
};

bootstrap3.Dialog.prototype.createDom = function() {
	// creates the DOM, hidden.
	// ModalPopup.createDom calls
	this.manageBackgroundDom_();
	this.createTabCatcher_();
	goog.ui.Component.prototype.createDom.call(this);

	var modalElement = this.getElement();
	var dom = this.getDomHelper();
	var label = this.getId() + 'Label';
	var modalContent = dom.createDom('div', 'modal-content');
	var modalDialog = dom.createDom('div', this.class_, modalContent);

//	var modalElement = dom.createDom('div',
//		{'className': 'modal fade',
//			'id': this.getId(),
//			'tabindex': '-1'},
//		modalDialog);

	modalElement.appendChild(modalDialog);
	modalElement.className = 'modal fade';
	modalElement.id = this.getId();
	goog.dom.setFocusableTabIndex(modalElement, false);
	goog.style.setElementShown(modalElement, false);


	this.titleEl_ = dom.createDom('div', 'modal-header',
		this.titleTextEl_ = dom.createDom(
			'span',	// h4?
			{'className': 'modal-title',
				'id': label},
			this.title_),
		this.titleCloseEl_ = dom.createDom(
			'button',
			{'className': 'close',
				'type': 'button',
//				'data-dismiss': 'modal',
				'aria-hidden': 'true'},
			'&times;')	// &#215;
		);
	goog.dom.append(modalContent, this.titleEl_,
		this.contentEl_ = dom.createDom('div', 'modal-body'),
		this.buttonEl_ = dom.createDom('div', 'modal-footer'));

	// Make the close button behave correctly with screen readers. Note: this is
	// only being added if the dialog is not decorated. Decorators are expected
	// to add aria label, role, and tab indexing in their templates.
	goog.a11y.aria.setRole(this.titleCloseEl_, goog.a11y.aria.Role.BUTTON);
	goog.dom.setFocusableTabIndex(this.titleCloseEl_, true);
	goog.a11y.aria.setLabel(this.titleCloseEl_,
		goog.ui.Dialog.MSG_GOOG_UI_DIALOG_CLOSE_);

	this.titleTextId_ = label;
	goog.a11y.aria.setRole(modalElement, goog.a11y.aria.Role.DIALOG);
	goog.a11y.aria.setState(modalElement, goog.a11y.aria.State.LABELLEDBY, label);
	goog.a11y.aria.setState(modalElement, goog.a11y.aria.State.HIDDEN, 'true');

	// If setContent() was called before createDom(), make sure the inner HTML of
	// the content element is initialized.
	if (this.content_) {
		goog.dom.safe.setInnerHtml(this.contentEl_, this.content_);
	}
	goog.style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_);

	// Render the buttons.
	if (this.buttons_) {
		this.buttons_.attachToElement(this.buttonEl_);
	}
	goog.style.setElementShown(this.buttonEl_, !!this.buttons_);
	this.setBackgroundElementOpacity(this.backgroundElementOpacity_);
};

/** @override */
//TODO: this could probably be removed or largely replaced by the goog.ui.Dialog implementation
// (would need to configure goog.getCssName()) and correct the DOM structure
bootstrap3.Dialog.prototype.decorateInternal = function(modalElement) {
	goog.ui.Component.prototype.decorateInternal.call(this, modalElement);

	// Make sure the decorated modal popup is hidden.
	goog.style.setElementShown(modalElement, false);

	modalElement.className = 'modal fade';
	// TODO: set other attributes

	var modalContent = goog.dom.getElementsByTagNameAndClass(
		null, 'modal-content', modalElement)[0];
	if (!modalContent) {
		modalContent = this.getDomHelper().createDom('div', this.class_);
		modalElement.appendChild(modalContent);
	}

	var contentClass = 'modal-body';
	this.contentEl_ = goog.dom.getElementsByTagNameAndClass(
		null, contentClass, modalElement)[0];
	if (!this.contentEl_) {
		this.contentEl_ = this.getDomHelper().createDom('div', contentClass);
		if (this.content_) {
			goog.dom.safe.setInnerHtml(this.contentEl_, this.content_);
		}
		modalContent.appendChild(this.contentEl_);
	}

	// Decorate or create the title bar element.
	var titleClass = 'modal-header';
	var titleTextClass = 'modal-title';
	var titleCloseClass = 'close';
	this.titleEl_ = goog.dom.getElementsByTagNameAndClass(
		null, titleClass, dialogElement)[0];
	if (this.titleEl_) {
		// Only look for title text & title close elements if a title bar element
		// was found.  Otherwise assume that the entire title bar has to be
		// created from scratch.
		this.titleTextEl_ = goog.dom.getElementsByTagNameAndClass(
			null, titleTextClass, this.titleEl_)[0];
		this.titleCloseEl_ = goog.dom.getElementsByTagNameAndClass(
			null, titleCloseClass, this.titleEl_)[0];
	} else {
		// Create the title bar element and insert it before the content area.
		// This is useful if the element to decorate only includes a content area.
		this.titleEl_ = this.getDomHelper().createDom('div', titleClass);
		modalContent.insertBefore(this.titleEl_, this.contentEl_);
	}

	// Decorate or create the title text element.
	var label = this.getId() + 'Label';
	if (this.titleTextEl_) {
		this.title_ = goog.dom.getTextContent(this.titleTextEl_);
		// Give the title text element an id if it doesn't already have one.
		if (!this.titleTextEl_.id) {
			this.titleTextEl_.id = label;
		}
	} else {
		this.titleTextEl_ = goog.dom.createDom(
			'span', {'className': titleTextClass, 'id': label});
		this.titleEl_.appendChild(this.titleTextEl_);
	}
	this.titleTextId_ = this.titleTextEl_.id;
	goog.a11y.aria.setState(modalElement, goog.a11y.aria.State.LABELLEDBY,
		this.titleTextId_ || '');
	// Decorate or create the title close element.
	if (!this.titleCloseEl_) {
		this.titleCloseEl_ = this.getDomHelper().createDom('span', titleCloseClass);
		this.titleEl_.appendChild(this.titleCloseEl_);
	}
	goog.style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_);

	// Decorate or create the button container element.
	var buttonsClass = 'modal-footer';
	this.buttonEl_ = goog.dom.getElementsByTagNameAndClass(
		null, buttonsClass, modalElement)[0];
	if (this.buttonEl_) {
		// Button container element found.  Create empty button set and use it to
		// decorate the button container.
		this.buttons_ = new goog.ui.Dialog.ButtonSet(this.getDomHelper());
		this.buttons_.decorate(this.buttonEl_);
	} else {
		// Create new button container element, and render a button set into it.
		this.buttonEl_ = this.getDomHelper().createDom('div', buttonsClass);
		dialogElement.appendChild(this.buttonEl_);
		if (this.buttons_) {
			this.buttons_.attachToElement(this.buttonEl_);
		}
		goog.style.setElementShown(this.buttonEl_, !!this.buttons_);
	}
	this.setBackgroundElementOpacity(this.backgroundElementOpacity_);
};

bootstrap3.Dialog.prototype.setVisible = function(visible) {
	goog.base(this, 'setVisible', visible);
//	goog.a11y.aria.setState(this.getElement(), goog.a11y.aria.State.HIDDEN, !visible);
	goog.dom.classes.enable('in', visible);
};

bootstrap3.Dialog.prototype.manageBackgroundDom_ = function() {
	// Create the backgound mask, initialize its opacity, and make sure it's hidden.
	if (!this.bgEl_) {
		this.bgEl_ = this.getDomHelper().createDom('div', 'modal fade');
		this.setElementInternal(this.bgEl_);
		goog.style.setElementShown(this.bgEl_, false);
	}
};

bootstrap3.Dialog.prototype.renderBackground_ = function() {
	//goog.dom.insertSiblingBefore(this.bgEl_, this.getElement());
};