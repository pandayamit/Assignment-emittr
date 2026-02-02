/**
 * SplashScreen Component
 * Minimalist pulse animation with clean design
 */

import { useState, useEffect } from "react";
import "./SplashScreen.css";

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after initial delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Start fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Complete
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`splash-screen ${fadeOut ? "splash-screen--fade-out" : ""}`}
    >
      {/* Dark gradient background */}
      <div className="splash-bg" />

      {/* Pulsing circles */}
      <div className="splash-pulse-container">
        <div className="splash-pulse splash-pulse--1" />
        <div className="splash-pulse splash-pulse--2" />
        <div className="splash-pulse splash-pulse--3" />
      </div>

      {/* Main Content */}
      <div className={`splash-content ${showContent ? "show" : ""}`}>
        {/* Logo */}
        <div className="splash-logo-container">
          <div className="splash-logo-glow" />
          <img src="/emittr_logo.png" alt="EMITTR" className="splash-logo" />
        </div>

        {/* Brand Name */}
        <h1 className="splash-title">EMITTR</h1>

        {/* Tagline */}
        <p className="splash-tagline">Signal. Connect. Transform.</p>

        {/* Loading Bar */}
        <div className="splash-loader">
          <div className="splash-loader-bar" />
        </div>
      </div>

      {/* Scanning line */}
      <div className="splash-scan-line" />
    </div>
  );
};

export default SplashScreen;
