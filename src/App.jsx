/**
 * Main App Component
 * Entry point for the Workflow Builder application
 */

import { useState } from "react";
import { WorkflowProvider } from "./context/WorkflowContext";
import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import AnimatedBackground from "./components/AnimatedBackground/AnimatedBackground";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <WorkflowProvider>
        <div className="app">
          {/* Top Toolbar with save/undo/redo buttons */}
          <Toolbar />

          {/* Main Workflow Canvas */}
          <main className="app-main">
            <Canvas />
          </main>
        </div>
      </WorkflowProvider>
    </>
  );
}

export default App;
