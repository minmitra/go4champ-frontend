package com.go4champ.go4champ.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class Gamification {
    @Id
    private String gameId;
@OneToOne
    private User userx;
    private String avatarId;
    private String badges;
    private int points;

    private int rankList;

//leerer Konstruktor für Hibernate
    public Gamification (){

    }
//Konstruktor
    public Gamification(String gameId, String avatarId, String badges, int points, int rankList) {
        this.gameId = gameId;
        this.avatarId = avatarId;
        this.badges = badges;
        this.points = points;
        this.rankList = rankList;
    }
//Getter
    public String getGameId() {
        return gameId;
    }

    public String getAvatarId() {
        return avatarId;
    }

    public String getBadges() {
        return badges;
    }

    public int getRankList() {
        return rankList;
    }

    public int getPoints() {
        return points;
    }
//Setter
    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public void setRankList(int rang) {
        this.rankList = rang;
    }
    public void setAvatarId(String avatarId) {
        this.avatarId = avatarId;
    }

    public void setBadges(String awnser) {
        this.badges = awnser;
    }

    public void setPoints(int points) {
        this.points = points;
    }
}
