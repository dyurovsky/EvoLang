# Generate a new generation's words

NUM.WORDS <- 27
NUM.CVS <- 2:4

cvs <- c("ho","pa","ma","ne","wu","po","le","mi","li")
words <- NULL

for(i in 1:NUM.WORDS) {
  num.cvs <- sample(NUM.CVS,1)
  words[i] <- paste(sample(cvs,num.cvs,replace=TRUE),collapse="")
}

write(paste('\'',paste(words,collapse="\', \'"),'\'',sep=""),
      file = paste("words",Sys.Date(),"csv",sep="."))
