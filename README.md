# 🚀 WorkFlowser

> **Build beautiful workflows visually!** ✨

A modern, interactive workflow builder built with React and Vite. Create, connect, and manage workflow nodes with an intuitive drag-and-drop interface.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)
![CSS3](https://img.shields.io/badge/CSS3-Styled-1572B6?style=for-the-badge&logo=css3)

---

## 🎯 What is WorkFlowser?

WorkFlowser is a **visual workflow builder** that lets you create process flows with connected nodes. Whether you're designing automation workflows, decision trees, or process diagrams - WorkFlowser makes it beautiful and intuitive!

---

## ✨ Features

### 🎨 **Beautiful UI**

- 🌌 Animated space-themed background with floating stars
- 🎭 Glassmorphism design with smooth animations
- 🌈 Color-coded nodes for different actions

### 🔧 **Workflow Building**

- ➕ **Add Nodes** - Create Action, Branch, or End nodes
- 🔗 **Auto-Connect** - Threads automatically connect your nodes
- ✏️ **Edit Labels** - Double-click to rename any node
- 🗑️ **Delete Nodes** - Remove nodes with cascading deletion

### 🔄 **Undo/Redo**

- ⬅️ **Undo** (Ctrl+Z) - Made a mistake? No problem!
- ➡️ **Redo** (Ctrl+Y) - Changed your mind? Bring it back!

### 📱 **Fully Responsive**

- 💻 Desktop - Full experience with all features
- 📱 Tablet - Compact icons, optimized layout
- 📲 Mobile - Touch-friendly, minimal UI

### ⌨️ **Keyboard Shortcuts**

| Shortcut   | Action           |
| ---------- | ---------------- |
| `Ctrl + S` | 💾 Save workflow |
| `Ctrl + Z` | ⬅️ Undo          |
| `Ctrl + Y` | ➡️ Redo          |

---

## 🛠️ Tech Stack

| Technology         | Purpose              |
| ------------------ | -------------------- |
| ⚛️ **React 19**    | UI Components        |
| ⚡ **Vite 6**      | Build Tool           |
| 🎨 **CSS3**        | Styling & Animations |
| 🔄 **Context API** | State Management     |

---

## 🚀 Getting Started

### Prerequisites

- 📦 Node.js 18+
- 📦 npm or yarn

### Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Shib2001/Emittr.git

# 2️⃣ Navigate to project
cd Emittr/emittr

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start development server
npm run dev
```

### 🎉 Open http://localhost:5173 and start building!

---

## 📁 Project Structure

```
emittr/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 🎨 AnimatedBackground/  # Space theme background
│   │   ├── 🖼️ Canvas/              # Main workflow canvas
│   │   ├── 🔗 Connection/          # Thread connections
│   │   ├── 📦 Node/                # Node components
│   │   ├── 📋 NodeMenu/            # Add node dropdown
│   │   ├── ⏳ SplashScreen/        # Loading screen
│   │   └── 🔧 Toolbar/             # Top navigation
│   ├── 📂 context/
│   │   └── 🗃️ WorkflowContext.jsx  # Global state
│   ├── 📂 hooks/
│   │   ├── 📏 useResponsiveLayout.js
│   │   └── 📜 useWorkflow.js
│   └── 📂 utils/
│       ├── ⚙️ constants.js         # App constants
│       └── 🔧 nodeHelpers.js       # Utility functions
└── 📄 index.html
```

---

## 🎮 How to Use

### 1️⃣ **Start Node**

Every workflow begins with a green **Start** node. Click the `+ Add` button to add your first action!

### 2️⃣ **Add Nodes**

Choose from:

- 🟣 **Action** - Regular workflow step
- 🟠 **Branch** - Decision point (Yes/No paths)
- 🔴 **End** - Workflow termination

### 3️⃣ **Connect the Flow**

Nodes automatically connect with animated threads! 🔗

### 4️⃣ **Edit & Customize**

- ✏️ Double-click any node to rename it
- 🗑️ Hover and click ❌ to delete

### 5️⃣ **Save Your Work**

Click **Save** or press `Ctrl+S` to export your workflow to console.

---

## 🌐 Live Demo

🔗 **[View Live Demo](https://emittr.vercel.app)**

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. 💻 Make your changes
4. 📤 Submit a pull request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Made with ❤️ by **Shiv**

[![GitHub](https://img.shields.io/badge/GitHub-Shib2001-181717?style=for-the-badge&logo=github)](https://github.com/Shib2001)

---

<div align="center">

### ⭐ If you found this helpful, give it a star! ⭐

</div>
