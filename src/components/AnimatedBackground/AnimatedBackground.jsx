/**
 * AnimatedBackground Component
 * Vibrant space theme with glowing orbs, particles, grid, and scan line
 */

import "./AnimatedBackground.css";

const AnimatedBackground = () => {
  return (
    <div className="space-bg">
      {/* Animated grid pattern */}
      <div className="space-bg__grid" />

      {/* Glowing orbs */}
      <div className="space-bg__orb space-bg__orb--1" />
      <div className="space-bg__orb space-bg__orb--2" />
      <div className="space-bg__orb space-bg__orb--3" />

      {/* Floating particles */}
      <div className="space-bg__particles">
        <div className="space-bg__particle space-bg__particle--1" />
        <div className="space-bg__particle space-bg__particle--2" />
        <div className="space-bg__particle space-bg__particle--3" />
        <div className="space-bg__particle space-bg__particle--4" />
        <div className="space-bg__particle space-bg__particle--5" />
        <div className="space-bg__particle space-bg__particle--6" />
        <div className="space-bg__particle space-bg__particle--7" />
        <div className="space-bg__particle space-bg__particle--8" />
        <div className="space-bg__particle space-bg__particle--9" />
        <div className="space-bg__particle space-bg__particle--10" />
        <div className="space-bg__particle space-bg__particle--11" />
        <div className="space-bg__particle space-bg__particle--12" />
        <div className="space-bg__particle space-bg__particle--13" />
        <div className="space-bg__particle space-bg__particle--14" />
        <div className="space-bg__particle space-bg__particle--15" />
        <div className="space-bg__particle space-bg__particle--16" />
        <div className="space-bg__particle space-bg__particle--17" />
        <div className="space-bg__particle space-bg__particle--18" />
        <div className="space-bg__particle space-bg__particle--19" />
        <div className="space-bg__particle space-bg__particle--20" />
      </div>

      {/* Ambient glow wave */}
      <div className="space-bg__wave" />

      {/* Vignette */}
      <div className="space-bg__vignette" />
    </div>
  );
};

export default AnimatedBackground;
