######################################################## 원래 코드
# # 가져올 이미지를 정의
# FROM node:19
# # 경로 설정하기
# WORKDIR /app
# # package.json 워킹 디렉토리에 복사 (.은 설정한 워킹 디렉토리를 뜻함)
# COPY package.json package-lock.json ./
# # 명령어 실행 (의존성 설치)
# RUN npm install
# # 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사한다.
# COPY . .

# # 각각의 명령어들은 한줄 한줄씩 캐싱되어 실행된다.
# # package.json의 내용은 자주 바뀌진 않을 거지만
# # 소스 코드는 자주 바뀌는데
# # npm install과 COPY . . 를 동시에 수행하면
# # 소스 코드가 조금 달라질때도 항상 npm install을 수행해서 리소스가 낭비된다.

# # 환경 변수 설정하기
# ENV REACT_APP_NAME="cyoung kim"

# # 3000번 포트 노출
# EXPOSE 3000

# # npm start 스크립트 실행
# CMD ["npm", "run", "dev"]

# # 그리고 Dockerfile로 docker 이미지를 빌드해야한다.
# # $ docker build .



######################################################## 2025-06-02  수정 코드
# base image 설정(as build 로 완료된 파일을 밑에서 사용할 수 있다.)
FROM node:14-alpine as build

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# app dependencies
# 컨테이너 내부로 package.json 파일들을 복사
COPY package*.json ./

# package.json 및 package-lock.json 파일에 명시된 의존성 패키지들을 설치
RUN npm install

# 호스트 머신의 현재 디렉토리 파일들을 컨테이너 내부로 전부 복사
COPY . .

# npm build
RUN npm run build

# prod environment
FROM nginx:stable-alpine

# 이전 빌드 단계에서 빌드한 결과물을 /usr/share/nginx/html 으로 복사한다.
# 여기서 /app/dist는 vite build폴더라 dist로 설정했습니다. 기존 리액트는 build로 수정
COPY --from=build /app/dist /usr/share/nginx/html

# 기본 nginx 설정 파일을 삭제한다. (custom 설정과 충돌 방지)
RUN rm /etc/nginx/conf.d/default.conf

# custom 설정파일을 컨테이너 내부로 복사한다.
COPY nginx/nginx.conf /etc/nginx/conf.d

# 컨테이너의 3001번 포트를 열어준다.
EXPOSE 3001

# nginx 서버를 실행하고 백그라운드로 동작하도록 한다.
CMD ["nginx", "-g", "daemon off;"]
