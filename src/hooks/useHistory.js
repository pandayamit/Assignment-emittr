/**
 * useHistory Hook
 * Provides undo/redo functionality for workflow state changes
 */

import { useState, useCallback } from "react";

const MAX_HISTORY_SIZE = 50; // Limit history stack to prevent memory issues

/**
 * Custom hook for managing undo/redo history
 * @param {any} initialState - Initial state value
 * @returns {Object} History management functions and state
 */
export const useHistory = (initialState) => {
  // Current state
  const [state, setState] = useState(initialState);

  // History stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  /**
   * Updates state and pushes current state to undo stack
   * Clears redo stack (new action invalidates future history)
   */
  const pushState = useCallback(
    (newState) => {
      setUndoStack((prev) => {
        const newStack = [...prev, state];
        // Trim stack if it exceeds max size
        if (newStack.length > MAX_HISTORY_SIZE) {
          return newStack.slice(-MAX_HISTORY_SIZE);
        }
        return newStack;
      });
      setRedoStack([]); // Clear redo stack on new action
      setState(newState);
    },
    [state],
  );

  /**
   * Undoes the last action
   * Moves current state to redo stack
   */
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];

    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, state]);
    setState(previousState);
  }, [undoStack, state]);

  /**
   * Redoes the last undone action
   * Moves state from redo stack to current
   */
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];

    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, state]);
    setState(nextState);
  }, [redoStack, state]);

  /**
   * Clears all history
   */
  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  /**
   * Resets to a new state and clears history
   */
  const reset = useCallback((newState) => {
    setState(newState);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    state,
    pushState,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    clearHistory,
    reset,
    historySize: undoStack.length,
  };
};

export default useHistory;
