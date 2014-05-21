# About
closure-bootstrap is a collection of [Closure Library](http://code.google.com/closure/library)
UI controls styled with [Twitter Bootstrap](https://github.com/twitter/bootstrap).

This collection will be increased over time.

# Usage
You need to link `bootstrap.css` to your page. Look at [Twitter Bootstrap page](http://twitter.github.com/bootstrap/) to find out how.

## Buttons
### Rendering:

    var button = new bootstrap.Button('Button Text');
    button.setSize(bootstrap.Button.Size.LARGE);
    button.setKind(bootstrap.Button.Kind.DANGER);
    button.render(goog.dom.getElement('button1'));

### Decorating:
You need to use `button` tag with `class="btn"` like this:

    <button id="button2" class="btn">Button Text</button>
    ...
    var button = goog.ui.decorate(goog.dom.getElement('button2'));

## ComboBox
![ComboBox](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/empty combo box_1.png "Filtering ComboBox")

## Date Pickers
![Date Picker](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/date%20picker_6.png "Date Picker")

## NavBars
![Expanded NavBar](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/narrow%20top%20nav%20bar%20down_4.png "Expanded NavBar")

## TabBars (Tabs and Pills)
### Rendering:

    var tabs = new bootstrap.Tabs(); // or new bootstrap.Pills();
    tabs.addChild(new bootstrap.Tab('tab1'), true);
    tabs.addChild(new bootstrap.Tab('tab2'), true);
    tabs.addChild(new bootstrap.Tab('tab3'), true);
    tabs.setSelectedTabIndex(0);
    tabs.render(goog.dom.getElement('tabs1'));

### Decorating:
You need to add class `tab` to all your tabs:

    <ul id="tabs2" class="tabs">
        <li class="tab active"><a href="#">Home</a></li>
        <li class="tab"><a href="#">Profile</a></li>
        <li class="tab"><a href="#">Messages</a></li>
        <li class="tab"><a href="#">Settings</a></li>
        <li class="tab"><a href="#">Contact</a></li>
    </ul>
    ...
    var tabs = goog.ui.decorate(goog.dom.getElement('tabs2'));



# Tests
## Installation
<!-- The tests use [resemble](https://github.com/kpdecker/node-resemble) to compare screenshots.
You may need to read the [canvas](https://github.com/LearnBoost/node-canvas) instructions if you
have not previously installed `cairo` (GTK 2.X 32bit). -->
`npm install -g phantomjs`
`npm install -g casperjs`

## Running the Tests
<!-- `grunt karma:dev`, `grunt test-raw` or `karma start karma.conf.js` -->
`node_modules\phantomcss\casperjs.bat test\screenshot-test.js`
