package com.example.userauth.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    
    @Value("${FIREBASE_CREDENTIALS_PATH:/app/firebase-credentials.json}")
    private String firebaseCredentialsPath;
    
    @PostConstruct
    @Bean
    public Firestore firestore() throws IOException {
        InputStream serviceAccount = null;
        
        try {
            // 먼저 환경 변수로 지정된 파일 경로를 시도
            serviceAccount = new FileInputStream(firebaseCredentialsPath);
        } catch (Exception e) {
            // 파일 경로가 실패하면 클래스패스에서 찾기
            serviceAccount = getClass().getResourceAsStream("/tabtalk-c3dc3-firebase-adminsdk-fbsvc-25c323ffdc.json");
        }

        // 입력 스트림이 null인지 확인 (디버깅용)
        if (serviceAccount == null) {
            throw new IOException("Firebase 서비스 계정 키 파일을 찾을 수 없습니다. 경로: " + firebaseCredentialsPath);
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        // 이미 초기화되었는지 확인 (앱 재시작 시 오류 방지)
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }

        // Firestore 객체 반환하여 Bean 등록
        return FirestoreClient.getFirestore();
    }
}