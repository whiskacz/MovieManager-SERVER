const express = require("express");
const userModel = require('../models/models');
const app = express.Router();
const bcrypt = require('bcrypt')

app.post("/create", async (request, response) => {
    const { user, password, email } = request.body;
    
    try {
       
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = new userModel({
            user,
            password: hashedPassword, 
            email
        });
        
        await newUser.save();
        response.status(201).json({ message: "User created successfully" });
    } catch (error) {
        response.status(500).json({ message: "Server error" });
    }
  });

app.post("/login", async (request, response) => {
const { user, password } = request.body;

try {
    
    const foundUser = await userModel.findOne({ user });

    if (foundUser) {
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (isPasswordValid) {
            response.status(200).json({ message: "Authentication successful" });
        } else {
            response.status(401).json({ message: "Invalid password" });
        }
    } else {
        response.status(404).json({ message: "User not found" });
    }
} catch (error) {
    response.status(500).json({ message: "Server error" });
}

});

app.post('/moviesEdit', async (request, response) => {
    const { user, action, movieData } = request.body;

    try {
        const foundUser = await userModel.findOne({ user });

        if (foundUser) {
            if (action === 'add') {
                const existingMovie = foundUser.movies.find(movie => movie.title === movieData.title);
                if (existingMovie) {
                    response.status(400).json({ message: 'Movie with the same title already exists in user\'s collection' });
                } else {
                    foundUser.movies.push(movieData);
                    await foundUser.save();
                    response.status(200).json({ message: 'Movie added to user\'s collection successfully' });
                }
            } else if (action === 'remove') {
                const { id } = movieData;
                foundUser.movies = foundUser.movies.filter(movie => movie.id != id);
                await foundUser.save();
                response.status(200).json({ message: 'Movie removed from user\'s collection successfully' });
            } else {
                response.status(400).json({ message: 'Invalid action' });
            }
        } else {
            response.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        response.status(500).json({ message: 'Server error' });
    }
});



app.get('/movies', async (request, response) => {
    try {
        // Pobranie wszystkich filmów z bazy danych
        const allMovies = await userModel.find({}, 'movies');
        const moviesList = allMovies.map(user => user.movies).flat(); // Pobranie listy filmów ze wszystkich użytkowników

        response.status(200).json(moviesList);
    } catch (error) {
        response.status(500).json({ message: 'Server error' });
    }
});


module.exports = app