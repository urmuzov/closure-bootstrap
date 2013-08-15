goog.provide('bootstrap.NavBarRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.Container.Orientation');
goog.require('goog.ui.CustomButtonRenderer');
goog.require('bootstrap.NavBarToggle');
goog.require('bootstrap.NavBarToggleRenderer');

/**
 * <pre>
 *   <div class="navbar">
 *     <a class="navbar-brand" href="#">Title</a>
 *     <!--  <p class="navbar-text pull-right">
 *     		Signed in as 
 *     		<a href="#" class="navbar-link">Mark Otto</a>
 *     </p>
 *     <form class="navbar-form pull-left"></form>
 *     <button type="button" class="btn btn-default navbar-btn">Sign in</button>
 *      -->
 *     <ul class="nav navbar-nav">
 *       <li class="active"><a href="#">Home</a></li>
 *       <li><a href="#">Link</a></li>
 *       <li><a href="#">Link</a></li>
 *     </ul>     
 *   </div>
 * </pre>
 * 
 * <pre>
 *   <div class="navbar">
 *     <div class="container">
 *       <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
 *         <span class="icon-bar"></span>
 *         <span class="icon-bar"></span>
 *         <span class="icon-bar"></span>
 *       </button>
 *       
 *       <a class="navbar-brand" href="#">Title</a>
 *       
 *       <div class="nav-collapse collapse navbar-responsive-collapse">
 *         <ul class="nav navbar-nav">
 *           <li class="active"><a href="#">Home</a></li>
 *           <li><a href="#">Link</a></li>
 *           <li><a href="#">Link</a></li>
 *         </ul>
 *       </div>
 *     </div>     
 *   </div>
 * </pre>
 * 
 * @constructor
 * @extends {goog.ui.ContainerRenderer}
 */
bootstrap.NavBarRenderer = function() {
  goog.ui.ContainerRenderer.call(this);
};
goog.inherits(bootstrap.NavBarRenderer, goog.ui.ContainerRenderer);
goog.addSingletonGetter(bootstrap.NavBarRenderer);

/**
 * @const
 * @type {string}
 */
bootstrap.NavBarRenderer.CSS_CLASS = 'navbar';


/**
 * Creates and returns the container's root element.  The default
 * simply creates a DIV and applies the renderer's own CSS class name to it.
 * To be overridden in subclasses.
 * @param {goog.ui.Container} container Container to render.
 * @return {Element} Root element for the container.
 */
bootstrap.NavBarRenderer.prototype.createDom = function(container) {
	var dom = container.getDomHelper();
  var el = dom.createDom('div', this.getClassNames(container).join(' ')),
  	  navContainerEl = el; //container.collapse ? dom.createDom('div', 'collapse') : el;
  	  
  if( container.collapsible ) {
	  var btn = bootstrap.NavBarRenderer.createToggle();
	  btn.render( navContainerEl );
	  container.appendChild( btn );
  }
  
  if( container.title != null ) {
	  var brand = dom.createDom('a', {'className':'brand', 'href':container.url});
	  brand.textContent = container.title;
	  navContainerEl.appendChild(brand);
  }
  
  return el;
};

/** @override */
bootstrap.NavBarRenderer.prototype.decorate = function(navBar, element) {
	// The superclass implementation takes care of common attributes;
	navBar.setElementInternal(element);
	bootstrap.NavBarRenderer.superClass_.decorate.call(this, navBar, element);
//	var brandEl = goog.dom.getElementByClass('navbar-brand', element);
//	if( brandEl != null ) {
//		navBar.title = brandEl.textContent;
//		navBar.url = brandEl.href;
//	}
//	if( goog.dom.classes.has(brandEl, 'navbar-fixed-top') ) {
//		navBar.location = bootstrap.NavBar.Location.FIXED_TOP;
//	} else if( goog.dom.classes.has(brandEl, 'navbar-fixed-bottom') ) {
//		navBar.location = bootstrap.NavBar.Location.FIXED_BOTTOM;
//	} else if( goog.dom.classes.has(brandEl, 'navbar-static-top') ) {
//		navBar.location = bootstrap.NavBar.Location.STATIC_TOP;
//	} else {
//		navBar.location = bootstrap.NavBar.Location.TOP;
//	}
	return element;
};

/**
 * Returns all CSS class names applicable to the given container, based on its
 * state.  The array of class names returned includes the renderer's own CSS
 * class, followed by a CSS class indicating the container's orientation,
 * followed by any state-specific CSS classes.
 * @param {goog.ui.Container} container Container whose CSS classes are to be
 *     returned.
 * @return {Array.<string>} Array of CSS class names applicable to the
 *     container.
 */
bootstrap.NavBarRenderer.prototype.getClassNames = function(container) {
	var classNames = [bootstrap.NavBarRenderer.CSS_CLASS];
	
	if( container.location != null ) {
		classNames.push( container.location ); 
	}
	
	return classNames;
};

/**
 * Returns the ARIA role to be applied to toolbar/menubar.
 * @return {string} ARIA role.
 * @override
 */
bootstrap.NavBarRenderer.prototype.getAriaRole = function() {
	return goog.a11y.aria.Role.NAVIGATION; //MENU, TOOLBAR;
};

bootstrap.NavBarRenderer.prototype.decorateChildren = function(container, element, opt_firstChild) {
	if (element) {
		var child = opt_firstChild || goog.dom.getFirstElementChild(element);
		if( goog.dom.classes.has(child, 'navbar-inner') || goog.dom.classes.has(child, 'container') ) {
			this.decorateChildren( container, child );
		} else {
			bootstrap.NavBarRenderer.superClass_.decorateChildren( container, element, child );
		}
	}
};

/**
 * Returns the CSS class to be applied to the root element of containers
 * rendered using this renderer.
 * @return {string} Renderer-specific CSS class.
 * @override
 */
bootstrap.NavBarRenderer.prototype.getCssClass = function() {
  return bootstrap.NavBarRenderer.CSS_CLASS;
};

/**
 * Returns the default orientation of containers rendered or decorated by this
 * renderer.  This implementation returns {@code HORIZONTAL}.
 * @return {goog.ui.Container.Orientation} Default orientation for containers
 *     created or decorated by this renderer.
 * @override
 */
bootstrap.NavBarRenderer.prototype.getDefaultOrientation = function() {
  return goog.ui.Container.Orientation.HORIZONTAL;
};

/** 
 * <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
 *   <span class="icon-bar"></span>
 *   <span class="icon-bar"></span>
 *   <span class="icon-bar"></span>
 * </button>
 * @return {NavBarToggle}
 */
bootstrap.NavBarRenderer.createToggle = function() {
	return new bootstrap.NavBarToggle( bootstrap.NavBarToggleRenderer.CONTENT, 
										bootstrap.NavBarToggleRenderer.getInstance() );
};
