package com.go4champ.go4champ.service;

import com.go4champ.go4champ.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.go4champ.go4champ.model.User;
import com.go4champ.go4champ.repo.UserRepo;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepo repo;

  public List<User> getAllUser(){return repo.findAll();}
    public User createUser(User user){return repo.save(user);}

    public void delete(int userId){
      repo.deleteById(userId);
    }
}
