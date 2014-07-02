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
Bootstrap-themed implementation of `goog.ui.ComboBox` using Bootstrap's `dropdown-menu`.
![ComboBox](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/empty combo box_1.png "Filtering ComboBox")

### Rendering:
Render into any element:

    var container1 = ;
    // Constructor takes optional Bootstrap modifier classes:
    // 'default', 'primary', 'success', 'info', 'warning', 'danger', 'link'
    var combo = new bootstrap3.ComboBox( 'primary' );
    combo.addItem( 'Value 1', 'val-1' );
    combo.addItem( 'Value 2', 'val-2' );
    combo.setFieldName( 'combo-1' );
    combo.render( goog.dom.getElement('comboContainer') );

    combo.setValue('Disabled');
    combo.setEnabled(false);

### Decorating:
Not yet supported


## Date Picker
A `goog.ui.Component` that provides date validation and a calendar using `goog.ui.DatePicker`.
- If you use `<input type="date">` and the browser provides its own implementation, this class will delegate to the
browser's implementation.
- If you use `<input type="text">` (or the browser does not provide a `date` implementation) this class will provide
a pop-up date picker.

![Date Picker](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/date%20picker_6.png "Date Picker")

### Rendering:
Not yet supported (but would be trivial to implement)

### Decorating:
Provide the following DOM structure to decorate:

    <div id="dateContainer" class="form-group date">
  		<div class="input-group">
    		<span class="input-group-addon glyphicon glyphicon-calendar"></span>
    		<input type="date" name="date" class="form-control" value="2014-05-21" placeholder="dd/mm/yyyy">
    	</div>
    </div>
	<script>
        var container = goog.dom.getElement('dateContainer');
		var datePicker = new bootstrap3.ComboDatePicker();
		datePicker.decorate(container.getElementsByTagName('input')[0]);
	</script>


## Dialog
A modal, draggable `goog.ui.Dialog`.

![Dialog](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/dialog_5.png "Dialog")

### Rendering:
	dialog = new bootstrap3.Dialog('modal-sm');
	dialog.setTitle('Bootstrap-Style Dialog');
	dialog.setContent('<form>' +
					'<div class="form-group">' +
						'<label for="email">Email address</label>' +
						'<input type="email" class="form-control" id="email" placeholder="Enter email">' +
					'</div>' /* ...(or use a soy template) */ );
	dialog.setEscapeToCancel(true);

	var buttons = new goog.ui.Dialog.ButtonSet();
	buttons.addButton( {caption: 'Cancel', key: 'c'}, false, true );
	buttons.addButton( {caption: 'Apply', key: 'a'} );
	buttons.addButton( {caption: 'OK', key: 'o'}, true );
	dialog.setButtonSet( buttons );

	goog.events.listen( dialog, goog.ui.Dialog.EventType.SELECT, function(event) {} );

	dialog.setVisible( true );

### Decorating:
Not yet supported (but would be trivial to implement)

## Time Picker
A subclass of `bootstrap3.ComboBox` that validates times and can optionally be paired with another
time picker to display the time span between the two times.

![Time Picker validation](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/time%20picker%20validation.png "Time Picker validation")
![Time Picker time span](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/time%20picker%20span.png "Time Picker time spans")

### Rendering:

	<div id="startTime"></div>
    <span class="to">to</span>
    <div id="endTime">
    <script>
        // start, end, optional default time
        var timePicker1 = new bootstrap3.TimePicker('09:00', '17:00', '12:15');
        timePicker1.render(goog.dom.getElement('startTime'));
        timePicker1.setFieldName('start');

		// start, end, optional default time and reference time picker
        var timePicker2 = new bootstrap3.TimePicker('09:00', '17:00', '13:00', timePicker1);
        timePicker2.render(goog.dom.getElement('endTime'));
        timePicker2.setFieldName('end');
    </script>

### Decorating:
Not yet supported


## Text Area Form
A simple form with a text area and cancel/save buttons that collapse when not focused

![Text Area Form](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/text%20area%20form.png "Text Area Form")

### Rendering:
Not yet supported

### Decorating:

    <form id="form" class="textarea-form focus">
    	<textarea class="form-control" rows="1" placeholder="Add a note...">The "focus" class forces the form into edit mode</textarea>
    	<div class="form-group">
    		<a class="btn btn-danger"><i class="glyphicon glyphicon-remove"></i> Cancel</a>&nbsp;
    		<a class="btn btn-success"><i class="glyphicon glyphicon-ok"></i> Save</a>
    	</div>
    </form>
    <script>
        var form = new bootstrap3.TextAreaForm(); // 'Value can also be set at run-time');
        form.decorate( goog.dom.getElement('form') );
    </script>

## NavBars
NavBar UI component styled with Twitter Bootstrap.  A toggle button expands/collapses the menu (small screens only).

![Expanded NavBar](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/narrow%20top%20nav%20bar%20down_4.png "Expanded NavBar")

### Rendering:
Not supported

### Decorating:
    <nav id="topNavBar" class="navbar navbar-default">
    	<div class="container">
    		<div class="navbar-header">
    			<button type="button" class="navbar-toggle">
    				<span class="sr-only">Toggle navigation</span>
    				<span class="icon-bar"></span>
    				<span class="icon-bar"></span>
    				<span class="icon-bar"></span>
    			</button>
    			<a class="navbar-brand" href="#">Brand</a>
    		</div>
    		<div class="collapse navbar-collapse">
    			<ul class="nav navbar-nav navbar-right">
    				<li class="active"><a href="#">Home</a></li>
    				<li><a href="#">Link</a></li>
    				<li><a href="#">Link</a></li>
    			</ul>
    		</div>
    	</div>
    </nav>
    <script>
        var topNavBar = new bootstrap3.NavBar();
    	topNavBar.decorate( goog.dom.getElement('topNavBar') );
    </script>


## TabBar (Tabs and Pills)
Tabs and Pills with static and AJAX content panes.  Active tab/pill can be defined by:
 - "active" class attribute
 - # component of URL
 - cookies

![Rendered Tabs](https://raw.githubusercontent.com/nalbion/closure-bootstrap/master/screenshots/rendered%20tabs_9.png "Rendered Tabs")

### Rendering:

    var tabs = new bootstrap3.Tabs(); // or new bootstrap3.Pills();
    tabs.addChild('Profile', '#tabProfile', 'Profile...');
    tabs.addChild('Messages', 'content/messages');
    tabs.addChild('Settings', '#tabSettings', function() { return 'Settings...'; } );
    tabs.setSelectedTabIndex(0);
    tabs.render(goog.dom.getElement('tabs1'));

### Decorating:
You need to add class `tab` to all your tabs:

	<div id="tabs2" class="container">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#tabHome">Home</a></li>
            <li><a href="#tabProfile">Profile</a></li>
            <li><a href="#tabMessages">Messages</a></li>
            <li><a href="#tabSettings">Settings</a></li>
            <li><a href="#tabContact">Contact</a></li>
        </ul>
        <div class="tab-content">
            <div id="tabHome" class="tab-pane fade in active">
                Home...
            </div>
            <div id="tabProfiles" class="tab-pane fade">
                Profiles...
            </div>
            <div id="tabMessages" class="tab-pane fade">
                Messages...
            </div>
            <div id="tabSettings" class="tab-pane fade">
                Settings...
            </div>
            <div id="tabContact" class="tab-pane fade">
                Contact...
            </div>
        </div>
    </div>
    ...
    var tabs = new bootstrap3.Tabs();
    tabs.decorate(goog.dom.getElement('tabs2'));


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
