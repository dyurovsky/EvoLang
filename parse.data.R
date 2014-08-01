library(rjson)

data <- read.table("turk/flowers.results",sep="\t",header=TRUE, 
                     stringsAsFactors=FALSE)

responses <- fromJSON(as.character(data$Answer.data))

## FIXING WORD ORDER RECORDING PROBLEM
images <- as.numeric(gsub("[^0-9]","",
                          fromJSON(as.character(data$Answer.images))))

words <- fromJSON(as.character(data$Answer.words))

seen.images <- as.numeric(gsub("[^0-9]","",
                               fromJSON(as.character(data$Answer.seenImgs))))
seen.words <- fromJSON(as.character(data$Answer.seenWords))

long.data <- as.data.frame(matrix(ncol = 0, nrow = length(responses)))

for(i in 1:length(responses)) {
  long.data$trialNum[i] <- responses[[i]]$trialNum
  long.data$image[i] <- as.numeric(gsub("[^0-9]","",responses[[i]]$image))
  long.data$response[i] <- responses[[i]]$response
}
  
test.data <- long.data[((nrow(long.data)/2)+1):nrow(long.data),]
test.data <- test.data[with(test.data,order(image)),]
test.data$seen <- 0
test.data$seen.word <- ""
test.data$seen[seen.images] <- 1
test.data$seen.word[seen.images] <- seen.words


write(paste(test.data$response,collapse=","),
      file = paste("out",Sys.Date(),"csv",sep="."))
