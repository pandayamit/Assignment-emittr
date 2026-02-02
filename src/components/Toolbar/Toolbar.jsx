/**
 * Toolbar Component
 * Top navigation bar with workflow actions (save, undo, redo, reset)
 */

import { useEffect, useState } from "react";
import { useWorkflow } from "../../context/WorkflowContext";
import "./Toolbar.css";

const Toolbar = () => {
  const { saveWorkflow, resetWorkflow, undo, redo, canUndo, canRedo, nodes } =
    useWorkflow();

  const [showToast, setShowToast] = useState(false);

  // Calculate node count
  const count = Object.keys(nodes).length;

  // Handle save with toast notification
  const handleSave = () => {
    saveWorkflow();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Ctrl+Shift+Z or Ctrl+Y for Redo
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        if (canRedo) redo();
      }
      // Ctrl+S for Save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo, handleSave]);

  return (
    <>
      <header className="toolbar">
        {/* Logo / Title */}
        <div className="toolbar-brand">
          <img
            src="/emittr_logo.png"
            alt="EMITTR Logo"
            className="toolbar-logo"
          />
          <h1 className="toolbar-title">EMITTR</h1>
          <span className="toolbar-badge">{count} nodes</span>
        </div>

        {/* Action Buttons */}
        <div className="toolbar-actions">
          {/* Undo Button */}
          <button
            className="toolbar-btn toolbar-btn--secondary"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <svg
              className="toolbar-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
            </svg>
            <span>Undo</span>
          </button>

          {/* Redo Button */}
          <button
            className="toolbar-btn toolbar-btn--secondary"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <svg
              className="toolbar-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
            </svg>
            <span>Redo</span>
          </button>

          {/* Divider */}
          <div className="toolbar-divider" />

          {/* Save Button */}
          <button
            className="toolbar-btn toolbar-btn--primary"
            onClick={handleSave}
            title="Save workflow to console (Ctrl+S)"
          >
            <svg
              className="toolbar-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17,21 17,13 7,13 7,21" />
              <polyline points="7,3 7,8 15,8" />
            </svg>
            <span>Save</span>
          </button>

          {/* Divider */}
          <div className="toolbar-divider" />

          {/* Reset Button */}
          <button
            className="toolbar-btn toolbar-btn--danger"
            onClick={resetWorkflow}
            title="Reset workflow to initial state"
          >
            <svg
              className="toolbar-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Toast Notification - Outside header for proper fixed positioning */}
      {showToast && (
        <div className="toolbar-toast">
          <svg
            className="toolbar-toast-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
          <span>Workflow saved to console!</span>
        </div>
      )}
    </>
  );
};

export default Toolbar;
