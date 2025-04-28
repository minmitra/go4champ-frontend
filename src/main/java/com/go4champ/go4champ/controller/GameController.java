package com.go4champ.go4champ.controller;

import com.go4champ.go4champ.model.Game;
import com.go4champ.go4champ.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "GameController", description = "API für Game")
@RestController
public class GameController {
    @Autowired
    private GameService service;

    @Operation(summary = "Alle Games kriegen")
    @GetMapping ("/allGames")
    public ResponseEntity<List<Game>> getAllGames(){ return new ResponseEntity<>(service.getAllGames(), HttpStatus.OK);}

    @Operation(summary = "Getting a Game")
    @GetMapping("/getGame/{gameId}")
    public ResponseEntity<Game> getOneGame(@PathVariable int gameId){
        Game game = service.getOneGame(gameId);
                if (game != null)
                    return new ResponseEntity<>(game, HttpStatus.OK);
                else
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }
    @Operation(summary = "Create new Game")
    @PostMapping("/newGame")
    public ResponseEntity<Game> createGame(@RequestBody Game game) {
        Game newGame = service.createGame(game);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @Operation (summary = "delete Game")
    @DeleteMapping("/game/{gameId}")
    public ResponseEntity<Void> deleteGame(@PathVariable int gameId){
       service.deleteById(gameId);
       return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }




    }

