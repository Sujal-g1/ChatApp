import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import crypto from "crypto";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ZingleeeLogo } from "./LandingPage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import AuthForm from "./LoginLogics/AuthForm";
import GoogleLoginButton from "./LoginLogics/GoogleLoginButton";
import ThemePicker from "./LoginLogics/ThemePicker";
import VerificationPanel from "./LoginLogics/VerificationPanel";
import Fireflies from "./LoginLogics/Fireflies";


const LoginPage = () => {

  const [currentState, setCurrentState] = useState("Sign up");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Email verification screen
  const [verificationSent, setVerificationSent] = useState(false);


  const { login } = useContext(AuthContext);

  const {
    theme,
    setTheme,
    THEMES,
  } = useTheme();


  // EMAIL AUTHENTICATION
  const handleEmailAuth = async () => {

    try {
      const cleanEmail = email.trim().toLowerCase();

      // SIGN UP
      if (currentState === "Sign up") {
  try {
    // Try creating a completely new Firebase account
    const result = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

    // Send verification email
      const actionCodeSettings = {
      url: `${window.location.origin}/verify-email`,
      handleCodeInApp: false,
    };

    await sendEmailVerification(
      result.user,
      actionCodeSettings
    );

    setVerificationSent(true);

    toast.success("Verification email sent.");

    return;

  } catch (error) {

    // Firebase account already exists.
    // This can happen if the user previously
    // started signup but never verified their email.
    if (error.code === "auth/email-already-in-use") {

      try {
        // Try to recover the existing Firebase account
        const result = await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

        await result.user.reload();

        // Existing Firebase account is still unverified
        if (!result.user.emailVerified) {

          setVerificationSent(true);

          toast.success(
            "Your previous signup is still pending. Please verify your email."
          );

          return;
        }

        // Firebase account is already verified.
        // Send it to our backend.
        const firebaseToken =
          await result.user.getIdToken(true);

        await login("firebase-email", {
          token: firebaseToken,
          provider: "email",
          fullName,
          username,
          bio,
        });

        return;

      } catch (loginError) {

        if (
          loginError.code === "auth/invalid-credential"
        ) {
          toast.error(
            "An account with this email already exists. Please use the correct password or switch to Login."
          );

          return;
        }

        toast.error(
          "Unable to recover this account. Please try again."
        );

        return;
      }
    }

    // Any other Firebase signup error
    throw error;
  }
}

    // LOGIN
      const result =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      // Refresh Firebase user
      await result.user.reload();

      // User must verify email
      if (!result.user.emailVerified) {

        toast.error(
          "Please verify your email before signing in."
        );

        return;
      }


      // Get fresh Firebase token
      const firebaseToken = await result.user.getIdToken(true);


      // Send Firebase token to backend
      await login(
        "firebase-email",
        {
          token: firebaseToken,
        }
      );

    } catch (error) {

      // console.error(
      //   "Firebase email auth error:",
      //   error
      // );

      switch (error.code) {

        case "auth/email-already-in-use":

          toast.error(
            "An account with this email already exists."
          );

          break;


        case "auth/invalid-email":
          toast.error(
            "Please enter a valid email address."
          );

          break;


        case "auth/weak-password":

          toast.error(
            "Password is too weak."
          );

          break;


        case "auth/invalid-credential":

          toast.error(
            "Invalid email or password."
          );

          break;


        case "auth/network-request-failed":

          toast.error(
            "Network error. Please check your internet connection."
          );

          break;


        default:

          toast.error(
            "Authentication failed. Please try again."
          );

          break;
      }
    }
  };

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      provider
    );

    const token = await result.user.getIdToken();

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/firebase-login`,
      {
        token,
        provider: "google",
      }
    );

    if (res.data.success) {
      await login("google", res.data);
    } else {
      toast.error(
        res.data.message || "Google login failed."
      );
    }

  } catch (error) {

    // console.error(
    //   "Google login error:",
    //   error
    // );

    if (
      error.code ===
      "auth/popup-closed-by-user"
    ) {
      return;
    }

    if (
      error.code ===
      "auth/popup-blocked"
    ) {
      toast.error(
        "Google login popup was blocked. Please allow popups for Zingleee."
      );
      return;
    }

    if (
      error.code ===
      "auth/network-request-failed"
    ) {
      toast.error(
        "Network error. Please check your internet connection."
      );
      return;
    }

    toast.error(
      "Google login failed. Please try again."
    );
  }
};

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Signup has two steps:
    //
    // Step 1:
    // Personal information
    //
    // Step 2:
    // Bio
    //
    // Then create account.

    if (
      currentState === "Sign up" &&
      !isDataSubmitted
    ) {

      setIsDataSubmitted(true);

      return;
    }


    await handleEmailAuth();
  };


  // EMAIL VERIFICATION
  const handleVerifiedEmail = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {

        toast.error(
          "Verification session expired. Please sign up again."
        );

        return;
      }

      // Get latest Firebase user state
      await user.reload();

      // Still not verified
      if (!user.emailVerified) {

        toast.error(
          "Email is not verified yet."
        );

        return;
      }
      // Fresh Firebase token
      const token =
        await user.getIdToken(true);


      // Send verified Firebase user to backend
      await login(
        "firebase-email",
        {
          token,
          provider: "email",
          fullName,
          username,
          bio,
        }
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to complete verification."
      );
    }
  };

  // RESEND VERIFICATION
const handleResendVerification = async () => {
  if (resendCooldown > 0) {
    return;
  }

  try {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Verification session expired.");
      return;
    }

    const actionCodeSettings = {
      url: `${import.meta.env.VITE_FRONTEND_URL}/verify-email`,
      handleCodeInApp: false,
    };

    await sendEmailVerification(
      user,
      actionCodeSettings
    );

    setResendCooldown(60);

    toast.success("Verification email sent again.");
  } catch (error) {
    console.error(
      "Resend verification error:",
      error
    );

    toast.error(
      "Unable to resend verification email."
    );
  }
};

  // SWITCH LOGIN / SIGNUP
const switchState = async (state) => {
  setCurrentState(state);
  setIsDataSubmitted(false);
  setVerificationSent(false);

  // If the user leaves the signup flow,
  // clear the temporary Firebase authentication session.
  if (state === "Login" && auth.currentUser) {
    try {
      await auth.signOut();
    } catch {
      // Ignore Firebase sign-out errors here.
    }
  }
};

useEffect(() => {
  if (resendCooldown <= 0) return;

  const timer = setInterval(() => {
    setResendCooldown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [resendCooldown]);


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >

      <Fireflies />

      <motion.div
        initial={{
          opacity: 0,
          y: 28,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.45,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 2,
        }}
      >

        <div
          style={{
            background:
              "rgba(255,255,255,0.05)",

            backdropFilter:
              "blur(40px)",

            WebkitBackdropFilter:
              "blur(40px)",

            border:
              "1px solid rgba(255,255,255,0.1)",

            borderRadius: 28,

            padding:
              "36px 32px",

            boxShadow:
              "0 30px 60px rgba(0,0,0,0.45), 0 0 0 1px var(--border-color)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 28,
            }}
          >

            <motion.div
              whileHover={{
                scale: 1.06,
                rotate: 4,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
              }}
              style={{
                marginBottom: 14,
                filter:
                  "drop-shadow(0 0 20px var(--glow))",
              }}
            >

              <ZingleeeLogo size={60} />

            </motion.div>


            <h1
              style={{
                fontFamily:
                  "Syne, sans-serif",

                fontWeight: 800,

                fontSize: 26,

                letterSpacing:
                  "-0.02em",

                color: "white",

                margin: 0,
              }}
            >

              Zingle
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                ee
              </span>

            </h1>


            <p
              style={{
                fontSize: 13,
                color:
                  "rgba(255,255,255,0.38)",
                marginTop: 6,
              }}
            >

              {currentState === "Sign up"
                ? "Create your account"
                : "Welcome back"}

            </p>

          </div>

              {/* LOGIN / SIGNUP TABS */}
          <div
            style={{
              display: "flex",

              background:
                "rgba(255,255,255,0.05)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: 50,

              padding: 4,

              marginBottom: 28,
            }}
          >

            {["Sign up", "Login"].map((tab) => (

              <button
                key={tab}
                type="button"
                onClick={() =>
                  switchState(tab)
                }
                style={{
                  flex: 1,

                  padding: "9px 0",

                  borderRadius: 50,

                  border: "none",

                  cursor: "pointer",

                  fontFamily:
                    "Outfit, sans-serif",

                  fontSize: 14,

                  fontWeight: 600,

                  transition:
                    "all 0.25s ease",

                  background:
                    currentState === tab
                      ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                      : "transparent",

                  color:
                    currentState === tab
                      ? "white"
                      : "rgba(255,255,255,0.45)",

                  boxShadow:
                    currentState === tab
                      ? "0 4px 15px var(--glow)"
                      : "none",
                }}
              >

                {tab}

              </button>

            ))}

          </div>

              {/* EMAIL VERIFICATION */}
          {verificationSent ? (

            <VerificationPanel
              email={email}
              onVerified={handleVerifiedEmail}
              onResend={handleResendVerification}
              resendCooldown={resendCooldown}
            />

          ) : (

            <>
                  {/* EMAIL AUTH FORM */}

              <AuthForm
                onSubmitHandler={
                  onSubmitHandler
                }

                currentState={
                  currentState
                }

                isDataSubmitted={
                  isDataSubmitted
                }

                setIsDataSubmitted={
                  setIsDataSubmitted
                }

                fullName={
                  fullName
                }

                setFullName={
                  setFullName
                }

                email={
                  email
                }

                setEmail={
                  setEmail
                }

                username={
                  username
                }

                setUsername={
                  setUsername
                }

                password={
                  password
                }

                setPassword={
                  setPassword
                }

                showPwd={
                  showPwd
                }

                setShowPwd={
                  setShowPwd
                }

                bio={
                  bio
                }

                setBio={
                  setBio
                }
              />
                  {/* GOOGLE LOGIN */}

              <div
                className="divider"
                style={{
                  margin: "22px 0",
                }}
              >
                or
              </div>


              {/* IMPORTANT:
                  GoogleLoginButton remains responsible
                  for your existing Google flow.
              */}

              <GoogleLoginButton onClick={handleGoogleLogin}/>
            </>

          )}

        </div>

        {/* THEME PICKER */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.35,
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 20,
          }}
        >

          <ThemePicker
            themes={THEMES}
            theme={theme}
            setTheme={setTheme}
          />

        </motion.div>

      </motion.div>

    </div>
  );
};


export default LoginPage;