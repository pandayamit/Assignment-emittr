/**
 * BranchNode Component
 * Wrapper for rendering Branch/Condition-type nodes
 * Branch nodes have multiple outgoing connections (True/False paths)
 * Add buttons are INSIDE the node
 */

import Node from "./Node";
import { NODE_TYPES, BRANCH_LABELS } from "../../utils/constants";
import { getBranchStatus } from "../../utils/nodeHelpers";
import { useWorkflow } from "../../context/WorkflowContext";

const BranchNode = ({
  node,
  onAddClick,
  onDeleteClick,
  isSelected,
  isDeleting,
  isHorizontal,
}) => {
  const { nodes } = useWorkflow();

  // Ensure we're working with a branch node
  if (node.type !== NODE_TYPES.BRANCH) {
    console.warn("BranchNode received non-branch node type:", node.type);
  }

  // Check which branches already have children
  const { hasTrueBranch, hasFalseBranch } = getBranchStatus(node, nodes);

  // Handle adding to specific branch
  const handleBranchAdd = (branchLabel) => {
    onAddClick?.(node.id, branchLabel);
  };

  return (
    <Node
      node={node}
      onDeleteClick={onDeleteClick}
      isSelected={isSelected}
      isDeleting={isDeleting}
      isHorizontal={isHorizontal}
    >
      {/* Branch-specific add buttons - INSIDE the node */}
      <div className="node-branch-buttons">
        <button
          className={`node-branch-add node-branch-add--true`}
          onClick={(e) => {
            e.stopPropagation();
            handleBranchAdd(BRANCH_LABELS.TRUE);
          }}
          disabled={hasTrueBranch}
          title={
            hasTrueBranch ? "True branch has a node" : "Add to True branch"
          }
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
          <span>True</span>
        </button>

        <button
          className={`node-branch-add node-branch-add--false`}
          onClick={(e) => {
            e.stopPropagation();
            handleBranchAdd(BRANCH_LABELS.FALSE);
          }}
          disabled={hasFalseBranch}
          title={
            hasFalseBranch ? "False branch has a node" : "Add to False branch"
          }
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
          <span>False</span>
        </button>
      </div>
    </Node>
  );
};

export default BranchNode;
