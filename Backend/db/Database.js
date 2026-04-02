const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URL).then((data)=>{
    console.log("Connected to the database");
      console.log("Database Name:", mongoose.connection.name); // 🔥 IMPORTANT  
  })
}

module.exports = connectDatabase;