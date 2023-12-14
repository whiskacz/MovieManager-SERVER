const mongoose = require("mongoose")

const MovieSchema = new mongoose.Schema({
    id: String,
    title: String,
    popularity: String,
    poster_path: String,
    homepage: String,
    overview: String,
    release_date: String
})

const UserSchema = new mongoose.Schema({
    user: String,
    password: String,
    email: String,
    movies: [MovieSchema]
}, { collection: 'users' },)

const User = mongoose.model("User", UserSchema)

module.exports = User