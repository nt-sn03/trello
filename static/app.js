const API_URL = '/tasks/';
let tasks = [];

const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    meduim: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
};

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks');
    }
}

async function createTask(taskData) {
    try {
        const formData = new FormData();
        formData.append('title', taskData.title);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const result = await response.json();
        if (result.message === 'ok') {
            await fetchTasks();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error creating task:', error);
        return false;
    }
}

async function updateTaskStatus(taskId, newStatus) {
    try {
        const response = await fetch(`${API_URL}${taskId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        const result = await response.json();
        return result.message === 'ok';
    } catch (error) {
        console.error('Error updating task status:', error);
        return false;
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_URL}${taskId}/`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        const result = await response.json();
        if (result.message === 'deleted') {
            await fetchTasks();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting task:', error);
        return false;
    }
}

function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move relative";
    card.draggable = true;
    card.dataset.taskId = task.id;
    card.dataset.status = task.status;

    card.innerHTML = `
        <button class="delete-btn absolute top-2 right-2 text-gray-400 hover:text-red-600 transition" data-task-id="${task.id}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
        <h3 class="font-semibold text-gray-800 mb-2 pr-6">${task.title}</h3>
        ${task.description ? `<p class="text-sm text-gray-600 mb-3">${task.description}</p>` : ''}
        <div class="flex items-center justify-between">
            <span class="text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}">
                ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            ${task.due_date ? `<span class="text-xs text-gray-500">${new Date(task.due_date).toLocaleDateString()}</span>` : ''}
        </div>
    `;

    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this task?')) {
            const success = await deleteTask(task.id);
            if (!success) {
                alert('Failed to delete task');
            }
        }
    });

    return card;
}

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
    
    const columns = document.querySelectorAll("[data-status]");
    columns.forEach(column => {
        column.classList.remove("bg-indigo-50", "border-2", "border-dashed", "border-indigo-300");
    });
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
    if (e.currentTarget === this && this.classList.contains("space-y-3")) {
        this.classList.remove("bg-indigo-50", "border-2", "border-dashed", "border-indigo-300");
    }
}

async function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }

    this.classList.remove("bg-indigo-50", "border-2", "border-dashed", "border-indigo-300");

    if (draggedElement && draggedElement !== this) {
        const taskId = parseInt(draggedElement.dataset.taskId);
        const newStatus = this.dataset.status;
        const oldStatus = draggedElement.dataset.status;

        if (oldStatus !== newStatus) {
            const success = await updateTaskStatus(taskId, newStatus);
            
            if (success) {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    task.status = newStatus;
                }
                renderTasks();
            } else {
                alert('Failed to update task status');
                renderTasks();
            }
        }
    }

    return false;
}

const modal = document.getElementById('task-modal');
const addTaskBtn = document.getElementById('add-task-btn');
const cancelBtn = document.getElementById('cancel-btn');
const taskForm = document.getElementById('task-form');

addTaskBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    taskForm.reset();
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        taskForm.reset();
    }
});

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value.trim();
    
    if (!title) {
        alert('Title is required');
        return;
    }
    
    const taskData = {
        title: title
    };
    
    const success = await createTask(taskData);
    
    if (success) {
        modal.classList.add('hidden');
        taskForm.reset();
    } else {
        alert('Error creating task. Please try again.');
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetchTasks();
});
