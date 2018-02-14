const MongoClient = require('mongodb').MongoClient;
// Collection Name
const collectionName = ""; 
// DB Connection String
const connString = "";

process.on("message", (msg) => {
    console.log("Initialize Child Process", msg)
    const {startCount, endCount} = msg;
    inputStudents(startCount, endCount);
});

function initConnection() {
    return new Promise(function(r, e) {
        MongoClient.connect(connString, function(err, db) {
            if (err) e(err)            
            r(db);
        });
    });
}

function inputStudents(startCount, endCount) {    

    let bulkData = [];
    for(let index = startCount; index <= endCount; index++ ){ 
        var types = ['exam', 'quiz', 'homework', 'homework'];
        let scores = []
        // and each class has 4 grades
        for (j = 0; j < 4; j++) {
            scores.push({'type':types[j],'score':Math.random()*100});
        }
        // there are 500 different classes that they can take
        class_id = Math.floor(Math.random()*501); // get a class id between 0 and 500
        record = {'student_id':index, 'scores':scores, 'class_id':class_id};
        bulkData.push({ insertOne : { "document" : record } })
    }
    initConnection()
        .then((db) => {
            const studentDb = db.db("student");
            const collection =  studentDb.collection(colName)  
            console.log("Bulk Data :", bulkData.length);
            collection.bulkWrite(bulkData, function(err, res) {
                if (err) throw err;
                //console.log("Connected Successfully",res);
                process.send("Saved Successfully");
                db.close();
            });       
        })
        .catch((err) => { console.log("Err :", err) });        
}



