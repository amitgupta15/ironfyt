#!/bin/bash
for file in logs/*
do 
  mongoimport --host Cluster0-shard-0/cluster0-shard-00-00-tsa6c.mongodb.net:27017,cluster0-shard-00-01-tsa6c.mongodb.net:27017,cluster0-shard-00-02-tsa6c.mongodb.net:27017 --ssl --username admin --password admin --authenticationDatabase admin --db ironfyt --collection logs --type json --file $file
done


# for file in users/*
# do 
#   mongoimport --host Cluster0-shard-0/cluster0-shard-00-00-tsa6c.mongodb.net:27017,cluster0-shard-00-01-tsa6c.mongodb.net:27017,cluster0-shard-00-02-tsa6c.mongodb.net:27017 --ssl --username admin --password admin --authenticationDatabase admin --db ironfyt --collection users --type json --file $file
# done

# for file in workouts/*
# do 
#   mongoimport --host Cluster0-shard-0/cluster0-shard-00-00-tsa6c.mongodb.net:27017,cluster0-shard-00-01-tsa6c.mongodb.net:27017,cluster0-shard-00-02-tsa6c.mongodb.net:27017 --ssl --username admin --password admin --authenticationDatabase admin --db ironfyt --collection workouts --type json --file $file
# done