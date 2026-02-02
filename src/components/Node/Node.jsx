/**
 * Node Component
 * Base component for rendering workflow nodes
 * Features: pencil edit icon, internal add button
 */

import { useState, useRef, useEffect } from "react";
import { NODE_TYPES, NODE_COLORS } from "../../utils/constants";
import { useWorkflow } from "../../context/WorkflowContext";
import "./Node.css";

const Node = ({
  node,
  onAddClick,
  onDeleteClick,
  isSelected = false,
  isDeleting = false,
  isHorizontal = true,
  children,
}) => {
  const { updateNodeLabel, selectNode } = useWorkflow();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const inputRef = useRef(null);

  // Get node colors based on type
  const colors = NODE_COLORS[node.type] || NODE_COLORS[NODE_TYPES.ACTION];

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle edit button click
  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditValue(node.label);
    setIsEditing(true);
  };

  // Handle label save
  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== node.label) {
      updateNodeLabel(node.id, trimmedValue);
    } else {
      setEditValue(node.label);
    }
    setIsEditing(false);
  };

  // Handle key events in edit mode
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(node.label);
      setIsEditing(false);
    }
  };

  // Handle node click (selection)
  const handleClick = (e) => {
    e.stopPropagation();
    selectNode(node.id);
  };

  // Check if node can be deleted
  const canDelete = node.type !== NODE_TYPES.START;

  // Check if node can have children
  const canAddChildren = node.type !== NODE_TYPES.END;

  // Show add button for non-end, non-branch nodes without children
  const showAddButton =
    canAddChildren &&
    node.type !== NODE_TYPES.BRANCH &&
    node.children.length === 0;

  return (
    <div
      className={`node node--${node.type} ${isSelected ? "node--selected" : ""} ${isDeleting ? "node--deleting" : ""}`}
      style={{
        "--node-color": colors.primary,
        "--node-gradient": colors.gradient,
        "--node-border": colors.border,
      }}
      onClick={handleClick}
    >
      {/* Delete Button */}
      {canDelete && (
        <button
          className="node-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick?.(node.id);
          }}
          title="Delete node"
          aria-label="Delete node"
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
      )}

      {/* Node Content */}
      <div className="node-content">
        {/* Node Icon */}
        <div className="node-icon">
          {node.type === NODE_TYPES.START && (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
          {node.type === NODE_TYPES.ACTION && (
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
          {node.type === NODE_TYPES.BRANCH && (
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
          {node.type === NODE_TYPES.END && (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          )}
        </div>

        {/* Label - with edit input or display */}
        <div className="node-label-container">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="node-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              maxLength={30}
            />
          ) : (
            <>
              <span className="node-label">{node.label}</span>
              {/* Pencil Edit Icon */}
              <button
                className="node-edit-btn"
                onClick={handleEditClick}
                title="Edit label"
                aria-label="Edit label"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Node Type Badge */}
        <span className="node-type">{node.type}</span>

        {/* Internal Add Button (for non-end, non-branch nodes) */}
        {showAddButton && (
          <button
            className="node-add-internal"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.(node.id);
            }}
            title="Add next step"
            aria-label="Add next step"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Custom children (for branch nodes' add buttons) */}
      {children}
    </div>
  );
};

export default Node;
