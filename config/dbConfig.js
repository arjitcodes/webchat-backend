const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log(`Connected wit db successfully`)
    } catch (error) {
        console.log(`Failed to connect with db`)
    }
}


module.exports = dbConnect;