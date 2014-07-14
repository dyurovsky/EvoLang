var trainBlocks = 2;
var testBlocks = 3;

var numFlowers = 27;

//REALLY want to do this as a file read, don't know how yet
var words = ['hopa','manehowu','wuneho','panamapo','lemipo','howu','nehowu','nemi','wunene','lipapo','poliho','maho','nehomami','powuma','wumaleli',
'lilema','lemaho','lemilipo','lepali','lemi','nemine','pohomali','maholi','wupa','wulepami','nepa','mahomine'];

// Random order for both images and words
var order = shuffle(range(1,numFlowers));

// Assign same random order to both images and words
var allImgs = order.map(function(elem){return 'flower'+elem;});
allWords = order.map(function(elem){return words.slice(elem-1,elem);});

// Split into seen and unseen sets
var seenImgs = allImgs.slice(0,Math.ceil(allImgs.length/2));
var seenWords = allWords.slice(0,Math.ceil(allWords.length/2));
var unSeenImgs = allImgs.slice(Math.ceil(allImgs.length/2),allImgs.length);
var unSeenWords = allImgs.slice(Math.ceil(allWords.length/2),allWords.length);

// Only test half of images in first two blocks
var seenTest = shuffle(seenImgs);
var seenTests = [seenTest.slice(0,Math.ceil(seenTest.length/2)),seenTest.slice(Math.ceil(seenTest.length/2),seenTest.length)];
var unSeenTest = shuffle(unSeenImgs);
var unSeenTests = [unSeenTest.slice(0,Math.ceil(unSeenTest.length/2)),unSeenTest.slice(Math.ceil(unSeenTest.length/2),unSeenTest.length)]

// Set up which images to show on each test trial
var tests = [];
for(var i = 0; i < testBlocks - 1; i++){
	tests[i] = shuffle(seenTests[i].concat(unSeenTests[i]))
}
tests[tests.length] = shuffle(seenImgs.concat(unSeenImgs)); // test all images on last block

// set up which words and images to show on each training trial
var trainWords = [];
var trainImgs = [];
for(var i = 0; i < trainBlocks; i++){
	var seenOrder = shuffle(range(1,seenImgs.length));
	trainWords[i] = seenOrder.map(function(elem){return seenWords.slice(elem-1,elem);});
	trainImgs[i] = seenOrder.map(function(elem){return seenImgs.slice(elem-1,elem);});
}

// some bookkeeping
var block = 1;
var round = 1;
var lastBlock = 1;

//preload images for *speed*
$(allImgs.map(function(elem){return "images/"+elem+".jpg";})).preload();

//var startTime = 0;

// bookkeeping to know when to switch trial types
var trainTrials = seenImgs.length * 2;
var testTrials = [tests[0].length,tests[1].length,tests[2].length];
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
  cond: 'flowers',
  data: [],
  seenImgs: seenImgs,
  seenWords: seenWords,
  unseenImgs: unSeenImgs,
  unseenWords: unSeenWords,
  trainImgs: trainImgs,
  trainWords: trainWords,
  testTrials: testTrials,
  words: words,
  images: allImgs,

	/*The function that gets called when the sequence is finished. */
	end: function() {

		experiment.about = $('#about')[0].value;
		experiment.broken = $('#broken')[0].value;

		showSlide("finished"); //Show the finish slide.
	  setTimeout(function() { turk.submit(experiment);}, 1500);
	},


	/*shows a blank screen for 500 ms*/
	blank: function() {
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
	record: function() {

			var response = document.getElementById('response').value;
			if(response == "")
				alert("Please enter a response");
			else{
			  data = {
					  trialNum: trialNum,
					  image: trim(document.getElementById('test_pic').children[0].src),
					  response: response,
					  //rt: endTime - startTime
			  };
			  experiment.data.push(data);

		  	document.getElementById('response').value = "";
		  	setTimeout(experiment.blank, 500);
		  }
	},



	/*The work horse of the sequence: what to do on every trial.*/
	next: function() {

		lastBlock = block;

		// Update images
		// Training
		if(trainNum != 0){
			document.getElementById('train_pic').children[0].src ="images/"+trainImgs[block-1][trainNum-1]+".jpg";
		 	document.getElementById('word').innerHTML = trainWords[block-1][trainNum-1];
		 }
		// Testing
		else{
				document.getElementById('test_pic').children[0].src ="images/"+tests[block-1][testNum-1]+".jpg";
		}

		// Which slide to show
		if(trainNum > 0 | (testNum > testTrials[block-1]))
			showSlide("training_stage");
		else
			showSlide("testing_stage");

		//Update progressbar
		$("#train_progressbar").progressbar("option", "value",
			  ($("#train_progressbar").progressbar( "option", "value")+1));

		$("#test_progressbar").progressbar("option", "value",
			  ($("#test_progressbar").progressbar( "option", "value")+1));

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

		if((testNum <= 1 & lastBlock == block))
			setTimeout(experiment.blank, 5000);

	}
};
