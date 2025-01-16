import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
// import axios from "axios";
import { useRouter } from "next/router";

const GoogleSignInButton = () => {
  // const router = useRouter();
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse?.credential;
    console.log("googleToken", googleToken);

    // try {
    // Send Google token to Node.js API for Keycloak registration
    // const response = await axios.post("http://<backend-url>/auth/google", {
    //   token: googleToken,
    // });

    // Handle success (store JWT, redirect, etc.)
    //   localStorage.setItem("token", response.data.token);
    //   router.push("/tenant");
    // } catch (error) {
    //   console.error("Authentication failed:", error);
    //   // }
    //   console.log("credentialResponse", credentialResponse);
    // }
  };

  const handleError = () => {
    console.error("Google Sign-In failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      width={"200px"}
    />
  );
};

export default GoogleSignInButton;
