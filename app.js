let parentTasks = [];
let subTasks = [];
let nextParentTaskId = 1;
let nextSubTaskId = 1;

// Add Parent Task
const parentTaskForm = document.getElementById('parentTaskForm');
parentTaskForm.addEventListener('submit', addParentTask);

function addParentTask(e) {
  e.preventDefault();

  const parentTaskId = document.getElementById('parentTaskId').value.trim();
  const parentTaskName = document.getElementById('parentTaskName').value.trim();
  const parentTaskStartDate = document.getElementById('parentTaskStartDate').value;
  const parentTaskEndDate = document.getElementById('parentTaskEndDate').value;
  const parentTaskStatus = document.getElementById('parentTaskStatus').value;

  const errors = validateParentTask(parentTaskId, parentTaskName, parentTaskStartDate, parentTaskEndDate);

  if (errors.length === 0) {
    const newParentTask = {
      id: parseInt(parentTaskId),
      name: parentTaskName,
      startDate: new Date(parentTaskStartDate),
      endDate: new Date(parentTaskEndDate),
      status: parentTaskStatus,
      subTasks: []
    };

    parentTasks.push(newParentTask);
    nextParentTaskId++;
    renderTaskList();
    clearParentTaskForm();
  } else {
    displayErrors(errors);
  }
}

// Add Sub-Task
const subTaskForm = document.getElementById('subTaskForm');
subTaskForm.addEventListener('submit', addSubTask);

function addSubTask(e) {
  e.preventDefault();

  const parentTaskIdForSubTask = document.getElementById('parentTaskIdForSubTask').value.trim();
  const subTaskName = document.getElementById('subTaskName').value.trim();
  const subTaskStartDate = document.getElementById('subTaskStartDate').value;
  const subTaskEndDate = document.getElementById('subTaskEndDate').value;
  const subTaskStatus = document.getElementById('subTaskStatus').value;

  const errors = validateSubTask(parentTaskIdForSubTask, subTaskName, subTaskStartDate, subTaskEndDate);

  if (errors.length === 0) {
    const parentTask = parentTasks.find(task => task.id === parseInt(parentTaskIdForSubTask));

    if (parentTask) {
      const newSubTask = {
        id: nextSubTaskId,
        name: subTaskName,
        startDate: new Date(subTaskStartDate),
        endDate: new Date(subTaskEndDate),
        status: subTaskStatus
      };

      parentTask.subTasks.push(newSubTask);
      nextSubTaskId++;
      renderTaskList();
      clearSubTaskForm();
    } else {
      displayErrors(['Parent Task ID not found.']);
    }
  } else {
    displayErrors(errors);
  }
}

// Render Task List
function renderTaskList() {
  const taskListContainer = document.getElementById('taskList');
  taskListContainer.innerHTML = '';

  parentTasks.forEach(parentTask => {
    const parentTaskElement = document.createElement('div');
    parentTaskElement.classList.add('parent-task');

    const parentTaskInfo = `
      <h3>Parent Task ID: ${parentTask.id}</h3>
      <p>Name: ${parentTask.name}</p>
      <p>Start Date: ${formatDate(parentTask.startDate)}</p>
      <p>End Date: ${formatDate(parentTask.endDate)}</p>
      <p>Status: <span class="status-${parentTask.status}">${capitalizeFirstLetter(parentTask.status)}</span></p>
      <button onclick="editParentTask(${parentTask.id})">Edit</button>
      <button onclick="deleteParentTask(${parentTask.id})">Delete</button>
    `;

    parentTaskElement.innerHTML = parentTaskInfo;
    taskListContainer.appendChild(parentTaskElement);

    const subTaskList = document.createElement('div');
    subTaskList.classList.add('sub-task-list');

    parentTask.subTasks.forEach(subTask => {
      const subTaskElement = document.createElement('div');
      subTaskElement.classList.add('sub-task');

      const subTaskInfo = `
        <p>Sub-Task ID: ${subTask.id}</p>
        <p>Name: ${subTask.name}</p>
        <p>Start Date: ${formatDate(subTask.startDate)}</p>
        <p>End Date: ${formatDate(subTask.endDate)}</p>
        <p>Status: <span class="status-${subTask.status}">${capitalizeFirstLetter(subTask.status)}</span></p>
        <button onclick="editSubTask(${parentTask.id}, ${subTask.id})">Edit</button>
        <button onclick="deleteSubTask(${parentTask.id}, ${subTask.id})">Delete</button>
      `;

      subTaskElement.innerHTML = subTaskInfo;
      subTaskList.appendChild(subTaskElement);
    });

    parentTaskElement.appendChild(subTaskList);
  });
}  
// Edit Parent Task
function editParentTask(parentTaskId) {
  const parentTask = parentTasks.find(task => task.id === parentTaskId);
  if (parentTask) {
    const parentTaskNameInput = document.getElementById('parentTaskName');
    const parentTaskStartDateInput = document.getElementById('parentTaskStartDate');
    const parentTaskEndDateInput = document.getElementById('parentTaskEndDate');
    const parentTaskStatusInput = document.getElementById('parentTaskStatus');

    parentTaskNameInput.value = parentTask.name;
    parentTaskStartDateInput.value = formatDate(parentTask.startDate);
    parentTaskEndDateInput.value = formatDate(parentTask.endDate);
    parentTaskStatusInput.value = parentTask.status;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    saveButton.addEventListener('click', () => {
      const errors = validateParentTask(
        parentTaskId.toString(),
        parentTaskNameInput.value.trim(),
        parentTaskStartDateInput.value,
        parentTaskEndDateInput.value
      );

      if (errors.length === 0) {
        const updatedParentTask = {
          id: parentTaskId,
          name: parentTaskNameInput.value.trim(),
          startDate: new Date(parentTaskStartDateInput.value),
          endDate: new Date(parentTaskEndDateInput.value),
          status: parentTaskStatusInput.value,
          subTasks: parentTask.subTasks
        };

        const index = parentTasks.findIndex(task => task.id === parentTaskId);
        parentTasks[index] = updatedParentTask;
        renderTaskList();
        clearParentTaskForm();
        parentTaskForm.removeChild(saveButton);
      } else {
        displayErrors(errors);
      }
    });

    parentTaskForm.appendChild(saveButton);
  }
}
// Edit Sub-Task
function editSubTask(parentTaskId, subTaskId) {
  const parentTask = parentTasks.find(task => task.id === parentTaskId);
  if (parentTask) {
    const subTask = parentTask.subTasks.find(task => task.id === subTaskId);
    if (subTask) {
      const subTaskNameInput = document.getElementById('subTaskName');
      const subTaskStartDateInput = document.getElementById('subTaskStartDate');
      const subTaskEndDateInput = document.getElementById('subTaskEndDate');
      const subTaskStatusInput = document.getElementById('subTaskStatus');

      subTaskNameInput.value = subTask.name;
      subTaskStartDateInput.value = formatDate(subTask.startDate);
      subTaskEndDateInput.value = formatDate(subTask.endDate);
      subTaskStatusInput.value = subTask.status;

      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save Changes';
      saveButton.addEventListener('click', () => {
        const errors = validateSubTask(
          parentTaskId.toString(),
          subTaskNameInput.value.trim(),
          subTaskStartDateInput.value,
          subTaskEndDateInput.value
        );

        if (errors.length === 0) {
          const updatedSubTask = {
            id: subTaskId,
            name: subTaskNameInput.value.trim(),
            startDate: new Date(subTaskStartDateInput.value),
            endDate: new Date(subTaskEndDateInput.value),
            status: subTaskStatusInput.value
          };

          const subTaskIndex = parentTask.subTasks.findIndex(task => task.id === subTaskId);
          parentTask.subTasks[subTaskIndex] = updatedSubTask;
          renderTaskList();
          clearSubTaskForm();
          subTaskForm.removeChild(saveButton);
        } else {
          displayErrors(errors);
        }
      });

      subTaskForm.appendChild(saveButton);
    }
  }
}

  // Search Tasks
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', searchTasks);
  
  function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const taskListContainer = document.getElementById('taskList');
    const parentTaskElements = taskListContainer.getElementsByClassName('parent-task');
    const subTaskElements = taskListContainer.getElementsByClassName('sub-task');
  
    for (let i = 0; i < parentTaskElements.length; i++) {
      const parentTask = parentTasks[i];
      const parentTaskId = parentTask.id.toString().toLowerCase();
      const parentTaskName = parentTask.name.toLowerCase();
      const parentTaskStartDate = formatDate(parentTask.startDate).toLowerCase();
      const parentTaskEndDate = formatDate(parentTask.endDate).toLowerCase();
      const parentTaskStatus = parentTask.status.toLowerCase();
  
      const isParentTaskMatch =
        parentTaskId.includes(searchTerm) ||
        parentTaskName.includes(searchTerm) ||
        parentTaskStartDate.includes(searchTerm) ||
        parentTaskEndDate.includes(searchTerm) ||
        parentTaskStatus.includes(searchTerm);
  
      parentTaskElements[i].style.display = isParentTaskMatch ? 'block' : 'none';
  
      const subTaskList = parentTaskElements[i].getElementsByClassName('sub-task-list')[0];
      const subTaskElementsForParent = subTaskList.getElementsByClassName('sub-task');
  
      for (let j = 0; j < subTaskElementsForParent.length; j++) {
        const subTask = parentTask.subTasks[j];
        const subTaskId = subTask.id.toString().toLowerCase();
        const subTaskName = subTask.name.toLowerCase();
        const subTaskStartDate = formatDate(subTask.startDate).toLowerCase();
        const subTaskEndDate = formatDate(subTask.endDate).toLowerCase();
        const subTaskStatus = subTask.status.toLowerCase();
  
        const isSubTaskMatch =
          subTaskId.includes(searchTerm) ||
          subTaskName.includes(searchTerm) ||
          subTaskStartDate.includes(searchTerm) ||
          subTaskEndDate.includes(searchTerm) ||
          subTaskStatus.includes(searchTerm);
  
        subTaskElementsForParent[j].style.display = isSubTaskMatch ? 'block' : 'none';
      }
    }
  }
  
  // Utility Functions
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function clearParentTaskForm() {
    document.getElementById('parentTaskId').value = '';
    document.getElementById('parentTaskName').value = '';
    document.getElementById('parentTaskStartDate').value = '';
    document.getElementById('parentTaskEndDate').value = '';
    document.getElementById('parentTaskStatus').value = '';
  }
  
  function clearSubTaskForm() {
    document.getElementById('parentTaskIdForSubTask').value = '';
    document.getElementById('subTaskName').value = '';
    document.getElementById('subTaskStartDate').value = '';
    document.getElementById('subTaskEndDate').value = '';
    document.getElementById('subTaskStatus').value = '';
  }
  
  function displayErrors(errors) {
    const errorMessagesContainer = document.getElementById('errorMessages');
    errorMessagesContainer.innerHTML = '';
  
    errors.forEach(error => {
      const errorElement = document.createElement('p');
      errorElement.textContent = error;
      errorMessagesContainer.appendChild(errorElement);
    });
  }
  
  // Validation Functions 
  // Validation Functions
  function validateParentTask(parentTaskId, parentTaskName, parentTaskStartDate, parentTaskEndDate) {
    const errors = [];
  
    const parentTask = parentTasks.find(task => task.id === parseInt(parentTaskId));
  
    // Validate Parent Task ID
    if (isNaN(parentTaskId) || parentTaskId.trim() === '') {
      errors.push('Parent Task ID must be a number and cannot be empty.');
    } else if (parentTasks.some(task => task.id === parseInt(parentTaskId) && task.id !== parentTask?.id)) {
      errors.push('Parent Task ID already exists.');
    }
  
    // Validate Parent Task Name
    if (!/^[a-zA-Z\s]+$/.test(parentTaskName)) {
      errors.push('Parent Task Name must contain only alphabets and spaces.');
    }
  
    // Validate Start Date and End Date
    if (new Date(parentTaskStartDate) >= new Date(parentTaskEndDate)) {
      errors.push('Start Date must be before End Date.');
    }
  
    return errors;
  }
  function validateSubTask(parentTaskIdForSubTask, subTaskName, subTaskStartDate, subTaskEndDate) {
    const errors = [];
  
    // Validate Parent Task ID
    if (isNaN(parentTaskIdForSubTask) || parentTaskIdForSubTask.trim() === '') {
      errors.push('Parent Task ID must be a number and cannot be empty.');
    } else if (!parentTasks.some(task => task.id === parseInt(parentTaskIdForSubTask))) {
      errors.push('Parent Task ID does not exist.');
    }
  
    // Validate Sub-Task Name
    if (!/^[a-zA-Z\s]+$/.test(subTaskName)) {
      errors.push('Sub-Task Name must contain only alphabets and spaces.');
    }
  
    // Validate Start Date and End Date
    if (new Date(subTaskStartDate) >= new Date(subTaskEndDate)) {
      errors.push('Start Date must be before End Date.');
    }
  
    return errors;
  }

  // Delete Parent Task
function deleteParentTask(parentTaskId) {
    const index = parentTasks.findIndex(task => task.id === parentTaskId);
    if (index !== -1) {
      parentTasks.splice(index, 1);
      renderTaskList();
    }
  }
  
  // Delete Sub-Task
  function deleteSubTask(parentTaskId, subTaskId) {
    const parentTask = parentTasks.find(task => task.id === parentTaskId);
    if (parentTask) {
      const subTaskIndex = parentTask.subTasks.findIndex(subTask => subTask.id === subTaskId);
      if (subTaskIndex !== -1) {
        parentTask.subTasks.splice(subTaskIndex, 1);
        renderTaskList();
      }
    }
  }