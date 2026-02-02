Frontend Intern Take-Home Assignment:
Workflow Builder UI




OBJECTIVE :

The primary goal of this assignment is to evaluate your ability to create a
complex, interactive frontend application. We want to see how you approach:
1. Data Modeling: Designing an efficient and scalable JSON/JavaScript
structure to represent the complex workflow hierarchy (Nodes,
connections, and branches).
2. Component Architecture: Designing modular and reusable UI
components.
3. State Management: Managing the state of a dynamic structure (the
workflow/tree).
4. User Experience (UX): Implementing smooth, intuitive interactions
(adding, deleting, and connecting nodes).







Technology Stack:
1. React (functional components with Hooks)
2. JavaScript / TypeScript
3. No UI libraries (e.g., no Material UI, Chakra, Shadcn)
4. No animation libraries - use CSS transitions or native JS

Note: Please do not use any specialized workflow or diagramming libraries
(e.g., React Flow, GoJS, joint.js) for the core node/edge rendering but you can
take inspiration from these libraries


Core Requirements:

You must implement a single-page application that serves as a visual
workflow builder.


1. The Workflow Canvas (The UI)
(a). Initial State: The canvas should start with a single, root node (e.g.,
"Start").
(b). Node Representation: Each element (step) in the workflow should be
represented as a visually distinct Node on the canvas.
(c). Nodes should be visually appealing and clearly readable.
(d). Each node should display a title/label (e.g., "Send Email," "Check
Condition," "End").
(e). Each node must have visual connection points/lines linking it to
its child nodes.


(f). Layout: Nodes should be displayed in a vertical or horizontal tree/flow
layout, visualizing the flow of actions. You do not need a complex auto-
layout, but the children of a node should be visually organized
below/next to the parent.




2. Workflow Actions (Node Types)
Your system must support at least three distinct Node Types that a user can
add. This tests how candidates handle different data representations and UI
rendering based on the type of node:

(a). Action

Description: Node Type Description Outgoing Connections (Children)

Outgoing Connections (Children): Action A single step/task (e.g.,
'Execute Code').

One outgoing connection (to the
next sequential step).

(b). Branch
(Condition)

Description:A decision point (e.g.,
'If/Else' logic).

Outgoing Connections (Children):Multiple outgoing connections (at
least two, e.g., 'True' and 'False').

(c). End 

Decription : The final step in a flow. 
Outgoing Connections (Children): Zero outgoing connections.



3. Interaction & Editing
The user must be able to modify the workflow structure through the UI:
(a). Add New Node:
o Implement an intuitive way to add a new node (Action, Branch,
or End) after any existing non-End node.
o For Action nodes: The new node should be inserted as the
single child.
o For Branch nodes: The new node must be added to one of the
multiple outgoing branches (e.g., a button to "Add step to 'True'
branch").

(b). Delete Node: Implement a way to delete any node (except the initial
"Start" node).
o Crucial Logic: When a node is deleted, its parent should
automatically connect to the deleted node's direct child(ren) to
maintain a continuous flow (where possible).

(c). Edit Node Properties:
o Allow the user to edit the label/title of any node.



Submission Requirements:
1. Link to a hosted live version (Vercel, Netlify, etc.)
2. Provide a link to a publicly accessible Git repository (e.g., GitHub,
GitLab).
Bonus Points (Optional):
These are not required but will demonstrate a higher level of skill and attention
to detail:
(a). Saving/Loading: Implement a simple "Save" button that logs the entire
workflow data structure to the console (no persistence needed).
(b). Undo/Redo: Implement basic undo/redo functionality for structural
changes (adding/deleting nodes).
(c). Interactive Node Creation: Implement a clean, context-sensitive UI
(like a small menu or pop-over) that appears when a user clicks a
connection point to add a new node.