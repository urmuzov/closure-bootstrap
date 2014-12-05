goog.provide('bootstrap3.Dialog');

goog.require('goog.ui.Dialog');
goog.require('goog.structs');

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
 * <div class="modal-backdrop fade in"></div>
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
 * @param {string=} opt_class - eg 'modal-lg' or 'modal-sm'
 * @param {boolean=} opt_useIframeMask Work around windowed controls z-index
 *     issue by using an iframe instead of a div for bg element.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link
	*     goog.ui.Component} for semantics.
 * @extends {goog.ui.Dialog}  ...goog.ui.ModalPopup
 */
bootstrap3.Dialog = function( opt_class, opt_useIframeMask, opt_domHelper) {
	goog.ui.ModalPopup.call(this, opt_useIframeMask, opt_domHelper);

	/**
	 * CSS class name for the dialog element, also used as a class name prefix for
	 * related elements.  Defaults to goog.getCssName('modal-dialog').
	 * @type {string}
	 * @private
	 */
	this.dlg_class_ = 'modal-dialog';
	if( opt_class ) {
		this.dlg_class_ += ' ' + opt_class;
	}
	this.class_ = 'modal';

	this.buttons_ = goog.ui.Dialog.ButtonSet.createOkCancel();
};
goog.inherits(bootstrap3.Dialog, goog.ui.Dialog);

/**
 * @type {HTMLDivElement}
 * @private
 */
bootstrap3.Dialog.prototype.dialogEl;

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

/** creates the DOM, hidden */
bootstrap3.Dialog.prototype.createDom = function() {
	//----- adapted from ModalPopup.createDom() -----
	var dom = this.getDomHelper();
	var label = this.getId() + 'Label';
	var modalContent = dom.createDom('div', 'modal-content');
	this.dialogEl = dom.createDom('div', this.dlg_class_, modalContent);

//	var modalElement = this.getElement();
	var modalElement = dom.createDom('div',
		{'className': 'modal fade',
			'id': this.getId(),
			'tabindex': '-1'},
		this.dialogEl);

//modalElement.appendChild(this.dialogEl);
	this.setElementInternal(modalElement);

//	modalElement.appendChild(this.dialogEl);
//	modalElement.className = 'modal fade';
//	modalElement.id = this.getId();
	goog.dom.setFocusableTabIndex(modalElement, false);
	goog.style.setElementShown(modalElement, false);

	this.manageBackgroundDom_();
	this.createTabCatcher_();

	//----- adapted from goog.ui.Dialog.prototype.createDom() -----
	this.titleEl_ = dom.createDom('div', 'modal-header',
		this.titleCloseEl_ = dom.createDom(
			'button',
			{'className': 'close',
				'type': 'button',
//				'data-dismiss': 'modal',
				'aria-hidden': 'true'},
			'×' ),
		this.titleTextEl_ = dom.createDom(
			'h4',
			{'className': 'modal-title',
				'id': label},
			this.title_)
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

///** @override */
////TODO: this could probably be removed or largely replaced by the goog.ui.Dialog implementation
//// (would need to configure goog.getCssName()) and correct the DOM structure
//bootstrap3.Dialog.prototype.decorateInternal = function(modalElement) {
//	goog.ui.Component.prototype.decorateInternal.call(this, modalElement);
//
//	// Make sure the decorated modal popup is hidden.
//	goog.style.setElementShown(modalElement, false);
//
//	modalElement.className = 'modal fade';
//	// TODO: set other attributes
//
//	var modalContent = goog.dom.getElementsByTagNameAndClass(
//		null, 'modal-content', modalElement)[0];
//	if (!modalContent) {
//		modalContent = this.getDomHelper().createDom('div', this.class_);
//		modalElement.appendChild(modalContent);
//	}
//
//	var contentClass = 'modal-body';
//	this.contentEl_ = goog.dom.getElementsByTagNameAndClass(
//		null, contentClass, modalElement)[0];
//	if (!this.contentEl_) {
//		this.contentEl_ = this.getDomHelper().createDom('div', contentClass);
//		if (this.content_) {
//			goog.dom.safe.setInnerHtml(this.contentEl_, this.content_);
//		}
//		modalContent.appendChild(this.contentEl_);
//	}
//
//	// Decorate or create the title bar element.
//	var titleClass = 'modal-header';
//	var titleTextClass = 'modal-title';
//	var titleCloseClass = 'close';
//	this.titleEl_ = goog.dom.getElementsByTagNameAndClass(
//		null, titleClass, dialogElement)[0];
//	if (this.titleEl_) {
//		// Only look for title text & title close elements if a title bar element
//		// was found.  Otherwise assume that the entire title bar has to be
//		// created from scratch.
//		this.titleTextEl_ = goog.dom.getElementsByTagNameAndClass(
//			null, titleTextClass, this.titleEl_)[0];
//		this.titleCloseEl_ = goog.dom.getElementsByTagNameAndClass(
//			null, titleCloseClass, this.titleEl_)[0];
//	} else {
//		// Create the title bar element and insert it before the content area.
//		// This is useful if the element to decorate only includes a content area.
//		this.titleEl_ = this.getDomHelper().createDom('div', titleClass);
//		modalContent.insertBefore(this.titleEl_, this.contentEl_);
//	}
//
//	// Decorate or create the title text element.
//	var label = this.getId() + 'Label';
//	if (this.titleTextEl_) {
//		this.title_ = goog.dom.getTextContent(this.titleTextEl_);
//		// Give the title text element an id if it doesn't already have one.
//		if (!this.titleTextEl_.id) {
//			this.titleTextEl_.id = label;
//		}
//	} else {
//		this.titleTextEl_ = goog.dom.createDom(
//			'span', {'className': titleTextClass, 'id': label});
//		this.titleEl_.appendChild(this.titleTextEl_);
//	}
//	this.titleTextId_ = this.titleTextEl_.id;
//	goog.a11y.aria.setState(modalElement, goog.a11y.aria.State.LABELLEDBY,
//		this.titleTextId_ || '');
//	// Decorate or create the title close element.
//	if (!this.titleCloseEl_) {
//		this.titleCloseEl_ = this.getDomHelper().createDom('span', titleCloseClass);
//		this.titleEl_.appendChild(this.titleCloseEl_);
//	}
//	goog.style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_);
//
//	// Decorate or create the button container element.
//	var buttonsClass = 'modal-footer';
//	this.buttonEl_ = goog.dom.getElementsByTagNameAndClass(
//		null, buttonsClass, modalElement)[0];
//	if (this.buttonEl_) {
//		// Button container element found.  Create empty button set and use it to
//		// decorate the button container.
//		this.buttons_ = new goog.ui.Dialog.ButtonSet(this.getDomHelper());
//		this.buttons_.decorate(this.buttonEl_);
//	} else {
//		// Create new button container element, and render a button set into it.
//		this.buttonEl_ = this.getDomHelper().createDom('div', buttonsClass);
//		dialogElement.appendChild(this.buttonEl_);
//		if (this.buttons_) {
//			this.buttons_.attachToElement(this.buttonEl_);
//		}
//		goog.style.setElementShown(this.buttonEl_, !!this.buttons_);
//	}
//	this.setBackgroundElementOpacity(this.backgroundElementOpacity_);
//};

//bootstrap3.Dialog.prototype.setVisible = function(visible) {
//	goog.base(this, 'setVisible', visible);
////	goog.a11y.aria.setState(this.getElement(), goog.a11y.aria.State.HIDDEN, !visible);
//	goog.dom.classes.enable('in', visible);
//	// goog.style.showElement() won't work because Bootstrap sets .modal { display: none; }
//	this.bgEl_.style.display = visible ? 'block' : '';
//};

bootstrap3.Dialog.prototype.showPopupElement_ = function(visible) {
	if (this.bgEl_) {
		goog.dom.classes.enable(this.bgEl_, 'in', visible);
		this.bgEl_.style.display = visible ? 'block' : 'none';
	}
	goog.dom.classes.enable(this.getElement(), 'in', visible);
	this.getElement().style.display = visible ? 'block' : '';
	goog.style.setElementShown(this.tabCatcherElement_, visible);

	// Focus on the dialog
	goog.dom.setFocusableTabIndex(this.dialogEl.firstElementChild, true);
};

bootstrap3.Dialog.prototype.focusElement_ = function() {
	try {
		if (goog.userAgent.IE) {
			// In IE, we must first focus on the body or else focussing on a
			// sub-element will not work.
			this.getDomHelper().getDocument().body.focus();
		}
		this.dialogEl.firstElementChild.focus();
	} catch (e) {
		// Swallow this. IE can throw an error if the element can not be focused.
	}
};

bootstrap3.Dialog.prototype.manageBackgroundDom_ = function() {
	// Create the backgound mask, initialize its opacity, and make sure it's hidden.
	if (!this.bgEl_) {
		this.bgEl_ = this.getDomHelper().createDom('div', 'modal-backdrop fade');
//		this.setElementInternal(this.bgEl_);
//		goog.style.setOpacity(this.bgEl_, this.backgroundElementOpacity_);
		goog.style.setElementShown(this.bgEl_, false);
	}
};

//TODO: what is this.getElement()?
//bootstrap3.Dialog.prototype.reposition = function() {
//
//};

// this.element_:
// - ModalPopup.renderBackground_ -> modal(1) (
// - ModalPopup.enterDocument ->
// 	  g.dom.insertSiblingAfter(.tabCatcherElement_, .getElement() -> modal(6)
// - ModalPopup.setA11YDetectBackground_() -> this.getElementStrict() -> modal(4)
// - ModalPopup.showPopupElement_ -> modal(3)
// - ModalPopup.reposition -> modal-dialog(12)
// - ModalPopup.focusElement_ -> modal-dialog?(4)
// - Dialog.getDialogElement -> modal-dialog(2)
// - Dialog.setModalInternal_ -> modal(9)
// - Dialog.createDragger -> modal-dialog(1)
// - Dialog.enterDocument -> modal(13)
// - Dialog.setDraggerLimits_ -> modal-dialog(12)
// modal: 6(36)   modal-dialog: 5(31)  so  this.element = modal

/**
 * Centers the modal popup in the viewport, taking scrolling into account.
 */
bootstrap3.Dialog.prototype.reposition = function() {
	// Get the current viewport to obtain the scroll offset.
	this.getElement().style.display = 'block';
	var doc = this.getDomHelper().getDocument();
	var win = goog.dom.getWindow(doc) || window;
	if (goog.style.getComputedPosition(this.dialogEl) == 'fixed') {
		var x = 0;
		var y = 0;
	} else {
		var scroll = this.getDomHelper().getDocumentScroll();
		var x = scroll.x;
		var y = scroll.y;
	}

	var popupSize = goog.style.getSize(this.dialogEl);
	var viewSize = goog.dom.getViewportSize(win);

	// Make sure left and top are non-negatives.
	var left = Math.max(x + viewSize.width / 2 - popupSize.width / 2, 0);
	var top = Math.max(y + viewSize.height / 2 - popupSize.height / 2, 0);
	goog.style.setPosition(this.dialogEl, left, top);

	// We place the tab catcher at the same position as the dialog to
	// prevent IE from scrolling when users try to tab out of the dialog.
	goog.style.setPosition(this.tabCatcherElement_, left, top);
};

bootstrap3.Dialog.prototype.getDialogElement = function() {
	this.renderIfNoDom_();
	return this.dialogEl;
};

bootstrap3.Dialog.prototype.createDragger = function() {
	return new goog.fx.Dragger(this.dialogEl, this.titleEl_);
};

bootstrap3.Dialog.prototype.setDraggerLimits_ = function(e) {
	var doc = this.getDomHelper().getDocument();
	var win = goog.dom.getWindow(doc) || window;

	// Take the max of scroll height and view height for cases in which document
	// does not fill screen.
	var viewSize = goog.dom.getViewportSize(win);
	var w = Math.max(doc.body.scrollWidth, viewSize.width);
	var h = Math.max(doc.body.scrollHeight, viewSize.height);

	var dialogSize = goog.style.getSize(this.dialogEl);
	if (goog.style.getComputedPosition(this.dialogEl) == 'fixed') {
		// Ensure position:fixed dialogs can't be dragged beyond the viewport.
		this.dragger_.setLimits(new goog.math.Rect(0, 0,
			Math.max(0, viewSize.width - dialogSize.width),
			Math.max(0, viewSize.height - dialogSize.height)));
	} else {
		this.dragger_.setLimits(new goog.math.Rect(0, 0,
			w - dialogSize.width, h - dialogSize.height));
	}
};

//The following code was written assuming that the div.modal was the bgEl_
//bootstrap3.Dialog.prototype.render = function(opt_parentElement) {
//	goog.ui.Component.prototype.render.call(this, opt_parentElement);
//	// goog.ui.Component.prototype.render_ will have added this.element to the DOM
//	// but we need to inject it into this.bgEl_ and add this.bgEl_ to the DOM
//
//	goog.dom.replaceNode( this.bgEl_, this.getElement() );
//	this.bgEl_.appendChild( this.getElement() );
//};

//bootstrap3.Dialog.prototype.renderBackground_ = function() {
//	// goog.ui.Dialog inserts this.bgEl_ into the DOM as a sibling of this.element_,
//	// but we need it to be the parent of this.element
//	//goog.dom.insertSiblingBefore(this.bgEl_, this.getModalElement());
//};

///**
// * A button set defines the behaviour of a set of buttons that the dialog can
// * show.  Uses the {@link goog.structs.Map} interface.
// * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link
//	*    goog.ui.Component} for semantics.
// * @constructor
// * @extends {goog.ui.Dialog.ButtonSet}
// */
//bootstrap3.Dialog.ButtonSet = function(opt_domHelper) {
//	goog.ui.Dialog.ButtonSet.call(this);
//};
//goog.inherits(bootstrap3.Dialog.ButtonSet, goog.ui.Dialog.ButtonSet);

/**
 * A CSS className for this component.
 * @type {string}
 * @private
 */
goog.ui.Dialog.ButtonSet.prototype.class_ = 'btn';

/**
 * Renders the button set inside its container element.
 */
goog.ui.Dialog.ButtonSet.prototype.render = function() {
	if (this.element_) {
		goog.dom.safe.setInnerHtml(
			this.element_, goog.html.SafeHtml.EMPTY);
		var domHelper = goog.dom.getDomHelper(this.element_);
		goog.structs.forEach(this, function(caption, key) {
			var button = domHelper.createDom('button', {'name': key}, caption);
			if (key == this.defaultButton_) {
				button.className = 'btn btn-primary';
			} else if (key == this.cancelButton_) {
				button.className = 'btn btn-danger';
			} else {
				button.className = 'btn btn-default';
			}
			this.element_.appendChild(button);
		}, this);
	}
};

goog.ui.Dialog.ButtonSet.prototype.decorate = function(element) {
	if (!element || element.nodeType != goog.dom.NodeType.ELEMENT) {
		return;
	}

	this.element_ = element;
	var buttons = this.element_.getElementsByTagName('button');
	for (var i = 0, button, key, caption; button = buttons[i]; i++) {
		// Buttons should have a "name" attribute and have their caption defined by
		// their innerHTML, but not everyone knows this, and we should play nice.
		key = button.name || button.id;
		caption = goog.dom.getTextContent(button) || button.value;
		if (key) {
			var isDefault = i == 0;
			var isCancel = button.name == goog.ui.Dialog.DefaultButtonKeys.CANCEL;
			this.set(key, caption, isDefault, isCancel);
			goog.dom.classlist.add(button, 'btn');
			if (isDefault) {
				goog.dom.classlist.add(button, 'btn-primary');
			} else if (isCancel) {
				goog.dom.classlist.add(button, 'btn-danger');
			}
		}
	}
};
