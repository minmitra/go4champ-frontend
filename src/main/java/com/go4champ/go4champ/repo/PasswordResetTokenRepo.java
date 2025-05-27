// Speichern unter: src/main/java/com/go4champ/go4champ/repo/PasswordResetTokenRepo.java

package com.go4champ.go4champ.repo;

import com.go4champ.go4champ.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepo extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByEmail(String email);

    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.email = ?1")
    void deleteByEmail(String email);
}