library(rjson)
library(dplyr)

# Read in table
data <- read.table("results.csv",sep=",",header=TRUE, 
                     stringsAsFactors=FALSE)

responses <- fromJSON(as.character(data$Answer.1))

# Other stored variables
# words <- fromJSON(as.character(data$Answer.2))
# properties <- fromJSON(as.character(data$Answer.3))
# train.words <- fromJSON(as.character(data$Answer.4))
# train.images <- fromJSON(as.character(data$Answer.5))
# train.properties <- fromJSON(as.character(data$Answer.6))
# test.images <- fromJSON(as.character(data$Answer.7))
# test.words <- fromJSON(as.character(data$Answer.8))
# test.properties <-fromJSON(as.character(data$Answer.9))

# Grab trial-level information
long.data <- as.data.frame(matrix(ncol = 0, nrow = length(responses)))
for(i in 1:length(responses)) {
  long.data$type[i] <-responses[[i]]$type
  long.data$trialNum[i] <- responses[[i]]$trialNum
  long.data$image[i] <- as.numeric(gsub("[^0-9]","",responses[[i]]$image))
  
  if(long.data$type[i] == "train") {
    long.data$word[i] <- responses[[i]]$word
    long.data$judgment[i] <- responses[[i]]$judgment
    long.data$response[i] <- NA
    long.data$property[i] <- NA
  }
  else {
   long.data$response[i] <- responses[[i]]$response
   long.data$property[i] <- responses[[i]]$property
   long.data$word[i] <- NA
   long.data$judgment[i] <- NA
  } 
}

# Filter down to training data
train.data <- long.data %>%
  filter(type == "train") %>%
  mutate(correct = (word=="Correct!"),
         block = (trialNum > 28) + 1,
         judgment = judgment == "yes") %>%
  arrange(block,image)
train.data$round <- 1
train.data$round[seq(2,nrow(train.data),2)] <- 2

train.data <- train.data %>%
  select(block,round,image,judgment,correct) %>%
  arrange(block,round,image)


# Filter down to test data
test.data <- long.data %>%
  filter(type == "test",trialNum >= 84) %>%
  arrange(image) %>%
  select(image,response,property)
  
# Write words for new participant
write(paste("\"",paste(test.data$response,collapse="\",\""),"\"",sep=""),
      file = paste("out",Sys.Date(),"csv",sep="."))
