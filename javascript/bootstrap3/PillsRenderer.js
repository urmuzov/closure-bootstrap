goog.provide('bootstrap3.PillsRenderer');

goog.require('bootstrap3.TabBarRenderer');
goog.require('goog.ui.registry');

/**
 * @constructor
 * @extends {bootstrap3.TabBarRenderer}
 */
bootstrap3.PillsRenderer = function() {
    bootstrap3.TabBarRenderer.call(this); //, bootstrap3.PillsRenderer.CSS_CLASS);
};
goog.inherits(bootstrap3.PillsRenderer, bootstrap3.TabBarRenderer);
goog.addSingletonGetter(bootstrap3.PillsRenderer);

/**
 * @param {goog.ui.TabBar}
 */
bootstrap3.PillsRenderer.prototype.getClassNames = function(tabBar) {
	var classNames = ['nav', 'nav-pills'];
	if( tabBar.getOrientation() == goog.ui.Container.Orientation.VERTICAL ) {
		classNames.push('nav-stacked');
		classNames.push('col-sm-2');
	}
//	if (!tabBar.isEnabled()) {
//		classNames.push('disabled');
//	}
	return classNames;
};


///**
// * @const
// * @type {string}
// */
//bootstrap3.PillsRenderer.CSS_CLASS = 'nav nav-pills';

//goog.ui.registry.setDecoratorByClassName(bootstrap3.PillsRenderer.CSS_CLASS,
//    function() {
//        return new goog.ui.TabBar(goog.ui.TabBar.Location.TOP, bootstrap3.PillsRenderer.getInstance());
//    });

//goog.ui.registry.setDecoratorByClassName(bootstrap3.PillsRenderer.CSS_CLASS + ' nav-stacked',
//	function() {
//		return new goog.ui.TabBar(goog.ui.TabBar.Location.START, bootstrap3.PillsRenderer.getInstance());
//	});
