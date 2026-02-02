/**
 * useResponsiveLayout hook
 * Returns responsive node dimensions based on screen width
 */

import { useState, useEffect } from "react";
import { LAYOUT } from "../utils/constants";

const useResponsiveLayout = () => {
  const [layout, setLayout] = useState(LAYOUT);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      if (width <= 480) {
        // Mobile
        setLayout({
          NODE_WIDTH: 140,
          NODE_HEIGHT: 90,
          HORIZONTAL_GAP: 50,
          VERTICAL_GAP: 20,
          CANVAS_PADDING: 20,
        });
      } else if (width <= 768) {
        // Tablet
        setLayout({
          NODE_WIDTH: 160,
          NODE_HEIGHT: 100,
          HORIZONTAL_GAP: 60,
          VERTICAL_GAP: 25,
          CANVAS_PADDING: 30,
        });
      } else {
        // Desktop
        setLayout(LAYOUT);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return layout;
};

export default useResponsiveLayout;
