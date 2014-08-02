var trainRounds = 4;
var numFlowers = 27;

//REALLY want to do this as a file read, don't know how yet
var words = ['hopa','manehowu','wuneho','panamapo','lemipo','howu','nehowu','nemi','wunene','lipapo','poliho','maho','nehomami','powuma','wumaleli',
'lilema','lemaho','lemilipo','lepali','lemi','nemine','pohomali','maholi','wupa','wulepami','nepa','mahomine'];

var properties = [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

// Random order for both images and words
var order = shuffle(range(1,numFlowers));

// Assign same random order to both images and words
var allImgs = order.map(function(elem){return 'flower'+elem;});
var allWords = order.map(function(elem){return words.slice(elem-1,elem);});
var allProperties = order.map(function(elem){return properties.slice(elem-1,elem);});

// Only test half of images in first two blocks

// Set up which images to show on each test trial
var testOrder= shuffle(range(1,allImgs.length));
testWords = testOrder.map(function(elem){return allWords.slice(elem-1,elem);});
testImgs = testOrder.map(function(elem){return allImgs.slice(elem-1,elem);});
testProperties = testOrder.map(function(elem){return allProperties.slice(elem-1,elem);});

// set up which words and images to show on each training trial
var trainWords = [];
var trainImgs = [];
var trainProperties = [];
for(var i = 0; i < trainRounds; i++){
	var trainOrder= shuffle(range(1,allImgs.length));
	trainWords[i] = trainOrder.map(function(elem){return allWords.slice(elem-1,elem);});
	trainImgs[i] = trainOrder.map(function(elem){return allImgs.slice(elem-1,elem);});
	trainProperties[i] = trainOrder.map(function(elem){return allProperties.slice(elem-1,elem);});
}

// some bookkeeping
var round = 1;

//preload images for *speed*
$(allImgs.map(function(elem){return "../images/"+elem+".jpg";})).preload();

//var startTime = 0;

// bookkeeping to know when to switch trial types
var trainTrials = allImgs.length;
var testTrials = allImgs.length;
var totTrials = trainTrials*trainRounds + testTrials

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
  words: allWords,
  images: allImgs,
  properties: allProperties,
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
					  word: testWords[testNum-2],
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
			if(trainProperties[round-1][trainNum] == 1) {
				document.getElementById('feedback').innerHTML = "Correct!";
				document.getElementById('feedback').style.color='green'
			}else {
				document.getElementById('feedback').innerHTML = "InCorrect!";
				document.getElementById('feedback').style.color='red'
			}
		}
		else if(property_no) {
			property = "no";
			if(trainProperties[round-1][trainNum] == 0) {
				document.getElementById('feedback').innerHTML= "Correct!";
				document.getElementById('feedback').style.color='green'
			}else {
				document.getElementById('feedback').innerHTML = "InCorrect!";
				document.getElementById('feedback').style.color='red'
			}
		}


		//Fix error due to switching blocks/ending experiment
		recordTrain = trainNum;
		recordRound = round;
		if(trainNum == 0)
			recordTrain = trainTrials+1;
		else if(trainNum == 1 & round > 1) {
			recordTrain = trainTrials+1;
			recordRound = round-1;
		}

	  data = {
			  trialNum: trialNum-1,
			  image: trim(document.getElementById('train_pic').children[0].src),
			  word: trainWords[recordRound-1][recordTrain-2],
			  judgment: property,
			  property: trainProperties[recordRound-1][recordTrain-2],
			  type: "train"
	  };
	  experiment.data.push(data);

	  //Update progressbar
	  $("#train_progressbar").progressbar("option", "value",
	  	  ($("#train_progressbar").progressbar( "option", "value")+1));
	  $("#test_progressbar").progressbar("option", "value",
	  	  ($("#test_progressbar").progressbar( "option", "value")+1));

  	setTimeout(experiment.blank, 0000);
	},



	/*The work horse of the sequence: what to do on every trial.*/
	next: function() {

		// Update images
		// Training
		if(trainNum != 0){
			document.getElementById('train_pic').children[0].src ="../images/"+trainImgs[round-1][trainNum-1]+".jpg";
		 	document.getElementById('word').innerHTML = trainWords[round-1][trainNum-1];
		 }
		// Testing
		else{
				document.getElementById('test_pic').children[0].src ="../images/"+testImgs[testNum-1]+".jpg";

				if(testProperties[testNum-1] == 1)
					document.getElementById('test_property').innerHTML = "Poisonous";
				else
					document.getElementById('test_property').innerHTML = "Not Poisonous";
		}

		// Which slide to show
		if(trainNum > 0)
			showSlide("training_stage");
		else
			showSlide("testing_stage");

	 	trialNum = trialNum+1;

	 	if(trainNum != 0)
	 		trainNum = trainNum + 1;
	 	else
	 		testNum = testNum + 1;

	 	// Done with training. Do we go back for round 2?
		if(trainNum > trainTrials){
			if(round < trainRounds) {
				trainNum = 1;
				round = round + 1;
				showBreak = 1;
			}
			else {
				trainNum = 0;
				testNum = 1;
				showTestInstructions = 1;
			}
		}

	}
};
