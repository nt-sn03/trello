// Sample tasks matching Django model structure
const tasks = [
    {
        id: 1,
        title: "Design new landing page",
        description: "Create mockups for the new landing page with modern UI",
        due_date: null,
        attechment: null,
        status: "todo",
        priority: "high"
    },
    {
        id: 2,
        title: "Fix login bug",
        description: "Users are unable to login with special characters in password",
        due_date: null,
        attechment: null,
        status: "todo",
        priority: "medium"
    },
    {
        id: 3,
        title: "Update documentation",
        description: "Add API documentation for new endpoints",
        due_date: null,
        attechment: null,
        status: "doing",
        priority: "low"
    },
    {
        id: 4,
        title: "Implement drag and drop",
        description: "Add drag and drop functionality to task board",
        due_date: null,
        attechment: null,
        status: "doing",
        priority: "high"
    },
    {
        id: 5,
        title: "Setup CI/CD pipeline",
        description: "Configure GitHub Actions for automated testing and deployment",
        due_date: null,
        attechment: null,
        status: "done",
        priority: "medium"
    }
];

// Priority color mapping
const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
};

// Create task card element
function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move";
    card.draggable = true;
    card.dataset.taskId = task.id;
    card.dataset.status = task.status;

    card.innerHTML = `
        <h3 class="font-semibold text-gray-800 mb-2">${task.title}</h3>
        ${task.description ? `<p class="text-sm text-gray-600 mb-3">${task.description}</p>` : ''}
        <div class="flex items-center justify-between">
            <span class="text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}">
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
        </div>
    `;

    return card;
}

// Render all tasks
function renderTasks() {
    const todoColumn = document.getElementById("todo-column");
    const doingColumn = document.getElementById("doing-column");
    const doneColumn = document.getElementById("done-column");

    todoColumn.innerHTML = "";
    doingColumn.innerHTML = "";
    doneColumn.innerHTML = "";

    tasks.forEach(task => {
        const card = createTaskCard(task);
        
        if (task.status === "todo") {
            todoColumn.appendChild(card);
        } else if (task.status === "doing") {
            doingColumn.appendChild(card);
        } else if (task.status === "done") {
            doneColumn.appendChild(card);
        }
    });

    initializeDragAndDrop();
}

// Drag and drop functionality
let draggedElement = null;

function initializeDragAndDrop() {
    const taskCards = document.querySelectorAll(".task-card");
    const columns = document.querySelectorAll("[data-status]");

    taskCards.forEach(card => {
        card.addEventListener("dragstart", handleDragStart);
        card.addEventListener("dragend", handleDragEnd);
    });

    columns.forEach(column => {
        column.addEventListener("dragover", handleDragOver);
        column.addEventListener("drop", handleDrop);
        column.addEventListener("dragleave", handleDragLeave);
        column.addEventListener("dragenter", handleDragEnter);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = "0.5";
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragEnd(e) {
    this.style.opacity = "1";
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = "move";
    return false;
}

function handleDragEnter(e) {
    if (this.classList.contains("space-y-3")) {
        this.classList.add("bg-indigo-50", "border-2", "border-dashed", "border-indigo-300");
    }
}

function handleDragLeave(e) {
    if (this.classList.contains("space-y-3")) {
        this.classList.remove("bg-indigo-50", "border-2", "border-dashed", "border-indigo-300");
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove("bg-indigo-50", "border-2", "border-dashed", "border-indigo-300");

    if (draggedElement !== this) {
        const taskId = parseInt(draggedElement.dataset.taskId);
        const newStatus = this.dataset.status;

        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            draggedElement.dataset.status = newStatus;
        }

        renderTasks();
    }

    return false;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
});
