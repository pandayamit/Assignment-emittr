/**
 * Constants for the Workflow Builder
 * Contains all node types, colors, and default configurations
 */

// ============================================
// NODE TYPES
// ============================================

export const NODE_TYPES = {
  START: "start",
  ACTION: "action",
  BRANCH: "branch",
  END: "end",
};

// ============================================
// BRANCH LABELS
// ============================================

export const BRANCH_LABELS = {
  TRUE: "true",
  FALSE: "false",
};

// ============================================
// NODE COLORS
// Each node type has a primary color and gradient
// ============================================

export const NODE_COLORS = {
  [NODE_TYPES.START]: {
    primary: "#22c55e", // Green
    gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    border: "#15803d",
    text: "#ffffff",
  },
  [NODE_TYPES.ACTION]: {
    primary: "#6366f1", // Purple/Indigo
    gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    border: "#4338ca",
    text: "#ffffff",
  },
  [NODE_TYPES.BRANCH]: {
    primary: "#f59e0b", // Orange/Amber
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    border: "#b45309",
    text: "#ffffff",
  },
  [NODE_TYPES.END]: {
    primary: "#ef4444", // Red
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    border: "#b91c1c",
    text: "#ffffff",
  },
};

// ============================================
// NODE DISPLAY LABELS
// ============================================

export const NODE_LABELS = {
  [NODE_TYPES.START]: "Start",
  [NODE_TYPES.ACTION]: "Action",
  [NODE_TYPES.BRANCH]: "Condition",
  [NODE_TYPES.END]: "End",
};

// ============================================
// LAYOUT CONFIGURATION
// ============================================

export const LAYOUT = {
  NODE_WIDTH: 180, // Width of each node in pixels
  NODE_HEIGHT: 110, // Height of each node (increased for internal buttons)
  HORIZONTAL_GAP: 80, // Gap between parent and child (horizontal)
  VERTICAL_GAP: 30, // Gap between siblings (vertical)
  CANVAS_PADDING: 40, // Padding around the canvas
};

// ============================================
// DEFAULT NODE LABELS
// Used when creating new nodes
// ============================================

export const DEFAULT_LABELS = {
  [NODE_TYPES.START]: "Start",
  [NODE_TYPES.ACTION]: "New Action",
  [NODE_TYPES.BRANCH]: "Condition",
  [NODE_TYPES.END]: "End",
};
