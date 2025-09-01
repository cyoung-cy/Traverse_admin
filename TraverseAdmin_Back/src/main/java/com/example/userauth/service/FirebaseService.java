package com.example.userauth.service;

import java.time.LocalDateTime;

public interface FirebaseService {
    int countUsersCreatedBetween(LocalDateTime start, LocalDateTime end);
    int countPostsCreatedBetween(LocalDateTime start, LocalDateTime end);
    int countSnapPostsCreatedBetween(LocalDateTime start, LocalDateTime end);
    int countReportsCreatedBetween(LocalDateTime start, LocalDateTime end);
}
