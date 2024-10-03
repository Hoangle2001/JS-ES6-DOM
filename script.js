document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const deadlineInput = document.getElementById('task-deadline');
    const taskList = document.getElementById('task-list');

    let currentEditIndex = null;

    const loadTasks = () => {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach((task, index) => addTaskToDOM(task, index));
    };

    const addTaskToDOM = (task, index) => {
        const li = document.createElement('li');
        const taskContent = document.createElement('span');
        taskContent.textContent = task.text;

        // Thêm lớp completed nếu nhiệm vụ đã hoàn thành
        if (task.done) {
            taskContent.classList.add('completed');
        }
        li.appendChild(taskContent);

        const deadline = new Date(task.deadline);
        const now = new Date();
        if (deadline < now) {
            li.classList.add('red');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;

        checkbox.addEventListener('change', () => {
            task.done = checkbox.checked;
            taskContent.classList.toggle('completed', task.done); // Thay đổi lớp khi checkbox thay đổi
            updateLocalStorage(getTasksFromLocalStorage()); // Cập nhật lại Local Storage
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.addEventListener('click', () => {
            taskInput.value = task.text;
            deadlineInput.value = task.deadline;
            currentEditIndex = index;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Xóa';
        deleteButton.addEventListener('click', () => {
            removeTask(index);
        });

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        li.prepend(checkbox);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    };

    const removeTask = (index) => {
        const tasks = getTasksFromLocalStorage();
        tasks.splice(index, 1);
        updateLocalStorage(tasks);
        refreshTaskList();
    };

    const refreshTaskList = () => {
        taskList.innerHTML = '';
        loadTasks();
    };

    const getTasksFromLocalStorage = () => {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    };

    const updateLocalStorage = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    document.getElementById('add-task-btn').addEventListener('click', () => {
        const taskText = taskInput.value;
        const deadline = deadlineInput.value;

        if (taskText && deadline) {
            const tasks = getTasksFromLocalStorage();
            
            if (currentEditIndex !== null) {
                tasks[currentEditIndex] = { text: taskText, deadline: deadline, done: false }; // Đặt done là false khi sửa
                currentEditIndex = null;
            } else {
                const newTask = { text: taskText, deadline: deadline, done: false };
                tasks.push(newTask);
            }

            updateLocalStorage(tasks);
            refreshTaskList();

            taskInput.value = '';
            deadlineInput.value = '';
        } else {
            alert("Vui lòng nhập nhiệm vụ và thời hạn!");
        }
    });

    loadTasks(); // Tải các nhiệm vụ đã tồn tại
});
