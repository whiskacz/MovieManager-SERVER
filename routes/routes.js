const express = require("express");
const userModel = require('../models/models');
const app = express.Router();
const bcrypt = require('bcrypt')

app.post("/create", async (request, response) => {
    const { user, password, email } = request.body;
    
    try {
        // Hashowanie hasła przed zapisaniem do bazy danych
        const hashedPassword = await bcrypt.hash(password, 10); // 10 to ilość rund haszowania

        const newUser = new userModel({
            user,
            password: hashedPassword, // Zapisanie zahashowanego hasła
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
        // Wyszukanie użytkownika po nazwie użytkownika (lub innym unikalnym identyfikatorze)
        const foundUser = await userModel.findOne({ user });

        if (foundUser) {
            // Porównanie hasła wprowadzonego przez użytkownika z zahashowanym hasłem z bazy danych
            const isPasswordValid = await bcrypt.compare(password, foundUser.password);

            if (isPasswordValid) {
                // Użytkownik został uwierzytelniony poprawnie
                response.status(200).json({ message: "Authentication successful" });
            } else {
                // Nieprawidłowe hasło
                response.status(401).json({ message: "Invalid password" });
            }
        } else {
            // Użytkownik nie istnieje
            response.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        response.status(500).json({ message: "Server error" });
    }

    app.post("/moviesEdit", async (request, response) => {
        const { userId, action, movieId } = request.body;
    
        try {
            // Znajdź użytkownika po ID
            const foundUser = await userModel.findById(userId);
    
            if (foundUser) {
                if (action === "add") {
                    // Dodaj identyfikator filmu do listy filmów użytkownika
                    foundUser.movies.push(movieId);
                    response.status(200).json({ message: "Movie added to user's collection successfully" });
                } else if (action === "remove") {
                    // Usuń identyfikator filmu z listy filmów użytkownika
                    foundUser.movies = foundUser.movies.filter(id => id !== movieId);
                    response.status(200).json({ message: "Movie removed from user's collection successfully" });
                } else {
                    response.status(400).json({ message: "Invalid action" });
                }
    
                // Zapisz zmiany w bazie danych
                await foundUser.save();
            } else {
                response.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            response.status(500).json({ message: "Server error" });
        }
    });
});

module.exports = app