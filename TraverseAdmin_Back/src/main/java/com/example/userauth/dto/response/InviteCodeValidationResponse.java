package com.example.userauth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class InviteCodeValidationResponse {
    @JsonProperty("success")
    private boolean success;

    @JsonProperty("data")
    private Data data;

    @JsonProperty("message")
    private String message;

    public InviteCodeValidationResponse(boolean success, Data data, String message) {
        this.success = success;
        this.data = data;
        this.message = message;
    }

    @lombok.Data
    public static class Data {
        @JsonProperty("is_valid")
        private boolean isValid;

        @JsonProperty("role")
        private String role;

        @JsonProperty("email") // ✅ 추가
        private String email;

        public Data(boolean isValid, String role, String email) {
            this.isValid = isValid;
            this.role = role;
            this.email = email;
        }
        public boolean isValid() {
            return isValid;
        }

        public void setValid(boolean valid) {
            isValid = valid;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
