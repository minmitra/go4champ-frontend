package com.go4champ.go4champ.model;
import com.go4champ.go4champ.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class Game {
@Id
private int gameId;
private int points;
//userId oder so muss noch übergeben wereden
private String badge;
private int ranglist;

@OneToOne(mappedBy = "game")
private User user;
public Game(){

    }

 public Game(int gameId, int points, User userId, String badge, int ranglist ){
     this.gameId = gameId;
     this.badge =  badge;
     this.points = points;
     this.ranglist = ranglist;
     this.user =userId;

 }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public int getRanglist() {
        return ranglist;
    }

    public void setRanglist(int ranglist) {
        this.ranglist = ranglist;
    }
}
