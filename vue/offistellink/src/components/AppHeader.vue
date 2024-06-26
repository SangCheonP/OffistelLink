<script setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();

const userStore = useUserStore();

const { isLogin, isValidToken, userInfo, borderImages
 } = storeToRefs(userStore);
const { userLogout } = userStore;

const logout = () => {
  userLogout();
  alert("로그아웃 되었습니다.");
};
</script>

<template>
  <div>
    <!-- ======= Header/Navbar ======= -->
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Montserrat:wght@700&display=swap"
      rel="stylesheet"
    />

    <nav class="navbar navbar-default navbar-trans navbar-expand-lg fixed-top">
      <div class="container">
        <button
          class="navbar-toggler collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarDefault"
          aria-controls="navbarDefault"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <router-link class="navbar-brand text-brand" :to="{ name: 'home' }"
          >OfficetelLink</router-link
        >
        <div
          class="navbar-collapse collapse justify-content-center"
          id="navbarDefault"
        >
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link
                class="nav-link"
                :to="{ name: 'home' }"
                exact-active-class="active"
                >메인 페이지</router-link
              >
            </li>
            <!-- 게시판 페이지-->
            <li class="nav-item">
              <router-link
                class="nav-link"
                :to="{ name: 'board' }"
                exact-active-class="active"
                >게시판</router-link
              >
            </li>
            <!-- 상점 페이지-->
            <li class="nav-item">
              <router-link
                class="nav-link"
                :to="{ name: 'shop-main' }"
                exact-active-class="active"
                >상점</router-link
              >
            </li>
          </ul>
        </div>

        <div class="dropdown" v-if="isLogin && isValidToken">
          <button
            class="image-button btn-b-n navbar-toggle-box navbar-toggle-box-collapse"
            type="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <!-- userInfo.profileImageUrl이 null이거나 비어 있는지 확인 -->
            <div class="image-container">
              <img
                v-if="userInfo && userInfo.profileImageUrl"
                :src="`http://localhost:8080${
                  userInfo.profileImageUrl
                }?t=${Date.now()}`"
                alt="login"
                id="loginImg"
                class="login-img"
              />
              <img
                v-if="userInfo && userInfo.profileImageUrl"
                :src="`http://localhost:5173${
                  borderImages[userInfo.borderId]
                }?t=${Date.now()}`"
                alt="login"
                id="loginBorderImg"
                class="login-border-img"
              />
              <!-- 기본 이미지를 보여줌 -->
              <img
                v-else
                src="/src/assets/images/no-image.png"
                alt="no image"
                id="loginImg"
                class="login-img"
              />
            </div>
          </button>
          <div class="dropdown-menu dropdown-menu-center">
            <router-link class="dropdown-item" :to="{ name: 'user-mypage' }"
              >마이페이지</router-link
            >
            <router-link
              class="dropdown-item"
              :to="{ name: 'home' }"
              @click.prevent="logout"
              >로그아웃</router-link
            >
          </div>
        </div>

        <router-link
          v-if="!isLogin && !isValidToken"
          :to="{ name: 'user-login' }"
        >
          <button
            class="image-button btn-b-n navbar-toggle-box navbar-toggle-box-collapse login-btn"
            type="button"
          >
            로그인
          </button>
        </router-link>
      </div>
    </nav>
    <!-- End Header/Navbar -->
  </div>
</template>

<style scoped>
.image-button {
  position: relative;
}

/* 로그인 버튼 스타일 */
.login-btn {
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: bold;
  border: #000000;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.login-btn:hover {
  color: #2eca6a;
}

.nav-link.active {
  color: #ff5733; /* 원하는 색상으로 변경 */
  font-weight: bold;
  font-family: "Poppins", sans-serif; /* 폰트 적용 */
}

a {
  color: #000000;
  text-decoration: none;
  transition: all 0.5s ease;
  font-family: "Poppins", sans-serif; /* 폰트 적용 */
}

a:hover {
  color: #2eca6a;
  text-decoration: none;
}

/*--------------------------------------------------------------
# Navbar
--------------------------------------------------------------*/

.image-button {
  position: relative;
  background: none; /* 배경 제거 */
  border: none; /* 테두리 제거 */
  padding: 0; /* 여백 제거 */
  cursor: pointer; /* 커서 모양 변경 */
}

.image-container {
  position: relative;
}

.login-img {
  width: 46px; /* 원하는 크기로 조정 */
  height: auto;
  border-radius: 50%;
  position: absolute; /* 절대 위치로 설정 */
  top: 2px; /* 테두리 이미지 내부로 약간 내려줌 */
  left: 2px; /* 테두리 이미지 내부로 약간 내려줌 */
  z-index: 1; /* 테두리 이미지보다 위에 위치하도록 설정 */
  transition: transform 0.3s ease; /* 마우스를 올렸을 때의 애니메이션 효과 */
}

.login-border-img {
  width: 50px; /* 원하는 크기로 조정 */
  height: auto;
  border-radius: 50%;
  transition: transform 0.3s ease; /* 마우스를 올렸을 때의 애니메이션 효과 */
  z-index: 0; /* 로그인 이미지 아래에 위치하도록 설정 */
}

.image-container:hover .login-img,
.image-container:hover .login-border-img {
  transform: scale(1.1); /* 마우스를 올렸을 때 이미지가 커지는 효과 */
}

.navbar-default {
  transition: all 0.5s ease-in-out;
  background-color: #ffffff;
  padding-top: 28px;
  padding-bottom: 28px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  box-shadow: 1px 2px 15px rgba(100, 100, 100, 0.3);
}

.navbar-default .nav-search {
  color: #000000;
  font-size: 1.5rem;
}

.navbar-default.navbar-reduce {
  box-shadow: 1px 2px 15px rgba(100, 100, 100, 0.3);
}

.navbar-default.navbar-trans,
.navbar-default.navbar-reduce {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.navbar-default.navbar-trans .nav-item,
.navbar-default.navbar-reduce .nav-item {
  position: relative;
  padding-right: 10px;
  padding-bottom: 8px;
  margin-left: 0;
}

@media (min-width: 768px) {
  .navbar-default.navbar-trans .nav-item,
  .navbar-default.navbar-reduce .nav-item {
    margin-left: 15px;
  }
}

.navbar-default.navbar-trans .nav-link,
.navbar-default.navbar-reduce .nav-link {
  font-size: 1.1rem;
  color: #000000;
  font-weight: 600;
  letter-spacing: 0.03em;
  transition: all 0.1s ease-in-out;
  position: relative;
  padding-left: 0;
  padding-right: 0;
  font-family: "Poppins", sans-serif; /* 폰트 적용 */
}

.navbar-default.navbar-trans .nav-link:before,
.navbar-default.navbar-reduce .nav-link:before {
  content: "";
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 0;
  background-color: #2eca6a;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out 0.3s;
}

.navbar-default.navbar-trans .nav-link:hover,
.navbar-default.navbar-reduce .nav-link:hover {
  color: #000000;
}

.navbar-default.navbar-trans .nav-link:hover:before,
.navbar-default.navbar-reduce .nav-link:hover:before {
  transform: scaleX(1);
  transform-origin: left;
}

.navbar-default.navbar-trans .show > .nav-link:before,
.navbar-default.navbar-trans .active > .nav-link:before,
.navbar-default.navbar-trans .nav-link.show:before,
.navbar-default.navbar-trans .nav-link.active:before,
.navbar-default.navbar-reduce .show > .nav-link:before,
.navbar-default.navbar-reduce .active > .nav-link:before,
.navbar-default.navbar-reduce .nav-link.show:before,
.navbar-default.navbar-reduce .nav-link.active:before {
  transform: scaleX(1);
}

.navbar-default.navbar-trans .nav-link:before {
  background-color: #2eca6a;
}

.navbar-default.navbar-trans .nav-link:hover {
  color: #000000;
}

.navbar-default.navbar-trans .show > .nav-link,
.navbar-default.navbar-trans .active > .nav-link,
.navbar-default.navbar-trans .nav-link.show,
.navbar-default.navbar-trans .nav-link.active {
  color: #000000;
}

.navbar-default.navbar-reduce {
  transition: all 0.5s ease-in-out;
  padding-top: 19px;
  padding-bottom: 19px;
}

.navbar-default.navbar-reduce .nav-link {
  color: #000000;
}

.navbar-default.navbar-reduce .nav-link:before {
  background-color: #2eca6a;
}

.navbar-default.navbar-reduce .nav-link:hover {
  color: #000000;
}

.navbar-default.navbar-reduce .show > .nav-link,
.navbar-default.navbar-reduce .active > .nav-link,
.navbar-default.navbar-reduce .nav-link.show,
.navbar-default.navbar-reduce .nav-link.active {
  color: #000000;
}

.navbar-default.navbar-reduce .navbar-brand {
  color: #000000;
}

.navbar-default .dropdown .dropdown-menu {
  border-top: 0;
  border-left: 4px solid #2eca6a;
  border-right: 0;
  border-bottom: 0;
  transform: translate3d(0px, 40px, 0px);
  opacity: 0;
  filter: alpha(opacity=0);
  visibility: hidden;
  transition: all 0.5s cubic-bezier(0.3, 0.65, 0.355, 1) 0s,
    opacity 0.31s ease 0s, height 0s linear 0.36s;
  margin: 0;
  border-radius: 0;
  padding: 12px 0;
}

@media (min-width: 768px) {
  .navbar-default .dropdown .dropdown-menu {
    border-top: 4px solid #2eca6a;
    border-left: 0;
    display: block;
    position: absolute;
    box-shadow: 0 2px rgba(17, 16, 15, 0.1), 0 2px 10px rgba(20, 19, 18, 0.1);
  }
}

.navbar-default .dropdown .dropdown-menu .dropdown-item {
  padding: 12px 18px;
  transition: all 500ms ease;
  font-weight: 600;
  min-width: 20px;
}

.navbar-default .dropdown .dropdown-menu .dropdown-item:hover {
  background-color: #ffffff;
  color: #2eca6a;
  transition: all 500ms ease;
}

.navbar-default .dropdown .dropdown-menu .dropdown-item.active {
  background-color: #ffffff;
  color: #2eca6a;
}

.navbar-default .dropdown:hover .dropdown-menu {
  transform: translate3d(0px, 0px, 0px);
  visibility: visible;
  opacity: 1;
  filter: alpha(opacity=1);
}

/*------/ Hamburger Navbar /------*/
.navbar-toggler {
  position: relative;
}

.navbar-toggler:focus,
.navbar-toggler:active {
  outline: 0;
}

.navbar-toggler span {
  display: block;
  background-color: #000000;
  height: 3px;
  width: 25px;
  margin-top: 4px;
  margin-bottom: 4px;
  transform: rotate(0deg);
  left: 0;
  opacity: 1;
}

.navbar-toggler span:nth-child(1),
.navbar-toggler span:nth-child(3) {
  transition: transform 0.35s ease-in-out;
}

.navbar-toggler:not(.collapsed) span:nth-child(1) {
  position: absolute;
  left: 12px;
  top: 10px;
  transform: rotate(135deg);
  opacity: 0.9;
}

.navbar-toggler:not(.collapsed) span:nth-child(2) {
  height: 12px;
  visibility: hidden;
  background-color: transparent;
}

.navbar-toggler:not(.collapsed) span:nth-child(3) {
  position: absolute;
  left: 12px;
  top: 10px;
  transform: rotate(-135deg);
  opacity: 0.9;
}

.navbar-brand {
  font-size: 2rem; /* 원하는 폰트 크기로 조정 */
}
</style>
