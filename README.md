# Traverse 관리자 웹사이트

**기간:** 2025년 2월 - 2025년 6월  
**프로젝트:** 4학년 캡스톤 II  
**역할:** 관리자 웹 백엔드 개발 및 시스템 설계  

---

## 💡 프로젝트 개요

Traverse 앱의 관리자 웹사이트는 자유여행객을 위한 모바일 앱과 연동되어 운영 데이터를 관리하고, 통계를 시각화하며, 사용자 및 콘텐츠 관리, 신고 처리 기능을 제공하는 **운영자 전용 플랫폼**입니다.  

- Firebase 데이터를 MySQL로 동기화하여 통계 제공  
- 사용자, 게시물, 신고, 해시태그 데이터 관리  
- JWT 기반 관리자 인증 및 역할별 접근 제어  

---

## ✨ 주요 기능

### 1. 통계 및 대시보드
- Firebase Firestore 데이터를 MySQL로 **스케줄러 기반 동기화**
- 사용자, 게시물, 신고 데이터를 기반으로 **운영 인사이트 제공**
- 주요 지표:
  - 누적 가입자 수 / 신규 가입자 수  
  - 콘텐츠 업로드 추이 및 카테고리별 통계  
  - 리텐션율 및 재방문 분석  
  - 신고 처리 현황 및 조치율
- 모든 통계는 RESTful API로 제공되며, 일간/주간/월간 조회 가능

### 2. 사용자 및 콘텐츠 관리
- 계정, 게시물, 댓글, 채팅 정보 **테이블 기반 관리**
- 상태 변경 가능: `active`, `suspended`, `deleted`
- 실시간 활동 이력 및 통계 확인 가능

### 3. 신고 처리
- 신고 상태: `pending`, `resolved`, `rejected`
- 조치 기록: `warn`, `suspend`, `delete_content`, `ban`
- 증거 이미지, 신고자/피신고자 정보, 담당 관리자 확인 가능
- 처리 완료 시 사용자에게 **알림 전송**  

### 4. 관리자 인증 및 초대
- JWT 기반 로그인 및 회원가입  
- 초대 코드 시스템: 이메일, 역할, 유효기간 포함  
- 역할 기반 접근 제어: `chief_manager`, `user_manager`, `post_manager` 등  

---

## 📂 프로젝트 구조
```
Traverse_admin/
├─ TraverseAdmin_Back/ # Spring Boot 백엔드
│ ├─ src/main/java/com/... # 컨트롤러, 서비스, 리포지토리, DTO, 엔티티
│ ├─ src/main/resources/ # application.properties, SQL 스크립트 등
│ └─ Dockerfile / docker-compose.yml
├─ TraverseAdmin_Front/ # 웹 프론트엔드
│ ├─ src/ # React / JavaScript / CSS
│ └─ package.json
├─ README.md
├─ .gitignore
└─ build.gradle / settings.gradle
```

---

## ⚙️ 설치 및 실행 방법

1. 저장소 클론
```
git clone https://github.com/cyoung-cy/Traverse_admin.git
```
2. 백엔드 실행
```
cd TraverseAdmin_Back
./gradlew bootRun
```

3. 프론트엔드 실행
```
cd TraverseAdmin_Front
npm install
npm start
```
4. 필요 시 Docker Compose로 MSA 환경 실행
```
docker-compose up --build
```
## 🛠️ 기술 스택
- Backend: Spring Boot, JPA, MySQL, JWT, RESTful API, Docker
- Frontend: React, HTML, CSS, JavaScript
- Database: Firebase Firestore (원본 데이터), MySQL (동기화 및 운영)
- DevOps: Git, GitHub, Docker, 스케줄러(@Scheduled)

## 👩‍💻 팀 및 역할
- 앱 프론트엔드: 1명
- 앱 백엔드: 1명
- 웹 프론트엔드: 1명
- 웹 백엔드: 1명 (본인 역할)

## 🖊️ 학습 및 성과
- Spring Boot 기반 RESTful API 설계 및 구현
- JPA를 활용한 객체-DB 매핑 및 DTO/Entity/Repository/Service 계층화
- 신고 처리, 통계, 인증 등 관리자 운영 로직 구현
- JWT 인증 및 Role-based Access Control 설계
- Firebase → MySQL 주기적 동기화 스케줄러 구축
- Docker를 활용한 MSA 구조 배포 경험
- Git을 활용한 협업 및 버전 관리

## 📈 향후 개선 사항
- 관리자 웹 UI/UX 개선 및 실시간 통계 대시보드 강화
- 알림 및 이메일 시스템 연동 강화
- 다중 관리자 권한 세분화 및 감사 로그 개선
