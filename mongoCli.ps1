docker exec -ti collabr_mongo_1 mongosh -u root -p root

//use docs
//db.docs.insertOne({title: "One", content: ""})

//use collabr
//db.createUser({ user: "collabrApp", pwd: "collabrAppPass", roles: [ "readWrite" ] })