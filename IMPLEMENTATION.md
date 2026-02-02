# Workflow Builder - Implementation Plan

## Overview

A visual workflow builder UI built with React that allows users to create, edit, and manage workflows through an intuitive drag-and-drop-like interface with nodes and connections.

---

## Project Structure

```
emittr/src/
├── components/
│   ├── Canvas/
│   │   ├── Canvas.jsx       # Main workflow canvas with SVG connections
│   │   └── Canvas.css
│   ├── Connection/
│   │   ├── Connection.jsx   # SVG bezier curves between nodes
│   │   └── Connection.css
│   ├── Node/
│   │   ├── Node.jsx         # Base node component
│   │   ├── Node.css
│   │   ├── ActionNode.jsx   # Action node wrapper
│   │   ├── BranchNode.jsx   # Condition node with True/False
│   │   ├── EndNode.jsx      # End node wrapper
│   │   └── index.js
│   ├── NodeMenu/
│   │   ├── NodeMenu.jsx     # Popup for selecting node types
│   │   └── NodeMenu.css
│   └── Toolbar/
│       ├── Toolbar.jsx      # Header with Save/Reset buttons
│       └── Toolbar.css
├── context/
│   └── WorkflowContext.jsx  # Global state management with useReducer
├── hooks/
│   ├── useHistory.js        # Undo/redo functionality (prepared)
│   └── useWorkflow.js       # Enhanced workflow hook with helpers
├── utils/
│   ├── constants.js         # Node types, colors, layout config
│   └── nodeHelpers.js       # Utility functions for nodes/tree
├── App.jsx
├── App.css
└── index.css                # Design system with CSS variables
```

---

## Implementation Phases

### Phase 1: Project Setup & Data Modeling ✅

**Goal:** Establish foundation with data models and state management.

| File                  | Purpose                                                                             |
| --------------------- | ----------------------------------------------------------------------------------- |
| `constants.js`        | `NODE_TYPES`, `BRANCH_LABELS`, `NODE_COLORS`, `LAYOUT` config                       |
| `nodeHelpers.js`      | `generateNodeId()`, `createNode()`, `canHaveChildren()`, `getBranchStatus()`        |
| `WorkflowContext.jsx` | Global state with `useReducer`, actions: `addNode`, `deleteNode`, `updateNodeLabel` |
| `useWorkflow.js`      | Helper hook with computed values like `rootNode`, `nodeCount`, `canAddChild()`      |

**Data Model:**

```javascript
// Node structure
{
  id: "node_1234567890",
  type: "action" | "branch" | "end" | "start",
  label: "My Action",
  children: ["node_abc", "node_def"],
  branchLabel: "true" | "false" | null  // For branch children
}

// Workflow state
{
  nodes: { [nodeId]: Node },
  rootId: "node_start",
  selectedNodeId: null
}
```

---

### Phase 2: Core UI Components ✅

**Goal:** Build interactive node components and connections.

#### Node Component (`Node.jsx`)

- Renders node with type-specific icon and colors
- **Pencil icon** for inline label editing (click to edit)
- **Internal "+ Add" button** inside node for adding children
- Delete button (X) appears on hover
- Selection highlighting

#### BranchNode Component (`BranchNode.jsx`)

- Extends base Node with **"+True" and "+False"** buttons inside
- Buttons disabled when branch already has a child

#### Connection Component (`Connection.jsx`)

- SVG bezier curves connecting node edges
- **Dashed "thread-like"** stroke with animated purple dot
- True/False labels on branch connections
- Start/end dots at connection points

#### NodeMenu Component (`NodeMenu.jsx`)

- Popup menu for selecting node type (Action, Condition, End)
- Appears when clicking add buttons

---

### Phase 3: Canvas & Layout Engine ✅

**Goal:** Horizontal tree layout with proper spacing.

#### Canvas Component (`Canvas.jsx`)

- **Horizontal flow:** Nodes arranged left-to-right
- **Start node centered** when alone (horizontally + vertically)
- Calculates subtree heights for vertical spacing of branches
- SVG and nodes share the **same coordinate system** (critical for alignment)

#### Layout Algorithm

```javascript
// Recursive position calculation
calculatePositions(nodeId, depth, startY) {
  x = 80 + depth * (NODE_WIDTH + HORIZONTAL_GAP)
  y = startY + subtreeHeight/2 - NODE_HEIGHT/2  // Center among children

  // Position children below each other
  childStartY = startY
  children.forEach((child) => {
    calculatePositions(child, depth + 1, childStartY)
    childStartY += childSubtreeHeight + VERTICAL_GAP
  })
}
```

#### Connection Calculation

```javascript
// Start: right edge of parent, vertically centered
startX = parentPos.x + NODE_WIDTH;
startY = parentPos.y + NODE_HEIGHT / 2;

// End: left edge of child, vertically centered
endX = childPos.x;
endY = childPos.y + NODE_HEIGHT / 2;
```

---

### Phase 4: Interactions & Editing ✅

**Implemented Features:**

- ✅ Add nodes via internal buttons
- ✅ Delete nodes (reconnects children to grandparent)
- ✅ Edit labels via pencil icon click
- ✅ Node selection highlighting
- ✅ Save workflow (logs JSON to console)
- ✅ Reset workflow to initial state

---

### Phase 5: Bonus Features (Prepared)

| Feature            | Status                                     |
| ------------------ | ------------------------------------------ |
| Undo/Redo          | `useHistory.js` created, needs integration |
| Local Storage      | Save/Load infrastructure ready             |
| Keyboard Shortcuts | Not implemented                            |
| Drag to Reorder    | Not implemented                            |

---

## Design System

### Colors (CSS Variables)

```css
--accent-primary: #6366f1; /* Purple */
--accent-success: #22c55e; /* Green (Start) */
--accent-warning: #f59e0b; /* Orange (Branch) */
--accent-danger: #ef4444; /* Red (End) */
```

### Layout Constants

```javascript
NODE_WIDTH: 180,
NODE_HEIGHT: 110,
HORIZONTAL_GAP: 80,
VERTICAL_GAP: 30
```

---

## Key Technical Decisions

1. **React Context + useReducer** for state management (no external libraries)
2. **SVG bezier curves** for connections (no animation libraries)
3. **Absolute positioning** for both SVG and nodes (shared coordinate system)
4. **Internal buttons** for add/edit actions (cleaner UX than external hover buttons)
5. **CSS variables** for theming and consistent design tokens

---

## Running the Project

```bash
cd emittr
npm install
npm run dev
```

Open http://localhost:5173 in your browser.
