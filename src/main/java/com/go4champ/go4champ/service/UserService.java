package com.go4champ.go4champ.service;

import com.go4champ.go4champ.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.go4champ.go4champ.model.User;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

    public List<User> getAllUser() {
        return repo.findAll();
    }

    public User getUserById(String username) {
        return repo.findById(username).orElse(null);
    }

    public User createUser(User user) {
        return repo.save(user);
    }

    public void delete(String username) {
        // Nutzer holen
        User user = getUserById(username);
        if (user != null && user.getGame() != null) {
            // Game-Beziehung auflösen
            user.setGame(null);
            // Speichern vor dem Löschen
            repo.save(user);
        }
        repo.deleteById(username);
    }

    // Neue Methode zur Aktualisierung eines Benutzers
    public User updateUser(User user) {
        return repo.save(user);
    }
}