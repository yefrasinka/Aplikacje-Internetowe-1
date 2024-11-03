class Todo {
    constructor() {
      this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      this.term = "";
      this.draw();
    }
  
    draw() {
      const taskList = document.getElementById("task-list");
      taskList.innerHTML = "";
      const tasks = this.getFilteredTasks();
  
      tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
  
        if (task.isEditing) {
          const editTextInput = document.createElement("input");
          editTextInput.type = "text";
          editTextInput.value = task.text;
          taskItem.appendChild(editTextInput);
  
          const editDateInput = document.createElement("input");
          editDateInput.type = "date";
          editDateInput.value = task.deadline || "";
          taskItem.appendChild(editDateInput);
  
          const saveButton = document.createElement("button");
          saveButton.textContent = "Save";
          saveButton.onclick = () => this.saveTask(index, editTextInput.value, editDateInput.value);
          taskItem.appendChild(saveButton);
        } else {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = task.completed || false;
          checkbox.onchange = () => this.toggleComplete(index);
          taskItem.appendChild(checkbox);
  
          const taskText = document.createElement("span");
          taskText.innerHTML = this.highlightSearchTerm(task.text);
          if (task.completed) {
            taskText.classList.add("completed");
          }
          taskItem.appendChild(taskText);
  
          if (task.deadline) {
            const taskDate = document.createElement("span");
            taskDate.classList.add("task-date");
            taskDate.textContent = new Date(task.deadline).toISOString().split("T")[0];
            taskItem.appendChild(taskDate);
          }
  
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.classList.add("edit-button");
          editButton.onclick = () => this.startEditing(index);
          taskItem.appendChild(editButton);
        }
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = () => this.removeTask(index);
        taskItem.appendChild(deleteButton);
  
        taskList.appendChild(taskItem);
      });
    }
  
    addTask() {
      const taskText = document.getElementById("task-input").value;
      const deadline = document.getElementById("task-deadline").value;
  
      if (taskText.length < 3 || taskText.length > 255) {
        alert("Task must be between 3 and 255 characters.");
        return;
      }
  
      this.tasks.push({ text: taskText, deadline, completed: false, isEditing: false });
      this.saveTasks();
      this.draw();
    }
  
    toggleComplete(index) {
      this.tasks[index].completed = !this.tasks[index].completed;
      this.saveTasks();
      this.draw();
    }
  
    startEditing(index) {
      this.tasks[index].isEditing = true;
      this.draw();
    }
  
    saveTask(index, newText, newDeadline) {
      if (newText.length < 3 || newText.length > 255) {
        alert("Task must be between 3 and 255 characters.");
        return;
      }
  
      this.tasks[index].text = newText;
      this.tasks[index].deadline = newDeadline;
      this.tasks[index].isEditing = false;
      this.saveTasks();
      this.draw();
    }
  
    removeTask(index) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      this.draw();
    }
  
    saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
  
    getFilteredTasks() {
      return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }
  
    updateSearchTerm(term) {
      this.term = term;
      this.draw();
    }
  
    highlightSearchTerm(text) {
      if (this.term.length < 2) return text;
      const regex = new RegExp(`(${this.term})`, "gi");
      return text.replace(regex, "<mark>$1</mark>");
    }
  }
  
  const todo = new Todo();
  