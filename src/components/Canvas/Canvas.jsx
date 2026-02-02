/**
 * Canvas Component
 * Main workflow canvas that renders the node tree with connections
 * HORIZONTAL LAYOUT - Connections properly aligned with node centers
 */

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useWorkflow } from "../../context/WorkflowContext";
import { NODE_TYPES } from "../../utils/constants";
import useResponsiveLayout from "../../hooks/useResponsiveLayout";
import { Node, BranchNode, EndNode } from "../Node";
import Connection from "../Connection/Connection";
import NodeMenu from "../NodeMenu/NodeMenu";
import "./Canvas.css";

const Canvas = () => {
  const { nodes, rootId, addNode, deleteNode, selectedNodeId, selectNode } =
    useWorkflow();
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [deletingNodeIds, setDeletingNodeIds] = useState(new Set());

  // Get canvas size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // State for NodeMenu popup
  const [menuState, setMenuState] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    parentId: null,
    branchLabel: null,
  });

  // Get responsive layout dimensions
  const { NODE_WIDTH, NODE_HEIGHT, HORIZONTAL_GAP, VERTICAL_GAP } =
    useResponsiveLayout();

  // Calculate node positions for HORIZONTAL layout
  const nodePositions = useMemo(() => {
    const positions = {};
    const nodeCount = Object.keys(nodes).length;

    // If only the start node exists, center it
    if (nodeCount === 1 && rootId && nodes[rootId]) {
      positions[rootId] = {
        x: (canvasSize.width - NODE_WIDTH) / 2,
        y: (canvasSize.height - NODE_HEIGHT) / 2,
      };
      return positions;
    }

    // Calculate subtree heights for proper vertical spacing
    const getSubtreeHeight = (nodeId) => {
      const node = nodes[nodeId];
      if (!node || node.children.length === 0) {
        return NODE_HEIGHT;
      }

      let totalHeight = 0;
      node.children.forEach((childId, idx) => {
        totalHeight += getSubtreeHeight(childId);
        if (idx < node.children.length - 1) {
          totalHeight += VERTICAL_GAP;
        }
      });

      return Math.max(NODE_HEIGHT, totalHeight);
    };

    // Recursive function to calculate positions
    const calculatePositions = (nodeId, depth = 0, startY = 0) => {
      const node = nodes[nodeId];
      if (!node) return NODE_HEIGHT;

      // X position based on depth (left to right)
      const x = 80 + depth * (NODE_WIDTH + HORIZONTAL_GAP);

      // Get child subtree heights
      const childHeights = node.children.map((childId) =>
        getSubtreeHeight(childId),
      );
      const totalChildrenHeight = childHeights.reduce(
        (sum, h, idx) =>
          sum + h + (idx < childHeights.length - 1 ? VERTICAL_GAP : 0),
        0,
      );

      // Y position: center relative to children
      let y;
      if (node.children.length === 0) {
        y = startY;
      } else {
        y = startY + totalChildrenHeight / 2 - NODE_HEIGHT / 2;
      }

      positions[nodeId] = { x, y };

      // Position children
      let childStartY = startY;
      node.children.forEach((childId, index) => {
        calculatePositions(childId, depth + 1, childStartY);
        childStartY += childHeights[index] + VERTICAL_GAP;
      });

      return totalChildrenHeight || NODE_HEIGHT;
    };

    // Start from root - center vertically
    if (rootId && nodes[rootId]) {
      const totalHeight = getSubtreeHeight(rootId);
      const startY = Math.max(60, (canvasSize.height - totalHeight) / 2);
      calculatePositions(rootId, 0, startY);
    }

    return positions;
  }, [
    nodes,
    rootId,
    canvasSize,
    NODE_WIDTH,
    NODE_HEIGHT,
    HORIZONTAL_GAP,
    VERTICAL_GAP,
  ]);

  // Calculate canvas content bounds
  const canvasBounds = useMemo(() => {
    const positions = Object.values(nodePositions);
    if (positions.length === 0)
      return { width: canvasSize.width, height: canvasSize.height };

    const maxX = Math.max(...positions.map((p) => p.x + NODE_WIDTH));
    const maxY = Math.max(...positions.map((p) => p.y + NODE_HEIGHT));

    // Add extra width for the menu when it's open (280px menu + padding)
    const extraWidth = menuState.isOpen ? 350 : 100;

    return {
      width: Math.max(canvasSize.width, maxX + extraWidth),
      height: Math.max(canvasSize.height, maxY + 100),
    };
  }, [nodePositions, canvasSize, NODE_WIDTH, NODE_HEIGHT, menuState.isOpen]);

  // Handle add button click
  const handleAddClick = useCallback(
    (parentId, branchLabel = null) => {
      const parentPos = nodePositions[parentId];
      if (!parentPos) return;

      // Position menu to the RIGHT of the node (in canvas coordinates)
      // Since menu is position:absolute, it scrolls with the canvas content
      const menuX = parentPos.x + NODE_WIDTH + 30;
      const menuY = parentPos.y + 20;

      setMenuState({
        isOpen: true,
        position: { x: menuX, y: menuY },
        parentId,
        branchLabel,
      });
    },
    [nodePositions, NODE_WIDTH],
  );

  const handleNodeTypeSelect = useCallback(
    (nodeType) => {
      if (menuState.parentId) {
        addNode(menuState.parentId, nodeType, menuState.branchLabel);
      }
      setMenuState((prev) => ({ ...prev, isOpen: false }));
    },
    [menuState.parentId, menuState.branchLabel, addNode],
  );

  const handleDeleteClick = useCallback(
    (nodeId) => {
      // Add animation class first
      setDeletingNodeIds((prev) => new Set([...prev, nodeId]));

      // Wait for animation to complete, then delete
      setTimeout(() => {
        deleteNode(nodeId);
        setDeletingNodeIds((prev) => {
          const next = new Set(prev);
          next.delete(nodeId);
          return next;
        });
      }, 400); // Match animation duration
    },
    [deleteNode],
  );

  const handleMenuClose = useCallback(() => {
    setMenuState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleCanvasClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  // Render a node
  const renderNode = (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const position = nodePositions[nodeId];
    if (!position) return null;

    const isSelected = selectedNodeId === nodeId;
    const isDeleting = deletingNodeIds.has(nodeId);
    const style = {
      position: "absolute",
      left: position.x,
      top: position.y,
      width: NODE_WIDTH,
    };

    const commonProps = {
      node,
      isSelected,
      isDeleting,
      onDeleteClick: handleDeleteClick,
      isHorizontal: true,
    };

    let nodeElement;
    switch (node.type) {
      case NODE_TYPES.BRANCH:
        nodeElement = (
          <BranchNode {...commonProps} onAddClick={handleAddClick} />
        );
        break;
      case NODE_TYPES.END:
        nodeElement = <EndNode {...commonProps} />;
        break;
      default:
        nodeElement = <Node {...commonProps} onAddClick={handleAddClick} />;
    }

    return (
      <div key={nodeId} style={style}>
        {nodeElement}
      </div>
    );
  };

  // Render connections - CRITICAL: Use same coordinate system as nodes
  const renderConnections = () => {
    const connections = [];

    Object.values(nodes).forEach((node) => {
      const parentPos = nodePositions[node.id];
      if (!parentPos) return;

      node.children.forEach((childId) => {
        const childNode = nodes[childId];
        const childPos = nodePositions[childId];
        if (!childPos) return;

        // Start point: RIGHT edge of parent, vertically CENTERED
        const startX = parentPos.x + NODE_WIDTH;
        const startY = parentPos.y + NODE_HEIGHT / 2;

        // End point: LEFT edge of child, vertically CENTERED
        const endX = childPos.x;
        const endY = childPos.y + NODE_HEIGHT / 2;

        connections.push(
          <Connection
            key={`${node.id}-${childId}`}
            startX={startX}
            startY={startY}
            endX={endX}
            endY={endY}
            branchLabel={childNode?.branchLabel}
            targetType={childNode?.type}
            isHighlighted={
              selectedNodeId === node.id || selectedNodeId === childId
            }
            isHorizontal={true}
          />,
        );
      });
    });

    return connections;
  };

  return (
    <div className="canvas" ref={canvasRef} onClick={handleCanvasClick}>
      <div
        className="canvas-content"
        style={{
          width: canvasBounds.width,
          height: canvasBounds.height,
          position: "relative",
        }}
      >
        {/* SVG layer for connections - same size as content */}
        <svg
          className="canvas-svg"
          width={canvasBounds.width}
          height={canvasBounds.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          {renderConnections()}
        </svg>

        {/* Nodes layer */}
        <div className="canvas-nodes" style={{ position: "relative" }}>
          {Object.keys(nodes).map(renderNode)}
        </div>

        {/* NodeMenu inside canvas-content for proper absolute positioning */}
        <NodeMenu
          isOpen={menuState.isOpen}
          position={menuState.position}
          onSelect={handleNodeTypeSelect}
          onClose={handleMenuClose}
        />
      </div>
    </div>
  );
};

export default Canvas;
