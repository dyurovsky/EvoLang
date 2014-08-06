#Normalized Levenshtein distance function
normLev.fnc <- function(a, b) {
  drop(adist(a, b) / nchar(attr(adist(a, b, counts = TRUE), "trafos")))
}

#Read in data. Row 1 = input data. Row 2 = participant 1. 
data <- read.table("data/words.csv",sep=",",header=TRUE, row.names=1, 
                   stringsAsFactors=FALSE)

#Segment out just the participants's responses. 
responses <- data[,2:27]

#Assign participants to a list for comparison. 
L1 <- responses[74,]
L2 <- responses[75,]

#Calculate the normLD between the two sets of responses. 
normLD <- diag(normLev.fnc(L1,L2))
mean(normLD[])

