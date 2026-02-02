/**
 * useWorkflow Hook
 * Re-export from context for cleaner imports
 * Also provides additional computed values and helpers
 */

import { useMemo } from "react";
import { useWorkflow as useWorkflowContext } from "../context/WorkflowContext";
import { NODE_TYPES } from "../utils/constants";
import {
  getNodeDepth,
  canHaveChildren,
  canBeDeleted,
  getBranchStatus,
} from "../utils/nodeHelpers";

/**
 * Enhanced workflow hook with computed values
 * @returns {Object} Workflow state, actions, and computed values
 */
export const useWorkflowWithHelpers = () => {
  const workflow = useWorkflowContext();
  const { nodes, rootId } = workflow;

  /**
   * Get the root/start node
   */
  const rootNode = useMemo(() => {
    return nodes[rootId];
  }, [nodes, rootId]);

  /**
   * Get array of all nodes for iteration
   */
  const nodesArray = useMemo(() => {
    return Object.values(nodes);
  }, [nodes]);

  /**
   * Count of total nodes
   */
  const nodeCount = useMemo(() => {
    return nodesArray.length;
  }, [nodesArray]);

  /**
   * Get maximum depth of the workflow tree
   */
  const maxDepth = useMemo(() => {
    let max = 0;
    nodesArray.forEach((node) => {
      const depth = getNodeDepth(node.id, nodes);
      if (depth > max) max = depth;
    });
    return max;
  }, [nodesArray, nodes]);

  /**
   * Helper to check if a node can have more children
   */
  const canAddChild = (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return false;
    if (!canHaveChildren(node.type)) return false;

    if (node.type === NODE_TYPES.BRANCH) {
      const { hasTrueBranch, hasFalseBranch } = getBranchStatus(node, nodes);
      return !hasTrueBranch || !hasFalseBranch;
    }

    // Action and Start nodes can have one child
    return node.children.length === 0;
  };

  /**
   * Get available branch labels for a branch node
   */
  const getAvailableBranches = (nodeId) => {
    const node = nodes[nodeId];
    if (!node || node.type !== NODE_TYPES.BRANCH) return [];

    const { hasTrueBranch, hasFalseBranch } = getBranchStatus(node, nodes);
    const available = [];

    if (!hasTrueBranch) available.push("true");
    if (!hasFalseBranch) available.push("false");

    return available;
  };

  return {
    ...workflow,

    // Computed values
    rootNode,
    nodesArray,
    nodeCount,
    maxDepth,

    // Helpers
    canAddChild,
    getAvailableBranches,
    canBeDeleted: (nodeId) => {
      const node = nodes[nodeId];
      return node ? canBeDeleted(node.type) : false;
    },
    canHaveChildren: (nodeId) => {
      const node = nodes[nodeId];
      return node ? canHaveChildren(node.type) : false;
    },
    getNodeDepth: (nodeId) => getNodeDepth(nodeId, nodes),
  };
};

// Re-export the base hook
export { useWorkflow } from "../context/WorkflowContext";

export default useWorkflowWithHelpers;
