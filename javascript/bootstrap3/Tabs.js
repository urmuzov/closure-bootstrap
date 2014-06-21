goog.provide('bootstrap3.Tabs');

goog.require('bootstrap3.TabBarRenderer');
goog.require('bootstrap3.TabRenderer');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('goog.ui.TabBar');
goog.require('goog.net.XhrIo');
goog.require('goog.Uri');
goog.require('goog.History');
goog.require('goog.net.cookies');
goog.require('goog.debug.Logger');

/**
 * @fileoverview Based on JQueryTabs, but uses styles from http://twitter.github.com/bootstrap/components.html#navs:
 *
 * <pre>
 * 	&lt;div id="profileTabs">
 &lt;ul class="nav nav-tabs">
 &lt;li>&lt;a href="#searchTab">Search</a></li>
 &lt;li>&lt;a href="ajax/saved_search.html">Saved Profile&lt;/a></li>
 &lt;li>&lt;a href="#addTabTab">Add&lt;/li>
 &lt;/ul>
 &lt;div id="searchTab">
 &lt;/div>
 &lt;div id="addTabTab">
 &lt;/div>
 &lt;/div>
 </pre>

 @author Nicholas Albion
 */

/**
 * JQueryUI-style tabs container with Bootstrap styling - based on goog.ui.TabPane
 *
 * @param {string=} cookieName - eg: 'tab-index'. Provide a name if the last selected tab should be saved in a cookie and #
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 *
 * @extends {goog.ui.Component}
 * @constructor
 */
bootstrap3.Tabs = function( cookieName, opt_domHelper ) {
	goog.ui.Container.call(this, opt_domHelper);
//	this.setFocusable(false);

	/**
	 * DomHelper used to interact with the document, allowing components to be
	 * created in a different window.  This property is considered protected;
	 * subclasses of Component may refer to it directly.
	 * @type {goog.dom.DomHelper}
	 * @protected
	 * @suppress {underscore}
	 */
	this.dom_ = opt_domHelper || goog.dom.getDomHelper();

	/**
	 * @type {string|undefined}
	 */
	this.cookieName_ = cookieName;

//	/**
//	 * @type {goog.History}
//	 * @private
//	 */
//	this.history_ = new goog.History();

//  /**
//   * @type {Array.<string>}
//   * @private
//   */
//  this.tabElements_ = [];

//  /**
//   * @type {Object.<string, Element>}
//   * @private
//   */
//  this.contentPanes_ = {};
};
goog.inherits(bootstrap3.Tabs, goog.ui.Component);

/**
 * @type {goog.debug.Logger}
 * @private
 */
bootstrap3.Tabs.logger_ = goog.debug.Logger.getLogger('bootstrap3.Tabs');

/**
 * @type {goog.ui.TabBar}
 * @private
 */
bootstrap3.Tabs.prototype.tabBar_;

/**
 * @type {HTMLDivElement}
 * @private
 */
bootstrap3.Tabs.prototype.visibleContentPane_;

/**
 * @type {goog.History}
 * @private
 */
bootstrap3.Tabs.prototype.history_;

///**
// * @param {Element} element Element to decorate.
// */
//bootstrap3.Tabs.prototype.decorate = function(element) {
//	this.decorateInternal(element);
//	this.enterDocument();
//};

/**
 * @override
 */
bootstrap3.Tabs.prototype.createDom = function() {
	this.decorateInternal( /** @type {HTMLDivElement} */ (this.dom_.createElement('div')) );
};

/**
 * Decorates the given element with this container.
 * @param {Element} element Element to decorate.
 * @override
 */
bootstrap3.Tabs.prototype.decorateInternal = function(element) {
	this.setElementInternal(element);

	var tabBarEl = goog.dom.getFirstElementChild(element),
		tabElements_ = /** @type {Array.<HTMLLIElement>} */
			(goog.dom.getElementsByTagNameAndClass('li', undefined, tabBarEl));

	tabBarEl.className = 'nav nav-tabs';
//	goog.ui.registry.setDecoratorByClassName( 'tab',
//		function() {
//			return new goog.ui.Tab(null, bootstrap3.Tabs.TabRenderer.getInstance());
//		}
//	);

	var selectedTabIndex,
		historyCtrl = /** @type {HTMLInputElement} */(goog.dom.getElement('history_state'));
	if( historyCtrl == null ) {
		selectedTabIndex = 0;
	} else {
		selectedTabIndex = parseInt( historyCtrl.value, 10 );
		this.history_ = new goog.History( false, undefined, historyCtrl );
		//(historyToken is mapped to selectedTabIndex on the server if the cookie "tab-index" is set) var historyToken = this.history_.getToken();
	}

	// add the class names to each of the tabs.  Function passed to forEach: (element, index, array) 	
	goog.array.forEach( tabElements_, function(tabElement, index) {
		//tabElement.className = 'tab';
		//tabElement.onclick = function(){ return false; };
		var a = goog.dom.getFirstElementChild(tabElement),
			href = new goog.Uri(a.href);
		tabElement.id = 'tab' + index;
		a.onclick = function() { return false; };
		if( href.hasFragment() ) {
			// Content has already been provided, but we only want to show the selected tab
			var contentPane = /** @type {HTMLElement} */(goog.dom.getElement( href.getFragment() ));
			goog.dom.classes.add( contentPane, 'tab-panel' );
			//goog.style.showElement( contentPane, false );
			bootstrap3.Tabs.decorateContentPane( contentPane );
		}
	} );

	this.tabBar_ = new goog.ui.TabBar( goog.ui.TabBar.Location.TOP, bootstrap3.TabBarRenderer.getInstance() );
	this.addChild( this.tabBar_, false );
	//this.tabBar_.setFocusable(false);
	//this.tabBar_.setParent( this );
	try {
		this.tabBar_.decorate( tabBarEl );
	} catch( e ) {
		console.error(e);
	}

	// addChild(child, opt_render)
	// addChildAt(child, insertionIndex, opt_render)

	this.tabBar_.setSelectedTabIndex( selectedTabIndex );		// or this.tabBar_.setSelectedTab( selectedTab );
};

/**
 * @param {function(goog.ui.Tab, number=)} f
 */
bootstrap3.Tabs.prototype.forEachTab = function( f ) {
	this.tabBar_.forEachChild( f );
};

/**
 * @param {goog.ui.Tab} tab
 * @param {boolean|undefined} opt_unrender
 * @return {goog.ui.Component|null}
 */
bootstrap3.Tabs.prototype.removeChild = function( tab,  opt_unrender ) {

	// Remove the associated content pane from the DOM
	var tabElement = tab.getElement(),
		a = goog.dom.getFirstElementChild(tabElement),
		href = new goog.Uri(a.href);

	if( href.hasFragment() ) {
		var fragment = href.getFragment();
		bootstrap3.Tabs.logger_.fine('removing tab content pane' + fragment );
		var contentPane = goog.dom.getElement( fragment );

//I don't think we need to deselect the tab - hopefully the super impl will take care of that		
//		if( contentPane === this.visibleContentPane_ ) {
//			this.doSelectTab_( this.tabBar_.get )
//		}
		goog.dom.removeNode( contentPane );
	}

//	this.showTabContentPane_( this.visibleContentPane_, false );

	// Remove the tab
	return bootstrap3.Tabs.superClass_.removeChild.call(this, tab, opt_unrender);
};

///**
// * Configures the container after its DOM has been rendered, and sets up event handling.  
// * Overrides {@link goog.ui.Component#enterDocument}.
// * @override
// */
//bootstrap3.Tabs.prototype.enterDocument = function() {
//	this.history_ = new goog.History();

//	var tabs = this;

// Handle clicks on each tab
//	goog.events.listen( this.tabBar_, goog.ui.Component.EventType.SELECT,
//		function(e) {
//			var tab = e.target;
////			bootstrap3.Tabs.logger_.info('SELECT event: ' + tab);
////			tabs.doSelectTab_(tab);			
//		}
//	);
//};

/**
 * If the selected tab has a fragment URL, show the content pane with an ID matching the fragment.
 * Otherwise,
 * @param {goog.ui.Tab} tab
 * @private
 */
bootstrap3.Tabs.prototype.doSelectTab_ = function( tab ) {
	var tabElement = tab.getElement(),
		a = goog.dom.getFirstElementChild(tabElement),
		href = new goog.Uri(a.href),
		tabs = this;

	this.showTabContentPane_( /** @type {!HTMLDivElement} */(this.visibleContentPane_), false );
	if( href.hasFragment() ) {
		var fragment = href.getFragment();
		bootstrap3.Tabs.logger_.fine('re open tab ' + fragment );
		var contentPane = /** @type {!HTMLDivElement} */(goog.dom.getElement( fragment ));
		this.showTabContentPane_( contentPane, true, fragment );
	} else {
		bootstrap3.Tabs.logger_.fine('download content for tab ' + href);

		goog.net.XhrIo.send( href, function(event) {
			if( event.target.isSuccess() ) {
				// inject the content as a new div and update the <a>'s href to point at the tabPane
				var html = event.target.getResponseText(),
					tabPaneId = tab.getId() + '_content',
					contentPane = /** @type {HTMLElement} */(goog.dom.createDom('div', {id: tabPaneId},
						tabs.dom_.htmlToDocumentFragment(html) ));
				// TODO: use the util.getTempFrame() method to insert the responseText into our DOM?

				a.href = '#' + tabPaneId;
				//goog.dom.appendChild( tabElement.parentNode, newNode )
				goog.dom.insertSiblingAfter( contentPane, tabElement.parentNode );
				goog.dom.classes.add( contentPane, 'tab-panel' );
				tabs.showTabContentPane_( contentPane, true, tabPaneId );
				bootstrap3.Tabs.decorateContentPane( contentPane );
				tabs.dispatchEvent( new goog.events.Event( goog.events.EventType.LOAD, contentPane ) );
//			} else {
//			 	var status = event.target.getStatus();   		// 404
//			 	var statusText = event.target.getStatusText(); // not found
//				var json = event.target.getResponseJson();
			}
		});
	}
};

/**
 * Attempt to automatically decorate the downloaded content
 * @param {HTMLElement} contentPane
 */
bootstrap3.Tabs.decorateContentPane = function( contentPane ) {
	var elementToDecorate = contentPane.id != null ? contentPane : goog.dom.getFirstElementChild( contentPane );
	bootstrap3.Tabs.logger_.fine('decorateContentPane ' + elementToDecorate.id);
	var decorator = goog.ui.registry.getDecorator( elementToDecorate );
	if( decorator ) {
		decorator.decorate(elementToDecorate);
	}
};

/**
 * @param {!HTMLDivElement} contentPane
 * @param {boolean} show
 * @param {string=} tabId - The URL fragment. eg: 'searchTab', 'tab1_content', 'addTabTab'.
 * 							Can be undefined if {@code show} is false
 * @private
 */
bootstrap3.Tabs.prototype.showTabContentPane_ = function( contentPane, show, tabId ) {
	if( contentPane ) {
		goog.dom.classes.enable( contentPane, 'active', show );
//		goog.style.showElement( contentPane, show );
		if( show ) {
			this.visibleContentPane_ = contentPane;

			if( this.cookieName_ ) {
				var scrollTop = window.document.body.scrollTop,
					underscore = tabId.indexOf('_'),
					tabIndex = underscore < 0 ? '0' : tabId.substring( 3, underscore ); 	// tabX_content

				goog.net.cookies.set( this.cookieName_, tabIndex );

				//bootstrap3.Tabs.logger_.info('updating URL hash: ' + tabId); // + ', scrollTop: ' + scrollTop);
				if( this.history_ ) {
					this.history_.setToken(tabId);
				} else {
//					var uri = goog.Uri.parse(window.location);
//					uri.setFragment( tabId );
//					window.location = uri.toString();
					window.location.hash = '#' + tabId;
				}
				// reset the scroll position (setting window.location.hash scrolls to the anchor location)
//				window.document.body.scrollTop = scrollTop;
				window.scrollTo( window.document.body.scrollLeft, scrollTop );
			}
		}
	}
};

/**
 * @return {number}
 */
bootstrap3.Tabs.prototype.getSelectedTabIndex = function() {
	return this.tabBar_.getSelectedTabIndex();
};

/**
 * @return {Element}
 */
bootstrap3.Tabs.prototype.getCurrentContentPane = function() {
	return this.visibleContentPane_;
};

/**
 * @return {number}
 */
bootstrap3.Tabs.prototype.getMinWidth = function() {
	//return this.tabBar_.getContentElement().clientWidth;
	var el = this.tabBar_.getContentElement(),
		width = 8, //goog.style.getPaddingBox( el ).left * 2,
		i = this.tabBar_.getChildCount();
	while( i-- != 0 ) {
		el = this.tabBar_.getChildAt(i).getContentElement();
		width += (el.offsetWidth + 2);
	}
	return width;
};
