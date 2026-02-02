/**
 * EndNode Component
 * Wrapper for rendering End-type nodes
 * End nodes have no outgoing connections
 */

import Node from "./Node";
import { NODE_TYPES } from "../../utils/constants";

const EndNode = ({ node, onDeleteClick, isSelected, isDeleting }) => {
  // Ensure we're working with an end node
  if (node.type !== NODE_TYPES.END) {
    console.warn("EndNode received non-end node type:", node.type);
  }

  return (
    <Node
      node={node}
      onDeleteClick={onDeleteClick}
      isSelected={isSelected}
      isDeleting={isDeleting}
    />
  );
};

export default EndNode;
