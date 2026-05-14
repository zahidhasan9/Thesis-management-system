require("dotenv").config()

const app = require("./app")
const mongoose = require("mongoose")
const cleanupInactiveUsers = require("./utils/cleanupInactiveUsers");

mongoose.connect(process.env.MONGO_URI)
.then(async()=>{

 console.log("DB Connected")

 await cleanupInactiveUsers();

  setInterval(() => {
    cleanupInactiveUsers();
  }, 24 * 60 * 60 * 1000);

 app.listen(5000,()=>{
  console.log("Server running on port 5000")
 })

})