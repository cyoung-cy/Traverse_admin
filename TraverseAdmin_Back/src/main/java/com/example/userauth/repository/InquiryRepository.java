package com.example.userauth.repository;

import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;


@Repository
public class InquiryRepository {

    private final Firestore firestore;

    public InquiryRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public CollectionReference getInquiries() {
        return firestore.collection("inquiries");
    }

    public DocumentReference getInquiryById(String inquiryId) {
        return firestore.collection("inquiries").document(inquiryId);
    }
}
