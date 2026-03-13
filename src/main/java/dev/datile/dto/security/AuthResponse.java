package dev.datile.dto.security;

public class AuthResponse {
    public String token;

    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
