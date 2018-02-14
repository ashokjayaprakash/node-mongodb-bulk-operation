const {fork} = require("child_process");
let counter = 1;

function createProcess(data){
    const worker =  fork("./dbOperation");    
    worker.send(data);    
    worker.on("message", (msg) => {        
        console.log("Worker Message :",counter, msg);
        counter++;
    })
    
}

function bulkSaveUser(records) {
    const singleBatchCount = 10000; // Save 10,000 records per hit
    const noOfProcess = Math.ceil(records/singleBatchCount);
    let data = {};
    console.log("No of Process :", noOfProcess);
    for(let index = 1; index <= noOfProcess; index++) {       
        data.startCount = (index == 1) ? index : (((index - 1) * singleBatchCount) + 1); 
        data.endCount = index * singleBatchCount;
        createProcess(data);
    }
} 


bulkSaveUser(1500000);