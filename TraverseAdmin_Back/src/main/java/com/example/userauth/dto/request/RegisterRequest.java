package com.example.userauth.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true) // ✅ JSON에서 알 수 없는 필드는 무시
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String invite_code;  //inviteCode인데 일단authCode로 a
    private boolean email_certification = true;
    @JsonProperty("password_confirm") // ✅ JSON 필드명과 Java 필드명을 매핑
    private String  password_confirm; // Optional로 처리

     public boolean isEmail_certification() {
        return email_certification;
    }

    public void setEmail_certification(boolean email_certification) {
        this.email_certification = email_certification;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }



    public String  getPassword_confirm() {
       return password_confirm;
    }

    public void setPassword_confirm(String  password_confirm) {
        this.password_confirm = password_confirm;
    }

    public String getInvite_code() {
        return invite_code;
    }

    public void setInvite_code(String invite_code) {
        this.invite_code = invite_code;
    }

    // Getters and Setters
}

