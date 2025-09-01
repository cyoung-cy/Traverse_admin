package com.example.userauth.controller;

import com.example.userauth.service.FirestoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/firestore")
public class FirestoreController {

    @Autowired
    private FirestoreService firestoreService;

    @GetMapping("/collection/{collectionName}/document/{documentId}")
    public ResponseEntity<Map<String, Object>> getDocument(
            @PathVariable String collectionName,
            @PathVariable String documentId) {

        Map<String, Object> document = firestoreService.getDocument(collectionName, documentId);

        if (document != null) {
            return ResponseEntity.ok(document);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/collection/{collectionName}/document/{documentId}/field/{fieldName}")
    public ResponseEntity<Object> getField(
            @PathVariable String collectionName,
            @PathVariable String documentId,
            @PathVariable String fieldName) {

        Object fieldValue = firestoreService.getFieldFromDocument(collectionName, documentId, fieldName);

        if (fieldValue != null) {
            return ResponseEntity.ok(fieldValue);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}