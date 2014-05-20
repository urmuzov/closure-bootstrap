/*
 Require and initialise PhantomCSS module
 Paths are relative to CasperJs directory
 */
var phantomcss = require('../node_modules/phantomcss/phantomcss.js');
//var casper = require('../node_modules/phantomcss/CasperJs/bin/bootstrap.js').create({
var casper = require('../node_modules/phantomcss/CasperJs/modules/casper.js').create({
	viewportSize: {width: 800, height: 600}
});

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
casper.waitForSelector('#comboContainer input', function(){
	phantomcss.screenshot('#comboContainer', 'empty combo box');
});
casper.then(function(){
	casper.sendKeys('#comboContainer input', 'Val');
	phantomcss.screenshot('#comboContainer', 'empty combo box');
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
	casper.waitForSelector('#topNavBar .navbar-collapse.in');
	phantomcss.screenshot('#topNavBar', 'narrow top nav bar down');
});

//
//casper.then(function(){
//	casper.click('#coffee-machine-button');
//
//	// wait for modal to fade-in
//	casper.waitForSelector('#myModal:not([style*="display: none"])',
//		function success(){
//			phantomcss.screenshot('#myModal', 'coffee machine dialog');
//		},
//		function timeout(){
//			casper.test.fail('Should see coffee machine');
//		}
//	);
//});
//
//casper.then(function(){
//	casper.click('#cappuccino-button');
//	phantomcss.screenshot('#myModal', 'cappuccino success');
//});
//
//casper.then(function(){
//	casper.click('#close');
//
//	// wait for modal to fade-out
//	casper.waitForSelector('#myModal[style*="display: none"]',
//		function success(){
//			phantomcss.screenshot('#coffee-machine-wrapper', 'coffee machine close success');
//		},
//		function timeout(){
//			casper.test.fail('Should be able to walk away from the coffee machine');
//		}
//	);
//});

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
