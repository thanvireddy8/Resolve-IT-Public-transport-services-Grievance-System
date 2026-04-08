package com.resolveit.backend.controller;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.MediaType;
import java.io.IOException;
// import java.util.HashMap; // removed unused import
import java.util.Map;

@RestController
@RequestMapping("/api/ai-chat")
public class AiChatController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final OkHttpClient httpClient = new OkHttpClient();

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> chatWithAi(@RequestBody Map<String, String> payload) throws IOException {
        String userMessage = payload.getOrDefault("message", "");
        if (userMessage.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
        }

        // Build OpenAI request JSON
        String requestBody = "{" +
                "\"model\": \"gpt-3.5-turbo\"," +
                "\"messages\": [{\"role\": \"user\", \"content\": " + quote(userMessage) + "}]}";

        Request request = new Request.Builder()
            .url(OPENAI_API_URL)
            .addHeader("Authorization", "Bearer " + openaiApiKey)
            .addHeader("Content-Type", "application/json")
            .post(okhttp3.RequestBody.create(requestBody, okhttp3.MediaType.parse("application/json")))
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return ResponseEntity.status(response.code()).body(Map.of("error", "OpenAI API error: " + response.message()));
            }
            String responseBody = response.body() != null ? response.body().string() : "";
            // Optionally, parse and extract only the AI's reply
            return ResponseEntity.ok(Map.of("response", responseBody));
        }
    }

    // Helper to JSON-escape user input
    private String quote(String text) {
        return "\"" + text.replace("\"", "\\\"") + "\"";
    }
}
