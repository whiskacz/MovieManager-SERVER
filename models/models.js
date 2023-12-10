const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    user: String,
    password: String,
    email: String,
}, { collection: 'users' },)

const User = mongoose.model("User", UserSchema)

module.exports = User