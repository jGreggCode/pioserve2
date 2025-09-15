/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React, { useState } from "react";
import restaurant from "../assets/cover.webp"; 
import logo from "../assets/logo.png"; 
import Register from "../components/auth/Register"; 
import Login from "../components/auth/Login";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  return (
    <div className="flex w-full min-h-screen">
      {/* LEFT SIDE */}
      <div className="relative flex items-center justify-center w-1/2 bg-cover">
        {/* BG IMAGE */}
        <img
          className="object-cover w-full h-full"
          src={restaurant}
          alt="Restaurant Image"
        />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>

        {/* TOP LOGO + PURPOSE TEXT */}
        <div className="absolute flex flex-col items-center px-4 text-center transform -translate-x-1/2 top-20 left-1/2">
          {/* <img
            src={logo}
            alt="System Logo"
            className="p-1 mb-3 border-2 rounded-full h-14 w-14"
          /> */}
          <h1 className="text-2xl font-bold tracking-wide text-white">
            Pioserve
          </h1>
          <p className="max-w-xs mt-1 text-lg text-gray-300">
            Empowering your daily operations. Built for staff, designed for
            excellence.
          </p>
        </div>

        {/* QUOTE at BOTTOM */}
        <blockquote className="absolute px-8 mb-10 text-2xl italic text-white bottom-10">
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
            className="font-semibold animate-glow hover:underline"
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
            className="p-1 border-2 rounded-full h-14 w-14"
          />
          <h1 className="text-lg font-semibold text-[#f5f5f5] tracking-wide">
            Pioserve
          </h1>
        </div>
        <h2 className="mt-10 mb-10 text-4xl font-semibold text-center text-primary">
          {isRegister ? "Create Account" : "Sign In"}
        </h2>

        {/* COMPONENTS */}
        {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}

        <div className="flex justify-center mt-6">
          <p className="text-sm text-[#ababab] ">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <a
              onClick={() => setIsRegister(!isRegister)}
              className="font-semibold cursor-pointer text-primary hover:underline"
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
