/**
 * Node Helper Functions
 * Utility functions for node operations like ID generation, tree traversal, etc.
 */

import { NODE_TYPES, BRANCH_LABELS } from "./constants";

// ============================================
// ID GENERATION
// ============================================

/**
 * Generates a unique ID for nodes
 * Uses timestamp + random string for uniqueness
 * @returns {string} Unique node ID
 */
export const generateNodeId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `node_${timestamp}_${randomStr}`;
};

// ============================================
// NODE CREATION
// ============================================

/**
 * Creates a new node object with default values
 * @param {string} type - Node type (action, branch, end)
 * @param {string} label - Display label for the node
 * @param {string|null} parentId - Parent node ID (null for root)
 * @param {string|null} branchLabel - Branch label ('true' or 'false') for branch children
 * @returns {Object} New node object
 */
export const createNode = (
  type,
  label,
  parentId = null,
  branchLabel = null,
) => {
  return {
    id: generateNodeId(),
    type,
    label,
    parentId,
    branchLabel,
    children: [],
  };
};

/**
 * Creates the initial "Start" node for a new workflow
 * @returns {Object} Start node object
 */
export const createStartNode = () => {
  return {
    id: "start_node",
    type: NODE_TYPES.START,
    label: "Start",
    parentId: null,
    branchLabel: null,
    children: [],
  };
};

// ============================================
// TREE OPERATIONS
// ============================================

/**
 * Checks if a node can have children
 * @param {string} nodeType - Type of the node
 * @returns {boolean} Whether the node can have children
 */
export const canHaveChildren = (nodeType) => {
  return nodeType !== NODE_TYPES.END;
};

/**
 * Checks if a node can be deleted
 * Start node cannot be deleted
 * @param {string} nodeType - Type of the node
 * @returns {boolean} Whether the node can be deleted
 */
export const canBeDeleted = (nodeType) => {
  return nodeType !== NODE_TYPES.START;
};

/**
 * Gets the maximum number of children for a node type
 * @param {string} nodeType - Type of the node
 * @returns {number} Maximum children (Infinity for branch, 1 for action, 0 for end)
 */
export const getMaxChildren = (nodeType) => {
  switch (nodeType) {
    case NODE_TYPES.BRANCH:
      return 2; // True and False branches
    case NODE_TYPES.END:
      return 0;
    default:
      return 1; // Action and Start have single child
  }
};

/**
 * Checks if a branch node has both true and false children
 * @param {Object} node - The node object
 * @param {Object} nodes - All nodes in the workflow
 * @returns {Object} Object indicating which branches exist
 */
export const getBranchStatus = (node, nodes) => {
  if (node.type !== NODE_TYPES.BRANCH) {
    return { hasTrueBranch: false, hasFalseBranch: false };
  }

  let hasTrueBranch = false;
  let hasFalseBranch = false;

  node.children.forEach((childId) => {
    const child = nodes[childId];
    if (child) {
      if (child.branchLabel === BRANCH_LABELS.TRUE) {
        hasTrueBranch = true;
      } else if (child.branchLabel === BRANCH_LABELS.FALSE) {
        hasFalseBranch = true;
      }
    }
  });

  return { hasTrueBranch, hasFalseBranch };
};

// ============================================
// WORKFLOW VALIDATION
// ============================================

/**
 * Validates the workflow structure
 * @param {Object} workflow - The workflow state
 * @returns {Object} Validation result with isValid and errors
 */
export const validateWorkflow = (workflow) => {
  const errors = [];
  const { nodes, rootId } = workflow;

  // Check if root exists
  if (!nodes[rootId]) {
    errors.push("Root node is missing");
  }

  // Check for orphan nodes (nodes without valid parent)
  Object.values(nodes).forEach((node) => {
    if (node.parentId && !nodes[node.parentId]) {
      errors.push(`Node "${node.label}" has invalid parent`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================
// TREE TRAVERSAL
// ============================================

/**
 * Gets all descendants of a node (including the node itself)
 * @param {string} nodeId - Starting node ID
 * @param {Object} nodes - All nodes in the workflow
 * @returns {string[]} Array of node IDs
 */
export const getAllDescendants = (nodeId, nodes) => {
  const descendants = [nodeId];
  const node = nodes[nodeId];

  if (node && node.children) {
    node.children.forEach((childId) => {
      descendants.push(...getAllDescendants(childId, nodes));
    });
  }

  return descendants;
};

/**
 * Gets the depth of a node in the tree
 * @param {string} nodeId - Node ID
 * @param {Object} nodes - All nodes in the workflow
 * @returns {number} Depth level (0 for root)
 */
export const getNodeDepth = (nodeId, nodes) => {
  const node = nodes[nodeId];
  if (!node || !node.parentId) {
    return 0;
  }
  return 1 + getNodeDepth(node.parentId, nodes);
};
