package com.example.userauth.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "user", indexes = @Index(name = "idx_user_id", columnList = "user_id"))
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String user_id;
    private String user_name;
    private String email;
    private String profile_picture; // 프로필 사진 URL
    private int post_count; // 게시물 수
    private int report_count; // 신고 수
    @ElementCollection
    private List<String> verify;
    private String bio; // 사용자 bio
    @ElementCollection
    private List<String> followers; // 팔로워 목록
    @ElementCollection
    private List<String> following; // 팔로잉 목록
    private String  created_at;
    private String  last_login_at;
    private String phone_number; // 전화번호
    private String location; // 위치
    private String gender; // 성별
    private String birthdate; // 생일
    private String country_code;
    private String native_language; // 모국어
    private String preferred_language; // 선호 언어
    private int total_count;
    private int current_page;
    private int total_pages;
    @ElementCollection
    private List<String> interest_keywords; // 관심 키워드 목록
    //사용사 상태
    private String status;
    private String reason;
    private Integer duration_days;
    private boolean suspended;  // 사용자 정지 상태
    private int follower_count;
    private int following_count;

    // 기본 생성자
    public User() {
    }

    // 전체 생성자
    public User(String user_id, String user_name,
                String email, String profile_picture,
                int post_count, int report_count, String bio,
                List<String> followers,
                List<String> following, String  created_at,
                String  last_login_at, String phone_number,
                String location, String gender,
                String birthdate, String country_code,
                String native_language, String preferred_language,
                List<String> interest_keywords,
                String status, String reason, Integer duration_days,
                Integer total_count, Integer current_page, Integer total_pages,
                boolean suspended, int follower_count, int following_count) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.email = email;
        this.profile_picture = profile_picture;
        this.post_count = post_count;
        this.report_count = report_count;
        this.bio = bio;
        this.followers = followers;
        this.following = following;
        this.created_at = created_at;
        this.last_login_at = last_login_at;
        this.phone_number = phone_number;
        this.location = location;
        this.gender = gender;
        this.birthdate = birthdate;
        this.country_code = country_code;
        this.native_language = native_language;
        this.preferred_language = preferred_language;
        this.interest_keywords = interest_keywords;
        this.status = status;
        this.reason = reason;
        this.duration_days = duration_days;
        this.total_count = total_count;
        this.current_page = current_page;
        this.total_pages = total_pages;
        this.suspended = suspended;
        this.following_count = following_count;
        this.follower_count = follower_count;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String userId) {
        this.user_id = userId;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String userName) {
        this.user_name = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfile_picture() {
        return profile_picture;
    }

    public void setProfile_picture(String profilePicture) {
        this.profile_picture = profilePicture;
    }

    public int getPost_count() {
        return post_count;
    }

    public void setPost_count(int postCount) {
        this.post_count = postCount;
    }

    public int getReport_count() {
        return report_count;
    }

    public void setReport_count(int reportCount) {
        this.report_count = reportCount;
    }

    public List<String> getVerify() {
        return verify;
    }

    public void setVerify(List<String> verify) {
        this.verify = verify;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<String> getFollowers() {
        return followers;
    }

    public void setFollowers(List<String> followers) {
        this.followers = followers;
    }

    public List<String> getFollowing() {
        return following;
    }

    public void setFollowing(List<String> following) {
        this.following = following;
    }

    public String  getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String  createdAt) {
        this.created_at = createdAt;
    }

    public String  getLast_login_at() {
        return last_login_at;
    }

    public void setLast_login_at(String  lastLoginAt) {
        this.last_login_at = lastLoginAt;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setphone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public String getCountry_code() {
        return country_code;
    }

    public void setCountry_code(String countryCode) {
        this.country_code = countryCode;
    }

    public String getNative_language() {
        return native_language;
    }

    public void setNative_language(String nativeLanguage) {
        this.native_language = nativeLanguage;
    }

    public String getPreferred_language() {
        return preferred_language;
    }

    public void setPreferred_language(String preferredLanguage) {
        this.preferred_language = preferredLanguage;
    }

    public List<String> getInterest_keywords() {
        return interest_keywords;
    }

    public void setInterest_keywords(List<String> interestKeywords) {
        this.interest_keywords = interestKeywords;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Integer getDuration_days() {
        return duration_days;
    }

    public void setDuration_days(Integer durationDays) {
        this.duration_days = durationDays;
    }

    public int getTotal_count() {
        return total_count;
    }

    public void setTotal_count(int total_count) {
        this.total_count = total_count;
    }

    public int getCurrent_page() {
        return current_page;
    }

    public void setCurrent_page(int current_page) {
        this.current_page = current_page;
    }

    public int getTotal_pages() {
        return total_pages;
    }

    public void setTotal_pages(int total_page) {
        this.total_pages = total_page;
    }

    public void setSuspended(boolean suspended) {
        this.suspended = suspended;
    }

    public boolean isSuspended() {
        return suspended;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public int getFollower_count() {
        return follower_count;
    }

    public void setFollower_count(int follower_count) {
        this.follower_count = follower_count;
    }

    public int getFollowing_count() {
        return following_count;
    }

    public void setFollowing_count(int following_count) {
        this.following_count = following_count;
    }
}