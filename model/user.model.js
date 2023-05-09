const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    name : String,
    email: String,
    gender : String,
    password : String,
    age: Number,
    city: String,
    is_married : Boolean
    

},{
    versionKey: false
})


const UserModal = mongoose.model("user", userSchema)

module.exports = {
    UserModal
}
