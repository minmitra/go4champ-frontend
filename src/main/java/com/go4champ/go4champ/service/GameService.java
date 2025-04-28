package com.go4champ.go4champ.service;
import com.go4champ.go4champ.model.Game;
import com.go4champ.go4champ.repo.GameRepo;
import jakarta.validation.constraints.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class GameService {
    @Autowired
private GameRepo repo;
    public List<Game> getAllGames(){return repo.findAll();};

    public Game createGame(Game game) { return repo.save(game);
    }

public void deleteById(int gameId) { repo.deleteById(gameId);}

    public Game getOneGame(int gameId) {return repo.findById(gameId).orElse(null);
    }
}
