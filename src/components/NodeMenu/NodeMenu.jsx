/**
 * NodeMenu Component
 * Context menu/popup for selecting node type when adding new nodes
 */

import { useEffect, useRef } from "react";
import { NODE_TYPES, NODE_COLORS, NODE_LABELS } from "../../utils/constants";
import "./NodeMenu.css";

const NodeMenu = ({
  isOpen,
  position = { x: 0, y: 0 },
  onSelect,
  onClose,
  excludeTypes = [], // Types to exclude from menu
}) => {
  const menuRef = useRef(null);

  // Available node types for selection (excluding Start which cannot be added)
  const availableTypes = [
    NODE_TYPES.ACTION,
    NODE_TYPES.BRANCH,
    NODE_TYPES.END,
  ].filter((type) => !excludeTypes.includes(type));

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="node-menu"
      ref={menuRef}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="node-menu-header">
        <span>Add Node</span>
        <button
          className="node-menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="node-menu-options">
        {availableTypes.map((type) => {
          const colors = NODE_COLORS[type];
          return (
            <button
              key={type}
              className="node-menu-option"
              onClick={() => {
                onSelect?.(type);
                onClose?.();
              }}
              style={{
                "--option-color": colors.primary,
              }}
            >
              <div
                className="node-menu-option-icon"
                style={{ background: colors.gradient }}
              >
                {type === NODE_TYPES.ACTION && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="12" x2="15" y2="12" />
                  </svg>
                )}
                {type === NODE_TYPES.BRANCH && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 3h5v5" />
                    <path d="M8 3H3v5" />
                    <path d="M12 22v-8.5a3 3 0 00-3-3H3" />
                    <path d="M12 22v-8.5a3 3 0 013-3h6" />
                  </svg>
                )}
                {type === NODE_TYPES.END && (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                )}
              </div>
              <div className="node-menu-option-content">
                <span className="node-menu-option-name">
                  {NODE_LABELS[type]}
                </span>
                <span className="node-menu-option-desc">
                  {type === NODE_TYPES.ACTION && "Single step with one output"}
                  {type === NODE_TYPES.BRANCH &&
                    "Condition with True/False paths"}
                  {type === NODE_TYPES.END && "Terminates the workflow"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NodeMenu;
