var trainBlocks = 2;
var numFlowers = 27;

//REALLY want to do this as a file read, don't know how yet
var words = ['poli','mapopahe','lihopa','pohilo','wumile','mipo','mili','mahowuli','neli','pawu','hopili','lemawu','powuma','lineliwu','wulinema',
	'nepomali','mapopa','wule','nepo','lelipo','palihopa','howuma','mima','pane','polelipo','neneli','popa'];

var properties = [0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0];

var propertyInds = [3,4,5,12,13,14,21,22,23];
var nonPropertyInds = [0,1,2,6,7,8,9,10,11,15,16,17,18,19,23,24,25,26];

//Want to set it up so that property flowers get divided into four sets:
//1. seen tested first (3), seen tested second (2)
//2. unSeen tested first (2), unSeen test second (2)

//NonProperty flowers get divided into four sets:
//1. seen tested first (4), seen tested second (5)
//2. unSeen tested first (5), unSeen test second (4)

var propertyOrder = shuffle(propertyInds);
var nonPropertyOrder = shuffle(nonPropertyInds);

var seenPositive1 = propertyOrder.slice(0,3);
var seenPositive2 = propertyOrder.slice(3,5);
var unSeenPositive1 = propertyOrder.slice(5,7);
var unSeenPositive2 = propertyOrder.slice(7,9);

var seenNegative1 = nonPropertyOrder.slice(0,4);
var seenNegative2 = nonPropertyOrder.slice(4,9);
var unSeenNegative1 = nonPropertyOrder.slice(9,14);
var unSeenNegative2 = nonPropertyOrder.slice(14,18);

var seenProperties1 = seenPositive1.concat(seenNegative1)
var seenProperties2 = seenPositive2.concat(seenNegative2)
var unSeenProperties1 = unSeenPositive1.concat(unSeenNegative1)
var unSeenProperties2 = unSeenPositive2.concat(unSeenNegative2)

var seenImgs1 = seenProperties1.map(function(elem){return 'flower'+(elem+1);});
var seenImgs2 = seenProperties2.map(function(elem){return 'flower'+(elem+1);});
var unSeenImgs1 = unSeenProperties1.map(function(elem){return 'flower'+(elem+1);});
var unSeenImgs2 = unSeenProperties2.map(function(elem){return 'flower'+(elem+1);});

var seenWords1 = seenProperties1.map(function(elem){return words.slice(elem,elem+1);});
var seenWords2 = seenProperties2.map(function(elem){return words.slice(elem,elem+1);});
var unSeenWords1 = unSeenProperties1.map(function(elem){return words.slice(elem,elem+1);});
var unSeenWords2 = unSeenProperties2.map(function(elem){return words.slice(elem,elem+1);});

// Set up which images to show on each test trial
var testOrders = [];
var testWords = [];
var testImgs = [];
var testProperties = [];
testOrders[0] = shuffle(range(1,seenImgs1.length+unSeenImgs1.length));
testImgs[0] = testOrders[0].map(function(elem){return (seenImgs1.concat(unSeenImgs1)).slice(elem-1,elem);});
testWords[0] = testOrders[0].map(function(elem){return (seenWords1.concat(unSeenWords1)).slice(elem-1,elem);});
testProperties[0] = testOrders[0].map(function(elem){return properties[(seenProperties1.concat(unSeenProperties1)).slice(elem-1,elem)];});

testOrders[1] = shuffle(range(1,seenImgs2.length+unSeenImgs2.length));
testImgs[1] = testOrders[1].map(function(elem){return (seenImgs2.concat(unSeenImgs2)).slice(elem-1,elem);});
testWords[1] = testOrders[1].map(function(elem){return (seenWords2.concat(unSeenWords2)).slice(elem-1,elem);});
testProperties[1] = testOrders[1].map(function(elem){return properties[(seenProperties2.concat(unSeenProperties2)).slice(elem-1,elem)];});

testOrders[2] = shuffle(range(1,seenImgs1.length+seenImgs2.length+unSeenImgs1.length+unSeenImgs2.length));
testImgs[2] = testOrders[2].map(function(elem){
	return (seenImgs1.concat(seenImgs2.concat(unSeenImgs1.concat(unSeenImgs2)))).slice(elem-1,elem);});
testWords[2] = testOrders[2].map(function(elem){
	return (seenWords1.concat(seenWords2.concat(unSeenWords1.concat(unSeenWords2)))).slice(elem-1,elem);});
testProperties[2] = testOrders[2].map(function(elem){
	return properties[(seenProperties1.concat(seenProperties2.concat(unSeenProperties1.concat(unSeenProperties2)))).slice(elem-1,elem)];});

// Set up which images to show on each train trial
var trainOrders = [];
var trainWords = [];
var trainImgs = [];
var trainProperties = [];
trainOrders[0] = shuffle(range(1,seenImgs1.length+seenImgs2.length));
trainImgs[0] = trainOrders[0].map(function(elem){return (seenImgs1.concat(seenImgs2)).slice(elem-1,elem);});
trainWords[0] = trainOrders[0].map(function(elem){return (seenWords1.concat(seenWords2)).slice(elem-1,elem);});
trainProperties[0] = trainOrders[0].map(function(elem){return properties[(seenProperties1.concat(seenProperties2)).slice(elem-1,elem)];});

trainOrders[1] = shuffle(range(1,seenImgs1.length+seenImgs2.length));
trainImgs[1] = trainOrders[1].map(function(elem){return (seenImgs1.concat(seenImgs2)).slice(elem-1,elem);});
trainWords[1] = trainOrders[1].map(function(elem){return (seenWords1.concat(seenWords2)).slice(elem-1,elem);});
trainProperties[1] = trainOrders[1].map(function(elem){return properties[(seenProperties1.concat(seenProperties2)).slice(elem-1,elem)];});

// some bookkeeping
var block = 1;
var round = 1;
var lastBlock = 1;

// bookkeeping to know when to switch trial types
var trainTrials = (seenImgs1.length + seenImgs2.length) * 2;
var testTrials = [testImgs[0].length,testImgs[1].length,testImgs[2].length];
var totTrials = trainTrials*trainBlocks+ // training trials
								testTrials[0] + testTrials[1] + testTrials[2]; // test trials

var trainNum = 1;
var testNum = 0;
var trialNum = 1;

// flags for showing special slides
var showTestInstructions = 0;
var showBreak = 0;

// set up progress bars
$("#train_progressbar").progressbar();
$("#train_progressbar").progressbar( "option", "max", totTrials);
$("#test_progressbar").progressbar();
$("#test_progressbar").progressbar( "option", "max", totTrials);

showSlide("consent"); //Show instruction slide

// the Main Experiment
var experiment = {
  cond: 'experimental',
  data: [],
  words: words,
  properties: properties,
  trainWords: trainWords,
  trainImgs: trainImgs,
  trainProperties: trainProperties,
  testImgs: testImgs,
  testWords: testWords,
  testProperties: testProperties,

	/*The function that gets called when the sequence is finished. */
	end: function() {

		experiment.about = $('#about')[0].value;
		experiment.broken = $('#broken')[0].value;
		experiment.age = $('#age')[0].value;
		experiment.sex = $('#sex')[0].value;
		experiment.english = $('#english')[0].value;

		showSlide("finished"); //Show the finish slide.
	  setTimeout(function() { turk.submit(experiment);}, 1500);
	},


	/*shows a blank screen for 500 ms*/
	blank: function() {

		document.getElementById('yes').checked = false;
		document.getElementById('no').checked = false;

		document.getElementById('response').value = "";
		document.getElementById('feedback').innerHTML = "";

		showSlide("blankSlide");

		// We're done!
		if(trialNum > totTrials)
				setTimeout(showSlide("qanda"),500);

		// Starting Testing
		else if(showTestInstructions) {
			showTestInstructions = 0;
			setTimeout(showSlide("testInstructions",500));
		}

		// Take a break between blocks
		else if(showBreak) {
			showBreak = 0;
			setTimeout(showSlide("break",500));
		}

		else
			setTimeout(experiment.next, 500);
	},

	// Collect Data
	record_test: function() {

			var response = document.getElementById('response').value;
			if(response == "")
				alert("Please enter a response");
			else{
			  data = {
					  trialNum: trialNum-1,
					  image: trim(document.getElementById('test_pic').children[0].src),
					  property: document.getElementById('test_property').innerHTML,
					  response: response,
					  type: "test"
			  };
			  experiment.data.push(data);

			  //Update progressbar
			  $("#train_progressbar").progressbar("option", "value",
			  	  ($("#train_progressbar").progressbar( "option", "value")+1));
			  $("#test_progressbar").progressbar("option", "value",
			  	  ($("#test_progressbar").progressbar( "option", "value")+1));

		  	setTimeout(experiment.blank, 500);
		  }
	},

	record_train: function() {

		var property_yes = document.getElementById('yes').checked;
		var property_no = document.getElementById('no').checked;

		var property = "";
		if(property_yes) {
			property = "yes";
			if(trainProperties[round-1][trainNum-2] == 1) {
				document.getElementById('feedback').innerHTML = "Correct!";
				document.getElementById('feedback').style.color='green'
			}else {
				document.getElementById('feedback').innerHTML = "Incorrect!";
				document.getElementById('feedback').style.color='red'
			}
		}
		else if(property_no) {
			property = "no";
			if(trainProperties[round-1][trainNum-2] == 0) {
				document.getElementById('feedback').innerHTML= "Correct!";
				document.getElementById('feedback').style.color='green'
			}else {
				document.getElementById('feedback').innerHTML = "Incorrect!";
				document.getElementById('feedback').style.color='red'
			}
		}

	  data = {
			  trialNum: trialNum-1,
			  image: trim(document.getElementById('train_pic').children[0].src),
			  word: document.getElementById('feedback').innerHTML,
			  judgment: property,
			  type: "train"
	  };
	  experiment.data.push(data);

	  //Update progressbar
	  $("#train_progressbar").progressbar("option", "value",
	  	  ($("#train_progressbar").progressbar( "option", "value")+1));
	  $("#test_progressbar").progressbar("option", "value",
	  	  ($("#test_progressbar").progressbar( "option", "value")+1));

  	setTimeout(experiment.blank, 3000);
	},



	/*The work horse of the sequence: what to do on every trial.*/
	next: function() {
		lastBlock = block;

		// Update images
		// Training
		if(trainNum != 0){
			document.getElementById('train_pic').children[0].src ="../images/"+trainImgs[block-1][trainNum-1]+".jpg";
		 	document.getElementById('word').innerHTML = trainWords[block-1][trainNum-1];
		 }
		// Testing
		else{
				document.getElementById('test_pic').children[0].src ="../images/"+testImgs[block-1][testNum-1]+".jpg";

				if(testProperties[block-1][testNum-1] == 1)
					document.getElementById('test_property').innerHTML = "Spiky";
				else
					document.getElementById('test_property').innerHTML = "Not Spiky";
		}

		// Which slide to show
		if(trainNum > 0 | (testNum > testTrials[block-1]))
			showSlide("training_stage");
		else
			showSlide("testing_stage");

	 	trialNum = trialNum+1;

	 	if(trainNum != 0)
	 		trainNum = trainNum + 1;
	 	else
	 		testNum = testNum + 1;

 	 	// Done with training. Do we go back for round 2?
 		if(trainNum > (trainTrials/2)){
 			if(round == 2) {
 				trainNum = 0;
 				testNum = 1;
 				round = 1;
 				showTestInstructions = 1;
 			}
 			else {
 				round = 2;
 				trainNum = 1;
 			}
 		}
 		else if(testNum > testTrials[block-1]){ // Done testing

 			//still training
 			if(block < trainBlocks) {
 				trainNum = 1;
 				round = 1;
 				testNum = 0;
 			}
 			else{ //final test
 				testNum = 1 ;
 			}

 			block = block + 1;

 			showBreak = 1;
 		}
	}
};
