goog.provide('bootstrap3.Pills');

goog.require('goog.ui.TabBar');
goog.require('bootstrap3.PillsRenderer');

/**
 * Tab bar UI component styled with Twitter Bootstrap
 * @param {string=} opt_cookieName - eg: 'tab-index'. Provide a name if the last selected tab should be saved in a cookie and #
 * @param {string=} opt_class 'nav-stacked' or 'nav-justified'
 * @param {goog.ui.TabBarRenderer=} opt_renderer Renderer used to render or decorate the container; defaults to {@link bootstrap3.PillsRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {bootstrap3.Tabs}
 */
bootstrap3.Pills = function(opt_cookieName, opt_class, opt_renderer, opt_domHelper) {
	bootstrap3.Tabs.call(this,
					opt_cookieName,
					opt_class,
					opt_renderer || bootstrap3.PillsRenderer.getInstance(),
					opt_domHelper);
};
goog.inherits(bootstrap3.Pills, bootstrap3.Tabs);
