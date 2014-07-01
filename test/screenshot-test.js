/*
 Require and initialise PhantomCSS module
 Paths are relative to CasperJs directory
 */
var phantomcss = require('../node_modules/phantomcss/phantomcss.js');
//var casper = require('../node_modules/phantomcss/CasperJs/bin/bootstrap.js').create({
var casper = require('../node_modules/phantomcss/CasperJs/modules/casper.js').create({
	viewportSize: {width: 800, height: 600}
});
var x = require('../node_modules/phantomcss/CasperJs/modules/casper.js').selectXPath;

phantomcss.init({
  screenshotRoot: './screenshots',
  failedComparisonsRoot: './test/failures',
//  casper: specific_instance_of_casper,
  libraryRoot: './node_modules/phantomcss',
//  fileNameGetter: function overide_file_naming(){},
  onFail: function(test){ console.log(test.filename, test.mismatch); },
  onPass: function(test){ console.log(test.filename); },
  onTimeout: function(){ console.log(test.filename); },
  onComplete: function(allTests, noOfFails, noOfErrors){
    allTests.forEach(function(test){
      if(test.fail){
        console.log(test.filename, test.mismatch);
      }
    });
  },
//  viewportSize: {width: 800, height: 600},
//  hideElements: '#thing.selector',
  addLabelToFailedImage: true,
  outputSettings: {
    errorColor: {
      red: 255,
      green: 255,
      blue: 0
    },
    errorType: 'movement',
    transparency: 0.3
  }
});


// ========== Combo Box ==========
casper.start( './test/ComboBox_test.html' );
//casper.viewport(800,800);
casper.waitForSelector('#comboContainer1 input', function(){
	phantomcss.screenshot('#comboContainer1', 'empty combo box');
}, 5001);
casper.then(function(){
	casper.sendKeys('#comboContainer1 input', 'Val');
	phantomcss.screenshot('#comboContainer1', 'empty combo box');
});

// ========== Nav Bar ==========
casper.thenOpen( './test/NavBar_test.html' );
//casper.viewport(800, 800);
casper.then(function(){
	this.viewport(800,400);
	phantomcss.screenshot('#topNavBar', 'wide top nav bar');
});
casper.then(function(){
	this.viewport(400, 400);
	// nav bar should collapse by default
//	casper.click('#topNavBar .navbar-toggle');
//	casper.waitForSelector('#topNavBar .navbar-toggle.collapsed');
	phantomcss.screenshot('#topNavBar', 'narrow top nav bar up');
});
casper.then(function(){
	casper.click('#topNavBar .navbar-toggle');
	casper.waitForSelector('#topNavBar .navbar-collapse.in', function() {
		phantomcss.screenshot('#topNavBar', 'narrow top nav bar down');
	}, function() {
		casper.warn('timeout waiting for narrow top nav bar down');
		phantomcss.screenshot('#topNavBar', 'narrow top nav bar down');
	}, 5002);
});

// ========== Combo Date Picker ==========
casper.thenOpen( './test/ComboDatePicker_test.html' );
casper.then(function(){
	this.viewport(400,400);
	phantomcss.screenshot('#comboContainer1', 'date provided');
});
	//casper.then(function(){
	//	casper.click('#comboContainer1 .form-control #picker'); //::-webkit-calendar-picker-indicator');
	//	phantomcss.screenshot('#comboContainer1', 'built-in date control');
	//});
casper.then(function(){
	casper.waitForSelector('div#comboContainer2 div input', function() {
//		casper.click(x('//div[@id="comboContainer2"]'));
//		casper.click(x('//div[@id="comboContainer2"]/div'));
		casper.click(x('//div[@id="comboContainer2"]/div/input[@type="text"]')); // # input[type="text"]');
		phantomcss.screenshot('#comboContainer2', 'date picker');
	}, function() {
		casper.warn('timeout waiting for "#comboContainer2 div input" for date picker');
		phantomcss.screenshot('#comboContainer2', 'date picker');
	}, 5003);
});
casper.then(function(){
//	casper.waitForSelector('div#comboContainer2');
//	casper.waitForSelector('#comboContainer2 div');
//	casper.waitForSelector('#comboContainer2 div input');
//	casper.waitForSelector('#comboContainer2 input');
//	casper.waitForSelector('#comboContainer2 input[type="text"]');

	var selector = 'div#comboContainer2 div input.form-control';
	casper.waitForSelector(selector, function() {
		var input = x('//div[@id="comboContainer2"]/div/input[@type="text"]');
		document.querySelector('div#comboContainer2 div input.form-control[type="text"]');
		casper.sendKeys(selector, '32/03/2015');
		phantomcss.screenshot('#comboContainer2', 'date validation');
	}, function() {
		casper.warn('timeout waiting for "#comboContainer2 div input.form-control" for date validation');
		phantomcss.screenshot('#comboContainer2', 'date validation');
	}, 5004);
});

// ========== Text Area Form ==========

// ========== Dialog ==========
casper.thenOpen( './test/Dialog_test.html' );
casper.then(function(){
	this.viewport(800,370);
	casper.waitForSelector('#:0Label', function() {
		phantomcss.screenshot('.container', 'dialog');
	}, function() {
		casper.warn('timeout waiting for dialog');
		phantomcss.screenshot('.container', 'dialog');
	}, 5005);
});

// ========== Tabs and Pills ==========
casper.thenOpen( './test/Tabs_test.html' );
casper.then(function(){
	this.viewport(400,370);
	casper.waitForSelector('#tab_rPane1', function() {
		casper.click('#tab_rPane1 a');
		phantomcss.screenshot('#r-tabs', 'rendered tabs');
	}, function() {
		casper.warn('timeout waiting for rendered tabs');
		phantomcss.screenshot('#r-tabs', 'rendered tabs');
	}, 5006);
});

// ========== Time Picker ==========
casper.thenOpen( './test/TimePicker_test.html' );
casper.then(function(){
	this.viewport(400,300);
	casper.waitForSelector(
//							x('//*[@id="startTime"]/div/input'),
							'#startTime', // div input',
							function() {
//		casper.sendKeys(x('//*[@id="startTime"]/div/input'), //'#startTime div input',
//						'1200');
		phantomcss.screenshot('#startTime', 'time validation');
	}, function() {
		casper.warn('timeout waiting for start time picker');
		phantomcss.screenshot('#startTime', 'time validation');
	}, 5007);
});

// ========== Compare Screenshots ==========
casper.then( function now_check_the_screenshots(){
	// compare screenshots
	phantomcss.compareAll();
});

casper.then( function end_it(){
	casper.test.done();
});

/*
 Casper runs tests
 */
casper.run(function(){
	console.log('\nTHE END.');
	phantom.exit(phantomcss.getExitStatus());
});
