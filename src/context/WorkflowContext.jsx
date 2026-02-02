/**
 * Workflow Context
 * Provides global state management for the workflow builder
 * Uses React Context + useReducer for predictable state updates
 * Includes Undo/Redo functionality with history tracking
 */

import { createContext, useContext, useReducer, useCallback } from "react";
import { NODE_TYPES, BRANCH_LABELS, DEFAULT_LABELS } from "../utils/constants";
import {
  createNode,
  createStartNode,
  getAllDescendants,
} from "../utils/nodeHelpers";

// ============================================
// INITIAL STATE
// ============================================

const createInitialWorkflow = () => {
  const startNode = createStartNode();
  return {
    nodes: {
      [startNode.id]: startNode,
    },
    rootId: startNode.id,
    selectedNodeId: null,
  };
};

const createInitialState = () => ({
  ...createInitialWorkflow(),
  // History for undo/redo
  past: [],
  future: [],
});

// ============================================
// ACTION TYPES
// ============================================

const ACTION_TYPES = {
  ADD_NODE: "ADD_NODE",
  DELETE_NODE: "DELETE_NODE",
  UPDATE_NODE_LABEL: "UPDATE_NODE_LABEL",
  SELECT_NODE: "SELECT_NODE",
  RESET_WORKFLOW: "RESET_WORKFLOW",
  LOAD_WORKFLOW: "LOAD_WORKFLOW",
  UNDO: "UNDO",
  REDO: "REDO",
};

// Max history size to prevent memory issues
const MAX_HISTORY = 50;

// ============================================
// HELPER: Save state to history
// ============================================

const saveToHistory = (state) => {
  const snapshot = {
    nodes: state.nodes,
    rootId: state.rootId,
    selectedNodeId: state.selectedNodeId,
  };

  const newPast = [...state.past, snapshot].slice(-MAX_HISTORY);

  return {
    past: newPast,
    future: [], // Clear future when new action is taken
  };
};

// ============================================
// REDUCER
// ============================================

const workflowReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_NODE: {
      const { parentId, nodeType, branchLabel } = action.payload;
      const parent = state.nodes[parentId];

      if (!parent) return state;

      // Save current state to history before making changes
      const history = saveToHistory(state);

      // Create the new node
      const newNode = createNode(
        nodeType,
        DEFAULT_LABELS[nodeType] || "New Node",
        parentId,
        branchLabel,
      );

      // Update parent's children array
      const updatedParent = {
        ...parent,
        children: [...parent.children, newNode.id],
      };

      return {
        ...state,
        ...history,
        nodes: {
          ...state.nodes,
          [parentId]: updatedParent,
          [newNode.id]: newNode,
        },
      };
    }

    case ACTION_TYPES.DELETE_NODE: {
      const { nodeId } = action.payload;
      const nodeToDelete = state.nodes[nodeId];

      // Cannot delete root/start node
      if (!nodeToDelete || nodeToDelete.type === NODE_TYPES.START) {
        return state;
      }

      const parent = state.nodes[nodeToDelete.parentId];
      if (!parent) return state;

      // Save current state to history before making changes
      const history = saveToHistory(state);

      // Get all descendants to delete
      const descendantsToDelete = getAllDescendants(nodeId, state.nodes);

      // Remove deleted node from parent's children
      const updatedParent = {
        ...parent,
        children: parent.children.filter((id) => id !== nodeId),
      };

      // If the deleted node had children, reconnect them to parent
      // (This only works for action nodes with single child)
      if (
        nodeToDelete.children.length > 0 &&
        parent.type !== NODE_TYPES.BRANCH
      ) {
        // For non-branch parents, we can reconnect the first child
        const firstChildId = nodeToDelete.children[0];
        const firstChild = state.nodes[firstChildId];

        if (firstChild) {
          const updatedChild = {
            ...firstChild,
            parentId: parent.id,
            branchLabel: nodeToDelete.branchLabel, // Preserve branch label
          };

          updatedParent.children.push(firstChildId);

          // Create new nodes object without deleted descendants
          const newNodes = { ...state.nodes };
          descendantsToDelete.forEach((id) => {
            if (id !== firstChildId) {
              delete newNodes[id];
            }
          });

          return {
            ...state,
            ...history,
            nodes: {
              ...newNodes,
              [parent.id]: updatedParent,
              [firstChildId]: updatedChild,
            },
            selectedNodeId:
              state.selectedNodeId === nodeId ? null : state.selectedNodeId,
          };
        }
      }

      // For branch parents or nodes without children, just delete without reconnection
      const newNodes = { ...state.nodes };
      descendantsToDelete.forEach((id) => {
        delete newNodes[id];
      });

      return {
        ...state,
        ...history,
        nodes: {
          ...newNodes,
          [parent.id]: updatedParent,
        },
        selectedNodeId:
          state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      };
    }

    case ACTION_TYPES.UPDATE_NODE_LABEL: {
      const { nodeId, label } = action.payload;
      const node = state.nodes[nodeId];

      if (!node) return state;

      // Save current state to history before making changes
      const history = saveToHistory(state);

      return {
        ...state,
        ...history,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...node,
            label,
          },
        },
      };
    }

    case ACTION_TYPES.SELECT_NODE: {
      // Don't save selection to history (not a structural change)
      return {
        ...state,
        selectedNodeId: action.payload.nodeId,
      };
    }

    case ACTION_TYPES.RESET_WORKFLOW: {
      // Save current state to history before reset
      const history = saveToHistory(state);
      const initialWorkflow = createInitialWorkflow();

      return {
        ...initialWorkflow,
        ...history,
      };
    }

    case ACTION_TYPES.LOAD_WORKFLOW: {
      return {
        ...action.payload,
        selectedNodeId: null,
        past: [],
        future: [],
      };
    }

    case ACTION_TYPES.UNDO: {
      if (state.past.length === 0) return state;

      // Get the last state from past
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      // Save current state to future
      const currentSnapshot = {
        nodes: state.nodes,
        rootId: state.rootId,
        selectedNodeId: state.selectedNodeId,
      };

      return {
        ...previous,
        past: newPast,
        future: [currentSnapshot, ...state.future],
      };
    }

    case ACTION_TYPES.REDO: {
      if (state.future.length === 0) return state;

      // Get the first state from future
      const next = state.future[0];
      const newFuture = state.future.slice(1);

      // Save current state to past
      const currentSnapshot = {
        nodes: state.nodes,
        rootId: state.rootId,
        selectedNodeId: state.selectedNodeId,
      };

      return {
        ...next,
        past: [...state.past, currentSnapshot],
        future: newFuture,
      };
    }

    default:
      return state;
  }
};

// ============================================
// CONTEXT
// ============================================

const WorkflowContext = createContext(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

export const WorkflowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    workflowReducer,
    null,
    createInitialState,
  );

  // ----------------------------------------
  // Action Creators (memoized with useCallback)
  // ----------------------------------------

  /**
   * Adds a new node as a child of the specified parent
   */
  const addNode = useCallback((parentId, nodeType, branchLabel = null) => {
    dispatch({
      type: ACTION_TYPES.ADD_NODE,
      payload: { parentId, nodeType, branchLabel },
    });
  }, []);

  /**
   * Deletes a node and handles reconnection logic
   */
  const deleteNode = useCallback((nodeId) => {
    dispatch({
      type: ACTION_TYPES.DELETE_NODE,
      payload: { nodeId },
    });
  }, []);

  /**
   * Updates the label/title of a node
   */
  const updateNodeLabel = useCallback((nodeId, label) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_NODE_LABEL,
      payload: { nodeId, label },
    });
  }, []);

  /**
   * Selects a node (for editing or highlighting)
   */
  const selectNode = useCallback((nodeId) => {
    dispatch({
      type: ACTION_TYPES.SELECT_NODE,
      payload: { nodeId },
    });
  }, []);

  /**
   * Resets the workflow to initial state
   */
  const resetWorkflow = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET_WORKFLOW });
  }, []);

  /**
   * Saves the current workflow (logs to console)
   */
  const saveWorkflow = useCallback(() => {
    const workflowData = {
      nodes: state.nodes,
      rootId: state.rootId,
    };
    console.log("=== Workflow Saved ===");
    console.log(JSON.stringify(workflowData, null, 2));
    return workflowData;
  }, [state.nodes, state.rootId]);

  /**
   * Loads a workflow from data
   */
  const loadWorkflow = useCallback((workflowData) => {
    dispatch({
      type: ACTION_TYPES.LOAD_WORKFLOW,
      payload: workflowData,
    });
  }, []);

  /**
   * Undo the last action
   */
  const undo = useCallback(() => {
    dispatch({ type: ACTION_TYPES.UNDO });
  }, []);

  /**
   * Redo the last undone action
   */
  const redo = useCallback(() => {
    dispatch({ type: ACTION_TYPES.REDO });
  }, []);

  // ----------------------------------------
  // Context Value
  // ----------------------------------------

  const value = {
    // State
    nodes: state.nodes,
    rootId: state.rootId,
    selectedNodeId: state.selectedNodeId,

    // History state for UI (to disable buttons when empty)
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,

    // Actions
    addNode,
    deleteNode,
    updateNodeLabel,
    selectNode,
    resetWorkflow,
    saveWorkflow,
    loadWorkflow,
    undo,
    redo,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================

/**
 * Custom hook to access workflow context
 * Throws error if used outside of WorkflowProvider
 */
export const useWorkflow = () => {
  const context = useContext(WorkflowContext);

  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }

  return context;
};

export default WorkflowContext;
