package com.go4champ.go4champ.controller;

import com.go4champ.go4champ.dto.AiRequest;
import com.go4champ.go4champ.model.User;
import com.go4champ.go4champ.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private UserRepo userRepository;

    @PostMapping("/chat")
    public ResponseEntity<String> chatWithAI(@RequestBody AiRequest request) {
        try {
            // Aktuell eingeloggten Benutzer abrufen
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Benutzer aus der Datenbank abrufen
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body("Benutzer nicht gefunden.");
            }

            // Prompt zusammenbauen mit Nutzerdaten
            String userPrompt = request.getPrompt();
            String finalPrompt = String.format("""
                Der Nutzer hat folgende Daten:
                Name: %s, Alter: %d, Gewicht: %d kg, Zielgewicht: %d kg.
                Frage: %s
                """,
                    user.getName(),
                    user.getAge(),
                    user.getWeight(),
                    user.getWeightGoal(),
                    userPrompt
            );

            // Anfrage an Ollama vorbereiten
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:11434/api/generate";

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama3");
            body.put("prompt", finalPrompt);
            body.put("stream", false);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // Anfrage ausführen
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // Antwort auslesen
            String answer = (String) response.getBody().get("response");
            return ResponseEntity.ok(answer);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Fehler bei der KI-Anfrage: " + e.getMessage());
        }
    }
}
