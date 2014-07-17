library(rjson)

data <- read.table("turk/flowers.results",sep="\t",header=TRUE, 
                     stringsAsFactors=FALSE)

responses <- fromJSON(as.character(data$Answer.data))

long.data <- as.data.frame(matrix(ncol = 0, nrow = length(responses)))

for(i in 1:length(responses)) {
  long.data$trialNum[i] <- responses[[i]]$trialNum
  long.data$image[i] <- as.numeric(gsub("[^0-9]","",responses[[i]]$image))
  long.data$response[i] <- responses[[i]]$response
}
  
test.data <- long.data[((nrow(long.data)/2)+1):nrow(long.data),]
test.data <- test.data[with(test.data,order(image)),]


write(paste(test.data$response,collapse=","),
      file = paste("out",Sys.Date(),"csv",sep="."))
