package com.go4champ.go4champ.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.go4champ.go4champ.dto.AiRequest;
import com.go4champ.go4champ.model.Training;
import com.go4champ.go4champ.model.TrainingsPlan;
import com.go4champ.go4champ.model.User;
import com.go4champ.go4champ.repo.UserRepo;
import com.go4champ.go4champ.service.TrainingService;
import com.go4champ.go4champ.service.TrainingsPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private TrainingService trainingService;

    @Autowired
    private TrainingsPlanService trainingsPlanService;


//    @PostMapping("/chat")
//    public ResponseEntity<Map<String, String>> chatWithAI(@RequestBody AiRequest request) {
//        try {
//            // Aktuell eingeloggten Benutzer abrufen
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            String username = authentication.getName();
//
//            // Benutzer aus der Datenbank abrufen
//            User user = userRepository.findByUsername(username).orElse(null);
//            if (user == null) {
//                Map<String, String> errorResponse = new HashMap<>();
//                errorResponse.put("status", "error");
//                errorResponse.put("message", "Benutzer nicht gefunden.");
//                return ResponseEntity.status(404).body(errorResponse);            }
//
//            // Prompt zusammenbauen mit Nutzerdaten
//            String userPrompt = request.getPrompt();
//            String finalPrompt = String.format("""
//            Du bist ein digitaler Fitness-Coach. Du beantwortest ausschließlich Fragen zu den Themen:
//            - Training (z. B. Trainingspläne, Muskelaufbau, Ausdauer)
//            - Ernährung (z. B. Diät, Makronährstoffe, Kalorienbedarf)
//            - Fitnessziele (z. B. Abnehmen, Zunehmen, Zielgewicht erreichen)
//
//            Fragen zu anderen Themen wie Politik, Geschichte, Mathematik oder allgemeinen Wissensfragen beantwortest du **nicht**. Sage in diesem Fall deutlich: "Dazu kann ich als Fitness-Coach keine Antwort geben."
//
//            Der Nutzer hat folgende Daten:
//            Name: %s, Alter: %d, Gewicht: %d kg, Zielgewicht: %d kg.
//
//            Frage: %s
//            """,
//                    user.getName(),
//                    user.getAge(),
//                    user.getWeight(),
//                    user.getWeightGoal(),
//                    userPrompt
//            );
//
//            // Anfrage an Ollama vorbereiten
//            RestTemplate restTemplate = new RestTemplate();
//            String url = "http://localhost:11434/api/generate";
//
//            Map<String, Object> body = new HashMap<>();
//            body.put("model", "llama3");
//            body.put("prompt", finalPrompt);
//            body.put("stream", false);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
//
//            // Anfrage ausführen
//            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
//
////            // Antwort auslesen
////            String answer = (String) response.getBody().get("response");
////            return ResponseEntity.ok(answer);
//            String answer = (String) response.getBody().get("response");
//
//            Map<String, String> jsonResponse = new HashMap<>();
//            jsonResponse.put("answer", answer);
//            jsonResponse.put("status", "success");
//
//            return ResponseEntity.ok(jsonResponse);
//
//        } catch (Exception e) {
//            Map<String, String> errorResponse = new HashMap<>();
//            errorResponse.put("status", "error");
//            errorResponse.put("message", "Fehler bei der KI-Anfrage: " + e.getMessage());
//
//            return ResponseEntity.status(500).body(errorResponse);        }
//    }
//    @PostMapping("/generate-training")
//    public ResponseEntity<Map<String, Object>> generateTrainingPlan(@RequestBody AiRequest request) {
//        try {
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            String username = authentication.getName();
//            User user = userRepository.findByUsername(username).orElse(null);
//
//            if (user == null) {
//                return ResponseEntity.status(404).body(Map.of("error", "Benutzer nicht gefunden"));
//            }
//
//            // Prompt vorbereiten
//            String prompt = """
//            Du bist ein KI-Fitnesscoach und sollst auf Basis dieser Nutzerdaten einen strukturierten Trainingsplan im JSON-Format erzeugen.
//            Gib als Antwort **nur ein JSON-Objekt**,keine Einleitung, kein Text davor oder danach!, mit folgenden Feldern:
//            title, description, difficulty (float), type (true für indoor), duration (in Minuten).
//            Gib **keine zusätzlichen Felder wie 'workouts'** zurück.
//
//            Nutzerdaten:
//            Name: %s, Alter: %d, Gewicht: %d kg, Zielgewicht: %d kg.
//
//            Nutzerfrage: %s
//            """.formatted(user.getName(), user.getAge(), user.getWeight(), user.getWeightGoal(), request.getPrompt());
//
//            RestTemplate restTemplate = new RestTemplate();
//            String url = "http://localhost:11434/api/generate";
//
//            Map<String, Object> body = new HashMap<>();
//            body.put("model", "llama3");
//            body.put("prompt", prompt);
//            body.put("stream", false);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
//            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
//
//            String aiResponse = (String) response.getBody().get("response");
//
//            // JSON aus Antwort extrahieren
//            ObjectMapper mapper = new ObjectMapper();
//            Training training = mapper.readValue(aiResponse, Training.class);
//            training.setUser(user);
//
//            // Speichern
//            trainingService.createTraining(training);
//
//            Map<String, Object> result = new HashMap<>();
//            result.put("message", "Trainingsplan erfolgreich erstellt");
//            result.put("training", training);
//
//            return ResponseEntity.ok(result);
//
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Map.of("error", "Fehler bei der KI-Erstellung: " + e.getMessage()));
//        }
//    }

    @PostMapping("/chat-cloud")
    public ResponseEntity<Map<String, String>> chatWithCloudAI(@RequestBody AiRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Benutzer nicht gefunden."));
            }

            String prompt = String.format("""
            Du bist ein digitaler Fitness-Coach. Du beantwortest ausschließlich Fragen zu den Themen:
            - Training (z. B. Trainingspläne, Muskelaufbau, Ausdauer)
            - Ernährung (z. B. Diät, Makronährstoffe, Kalorienbedarf)
            - Fitnessziele (z. B. Abnehmen, Zunehmen, Zielgewicht erreichen)
            Antworte **nur** auf Fragen zu Ernährung, Fitness, Trainingsplänen und Fitnesszielen.
            Ignoriere alle fachfremden Fragen.
     
            
            Nutzerdaten:
            Name: %s, Alter: %d, Gewicht: %d kg, Zielgewicht: %d kg.
            
            Frage: %s
            """,
                    user.getName(),
                    user.getAge(),
                    user.getWeight(),
                    user.getWeightGoal(),
                    request.getPrompt()
            );

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-api-key", "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");
            headers.set("anthropic-version", "2023-06-01");
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "claude-3-opus-20240229");
            requestBody.put("max_tokens", 1000);
            requestBody.put("messages", List.of(
                    Map.of("role", "user", "content", prompt)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = "https://api.anthropic.com/v1/messages";

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // → Korrekte Extraktion des Antworttexts aus Claude 3
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, String>> contentList = (List<Map<String, String>>) responseBody.get("content");
            String reply = contentList.get(0).get("text");

            return ResponseEntity.ok(Map.of("answer", reply));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Fehler bei Cloud-KI: " + e.getMessage()));
        }
    }





    private String callCloudAI(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", "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"); // Claude API Key
        headers.set("anthropic-version", "2023-06-01");
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "claude-3-opus-20240229");
        requestBody.put("max_tokens", 1000);
        requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        String url = "https://api.anthropic.com/v1/messages";

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        List<Map<String, Object>> contentList = (List<Map<String, Object>>) response.getBody().get("content");
        return (String) contentList.get(0).get("text");
    }

    @PostMapping("/chat-create-plan")
    public ResponseEntity<?> generateAndSavePlan(@RequestBody AiRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Benutzer nicht gefunden"));
            }

            // 🧠 KI-Abfrage (Claude, GPT, etc.)
            String prompt = String.format("""
    Du bist ein Fitness-Coach. Erstelle bitte einen Trainingsplan für den Oberkörper für folgende Person:
    - Name: %s
    - Alter: %d
    - Gewicht: %d kg
    - Zielgewicht: %d kg

    Ziel: Muskelaufbau im Oberkörper.
    Gib Trainingsdauer, Schwierigkeitsgrad, Typ (indoor/outdoor) und eine kurze Beschreibung.
    Antworte bitte klar und strukturiert.
    """,
                    user.getName(),
                    user.getAge(),
                    user.getWeight(),
                    user.getWeightGoal()
            );; // wie vorher
            String aiReply = callCloudAI(prompt); // deine bestehende Methode

            // 🔁 Beispielhafte Umwandlung (du musst hier ggf. Regex oder Parser verwenden)
            Training training = new Training();
            training.setTitle("KI-Plan");
            training.setDescription(aiReply); // oder parse aus aiReply heraus
            training.setDifficulty(1.0f); // Beispielwert, anpassen
            training.setDuration(30);
            training.setType(true);
            training.setUser(user);
            trainingService.createTraining(training);

            // 📦 Plan erstellen
            TrainingsPlan plan = new TrainingsPlan();
            plan.setPlanName("KI-Plan vom " + LocalDate.now());
            plan.setDescription("Automatisch generierter Plan");
            plan.setUser(user);
            plan.addTraining(training); // du kannst mehrere hinzufügen
            trainingsPlanService.createTrainingsPlan(plan, username);

            return ResponseEntity.ok(Map.of("plan", plan.getPlanName(), "antwort", aiReply));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Fehler: " + e.getMessage()));
        }
    }

}
