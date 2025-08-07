import React, { useState } from "react";
import restaurant from "../assets/cover.webp"; // Adjust the path as necessary
import logo from "../assets/logo.png"; // Adjust the path as necessary
import Register from "../components/auth/Register"; // Adjust the path as necessary
import Login from "../components/auth/Login";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SIDE */}
      <div className="w-1/2 relative flex items-center justify-center bg-cover">
        {/* BG IMAGE */}
        <img
          className="w-full h-full object-cover"
          src={restaurant}
          alt="Restaurant Image"
        />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>

        {/* TOP LOGO + PURPOSE TEXT */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-center px-4">
          {/* <img
            src={logo}
            alt="System Logo"
            className="h-14 w-14 border-2 rounded-full p-1 mb-3"
          /> */}
          <h1 className="text-white text-2xl font-bold tracking-wide">
            Pioserve
          </h1>
          <p className="text-gray-300 text-lg max-w-xs mt-1">
            Empowering your daily operations. Built for staff, designed for
            excellence.
          </p>
        </div>

        {/* QUOTE at BOTTOM */}
        <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl italic text-white">
          "Great food isn't just served — it's shared with heart. Always serve
          the best, because every plate is a promise."
          <br />
          <span className="block mt-4 text-primary">- JGDEV</span>
        </blockquote>

        {/* Developer Credit / License */}
        <div className="absolute bottom-2 w-full text-center text-[11px] text-gray-400 px-4">
          © 2025{" "}
          <a
            href="https://www.facebook.com/YOUR_FACEBOOK_PROFILE"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-glow font-semibold hover:underline"
          >
            JGDEV
          </a>
          . All rights reserved.
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-1/2 min-h-screen bg-[#1a1a1a] p-10">
        <div className="flex flex-col items-center gap-2">
          <img
            src={logo}
            alt="Pioserve logo"
            className="h-14 w-14 border-2 rounded-full p-1"
          />
          <h1 className="text-lg font-semibold text-[#f5f5f5] tracking-wide">
            Pioserve
          </h1>
        </div>
        <h2 className="text-4xl text-center mt-10 font-semibold text-primary mb-10">
          {isRegister ? "Create Account" : "Sign In"}
        </h2>

        {/* COMPONENTS */}
        {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}

        <div className="flex justify-center mt-6">
          <p className="text-sm text-[#ababab] ">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <a
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              {isRegister ? "Sign In" : "Create Account"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
