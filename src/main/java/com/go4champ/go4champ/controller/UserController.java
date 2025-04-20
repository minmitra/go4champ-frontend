package com.go4champ.go4champ.controller;

import com.go4champ.go4champ.model.User;
import com.go4champ.go4champ.service.UserService;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
@Tag(name = "UserController", description = "Api für User")
@RestController
//@RequestMapping Optional für URL links
public class UserController {
    @Autowired
    private UserService service;
        @Operation(summary = "Gibt alle Produckte zurück")
    @GetMapping("/allUsers")
    public ResponseEntity<List<User>> getAllUser(){
        return new ResponseEntity<>(service.getAllUser(), HttpStatus.OK);
    }
    @Operation(summary = "Erstellt neuen User")
    @PostMapping("/newUser")
    public ResponseEntity<User> createUser(@RequestBody User user){
        User newUser = service.createUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }
    @Operation(summary = "Löscht einen bestimmten User")
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable int userId){
        service.delete(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
