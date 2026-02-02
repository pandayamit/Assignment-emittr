/**
 * ActionNode Component
 * Wrapper for rendering Action-type nodes
 * Action nodes represent single tasks/steps with one outgoing connection
 */

import Node from "./Node";
import { NODE_TYPES } from "../../utils/constants";

const ActionNode = ({
  node,
  onAddClick,
  onDeleteClick,
  isSelected,
  isDeleting,
}) => {
  // Ensure we're working with an action node
  if (node.type !== NODE_TYPES.ACTION) {
    console.warn("ActionNode received non-action node type:", node.type);
  }

  return (
    <Node
      node={node}
      onAddClick={onAddClick}
      onDeleteClick={onDeleteClick}
      isSelected={isSelected}
      isDeleting={isDeleting}
    />
  );
};

export default ActionNode;
