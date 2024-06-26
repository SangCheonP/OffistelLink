import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

import {
  findByEmail,
  userConfirm,
  tokenRegeneration,
  logout,
  imageUpdate,
  checkPassword,
  updateProfile,
  updateProfileBorderAndExp
} from "@/api/user";
import { httpStatusCode } from "@/util/http-status";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore(
  "userStore",
  () => {
    const router = useRouter();

    const isLogin = ref(false);
    const isLoginError = ref(false);
    const userInfo = ref(null);
    const isValidToken = ref(false);

    const borderImages = ref([
      "/src/assets/images/borders/1.png",
      "/src/assets/images/borders/2.png",
      "/src/assets/images/borders/3.png",
      "/src/assets/images/borders/4.png",
      "/src/assets/images/borders/5.png",
      "/src/assets/images/borders/6.png",
      "/src/assets/images/borders/7.png",
      "/src/assets/images/borders/8.png",
      "/src/assets/images/borders/9.png",
      "/src/assets/images/borders/10.png",
    ]); // 이미지 경로 배열

    const userLogin = async (loginUser) => {
      await userConfirm(
        loginUser,
        (response) => {
          if (response.status === httpStatusCode.CREATE) {
            console.log("로그인 성공!!!");

            let { data } = response;
            let accessToken = data["access-token"];
            let refreshToken = data["refresh-token"];

            isLogin.value = true;
            isLoginError.value = false;
            isValidToken.value = true;

            sessionStorage.setItem("accessToken", accessToken); // sessionStorage 사용
            sessionStorage.setItem("refreshToken", refreshToken);
          }
        },
        (error) => {
          console.log("로그인 실패!!!!");

          isLogin.value = false;
          isLoginError.value = true;
          isValidToken.value = false;

          console.error(error);
        }
      );
    };

    const getUserInfo = async (token) => {
      let decodeToken = jwtDecode(token);
      await findByEmail(
        decodeToken.email,
        (response) => {
          if (response.status === httpStatusCode.OK) {
            userInfo.value = response.data.userInfo;
          } else {
            console.log("유저 정보 없음!!!!");
          }
        },
        async (error) => {
          console.error(
            "토큰 만료되어 사용 불가능: ",
            error.response.status,
            error.response.statusText
          );
          isValidToken.value = false;

          await tokenRegenerate();
        }
      );
    };

    const tokenRegenerate = async () => {
      await tokenRegeneration(
        JSON.stringify(userInfo.value),
        (response) => {
          if (response.status === httpStatusCode.CREATE) {
            let accessToken = response.data["access-token"];
            sessionStorage.setItem("accessToken", accessToken);
            isValidToken.value = true;
          }
        },
        async (error) => {
          // HttpStatus.UNAUTHORIZED(401) : RefreshToken 기간 만료
          if (error.response.status === httpStatusCode.UNAUTHORIZED) {
            // 다시 로그인 전 DB에 저장된 RefreshToken 제거
            await logout(
              userInfo.value.email,
              (response) => {
                if (response.status === httpStatusCode.OK) {
                  console.log("리프레시 토큰 제거 성공");
                } else {
                  console.log("리프레시 토큰 제거 실패");
                }

                alert("RefreshToken 기간 만료!! 다시 로그인해 주세요.");

                isLogin.value = false;
                userInfo.value = null;
                isValidToken.value = false;

                router.push({ name: "user-login" });
              },
              (error) => {
                console.error(error);
                isLogin.value = false;
                userInfo.value = null;
              }
            );
          }
        }
      );
    };

    const userLogout = async () => {
      console.log("로그아웃 이메일 : " + userInfo.value.email);

      // 서버로 로그아웃 정보 전송
      await logout(
        userInfo.value.email,
        (response) => {
          if (response.status === httpStatusCode.OK) {
            isLogin.value = false;
            userInfo.value = null;
            isValidToken.value = false;
            
            localStorage.removeItem("userStore")
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
          } else {
            console.error("유저 정보 없음!!!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    };

    const profileImageUpdate = async (image) => {
      await imageUpdate(
        userInfo.value.email, // 사용자 이메일 전달
        image, // 이미지 데이터 전달
        (response) => {
          console.log(response);
          if (response.status === httpStatusCode.OK) {
            userInfo.value.profileImageUrl = response.data.imageUrl; // 새로운 프로필 이미지 URL 설정
            alert("프로필 이미지가 성공적으로 변경되었습니다."); // 성공 메시지 알림
          } else {
            console.error("프로필 이미지 업데이트 실패!!!"); // 실패 시 에러 로그
            alert("프로필 이미지 변경에 실패하였습니다."); // 실패 메시지 알림
          }
        },
        (error) => {
          console.error(error); // 에러 로그
        }
      );
    };

    const checkCurrentPassword = async (email, password) => {
      let isValid = false;
      await checkPassword(
        email,
        password, // 입력받은 현재 비밀번호
        (response) => {
          console.log(response);
          if (response.status === httpStatusCode.OK) {
            console.log("입력한 비밀번호와 일치");
            isValid = true;
          } else {
            console.log("입력한 비밀번호와 불일치");
          }
        },
        (error) => {
          console.error(error);
        }
      );
      return isValid;
    };

    const updateUserProfile = async (email, password, phone) => {
      await updateProfile(email, password, phone,
        (response) =>{
          console.log(response);
          if (response.status === httpStatusCode.OK) {
          } else {
            console.log("정보 변경에 실패했습니다.");
          }
        },
        (error) =>{
            console.error(error)
        }
      )
    }

    const updateUserProfileBorderAndExp = async(email, border_id, exp_id) => {
      await updateProfileBorderAndExp(email, border_id, exp_id,
        (response) =>{
          console.log(response);
          if (response.status === httpStatusCode.OK) {
            console.log("정보를 변경했습니다.");
            userInfo.value.borderId = border_id;
            userInfo.value.expId = exp_id;
          } else {
            console.log("정보 변경에 실패했습니다.");
          }
        },
        (error) => {
          console.error("프로필 업데이트 중 오류 발생: ", error);
        }
      )
    }

    return {
      borderImages,
      isLogin,
      isLoginError,
      userInfo,
      isValidToken,
      userLogin,
      getUserInfo,
      tokenRegenerate,
      userLogout,
      profileImageUpdate,
      checkCurrentPassword,
      updateUserProfile,
      updateUserProfileBorderAndExp
    };
  },
  {
    // 상태를 영속적으로 저장합니다.
    persist: {
      enabled: true,
      strategies: [
        {
          key: "user",
          storage: sessionStorage,
        },
      ],
    },
  }
);
