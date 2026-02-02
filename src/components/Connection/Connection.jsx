/**
 * Connection Component
 * Smooth bezier curves with animated arrow and glowing effects
 */

import { NODE_COLORS, NODE_TYPES } from "../../utils/constants";
import "./Connection.css";

const Connection = ({
  startX,
  startY,
  endX,
  endY,
  branchLabel = null,
  isHighlighted = false,
  isHorizontal = true,
  targetType = NODE_TYPES.ACTION,
}) => {
  // Get color based on target node type
  const targetColors =
    NODE_COLORS[targetType] || NODE_COLORS[NODE_TYPES.ACTION];
  const connectionColor = targetColors.primary;

  // Calculate the bezier curve path
  const dx = endX - startX;
  const dy = endY - startY;

  let pathD;
  let labelX, labelY;

  if (isHorizontal) {
    const controlPointOffset = Math.max(40, Math.abs(dx) * 0.35);
    pathD = `M ${startX} ${startY} C ${startX + controlPointOffset} ${startY}, ${endX - controlPointOffset} ${endY}, ${endX} ${endY}`;
    labelX = startX + dx / 2;
    labelY = startY + dy / 2 - 5;
  } else {
    const controlPointOffset = Math.max(40, Math.abs(dy) * 0.35);
    pathD = `M ${startX} ${startY} C ${startX} ${startY + controlPointOffset}, ${endX} ${endY - controlPointOffset}, ${endX} ${endY}`;
    labelX = startX + dx / 2;
    labelY = startY + dy / 2;
  }

  // Unique ID for this connection's elements
  const uniqueId = `conn-${startX}-${startY}-${endX}-${endY}`.replace(
    /\./g,
    "_",
  );

  return (
    <g
      className={`connection ${isHighlighted ? "connection--highlighted" : ""}`}
      style={{ "--connection-color": connectionColor }}
    >
      {/* Glow effect layer */}
      <path
        className="connection-glow"
        d={pathD}
        fill="none"
        stroke={connectionColor}
      />

      {/* Main slim thread path */}
      <path
        className="connection-path"
        d={pathD}
        fill="none"
        stroke={connectionColor}
      />

      {/* Animated arrow traveling along the path */}
      <g className="connection-arrow">
        <polygon points="-5,-4 5,0 -5,4" fill={connectionColor}>
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={pathD}
            rotate="auto"
          />
        </polygon>
      </g>

      {/* Branch label */}
      {branchLabel && (
        <g className="connection-label-group">
          <rect
            className="connection-label-bg"
            x={labelX - 24}
            y={labelY - 10}
            width="48"
            height="20"
            rx="10"
          />
          <text
            className={`connection-label connection-label--${branchLabel}`}
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
          >
            {branchLabel === "true" ? "TRUE" : "FALSE"}
          </text>
        </g>
      )}

      {/* End point indicator */}
      <circle
        className="connection-end-dot"
        cx={endX}
        cy={endY}
        r="4"
        fill={connectionColor}
      />
    </g>
  );
};

export default Connection;
