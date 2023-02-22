const input_task = document.getElementById('input-task');
const tasks_list = document.getElementById('tasks-list');
let tasks = []

window.onload = (event) => {
    renderTask();
};

function renderTask() {
    tasks = localStorage.getItem('tasks');
    if (!tasks) return
    tasks = JSON.parse(tasks);
    console.log(tasks);
    tasks_list.innerHTML = "";
    for (let task of tasks) {
        let task_wrapper = document.createElement('div');
        tasks_list.appendChild(task_wrapper);
        task_wrapper.id = task["id"];
        task_wrapper.classList.add('task-wrapper');
        task_wrapper.addEventListener('click', (event) => taskDone(event))
        task_wrapper.innerHTML =
            ` <div class="task">
                ${task["task"]}
            </div>
            <i class="remove-task fa fa-trash" aria-hidden="true" ></i>
            `;

        setTimeout(function () {
            task_wrapper.classList.add('show');
        }, 1000);
    }

}


function taskDone(event) {
    if (event.target.nodeName === "I") {
        deleteTask(event);
        return;
    }
    let target = event.currentTarget;
    console.log(target);
    if (target.classList.contains('task-done')) {
        target.classList.remove('task-done');
        target.removeChild(target.firstChild);
    }
    else {
        let doc = new DOMParser().parseFromString('<i class="fa-sharp fa-solid fa-check task-tick"></i>', 'text/html');
        target.insertBefore(doc.body.firstChild, target.firstChild);
        target.classList.add('task-done');
    }
    let tasks_list = JSON.parse(localStorage.getItem('tasks') || "[]");
    console.log(tasks_list, target.id,);
    for (let i = 0; i < tasks_list.length; i++) {
        if (tasks_list[i].id == target.id) {
            tasks_list[i].status = !tasks_list[i].status;
            break;
        }
    }
    console.log(tasks_list);

    localStorage.setItem('tasks', JSON.stringify(tasks_list));
}


function addTask() {

    let task = input_task.value;
    if (task === "") {
        alert("Add Task");
        return;
    }

    let oldTasks = JSON.parse(localStorage.getItem('tasks') || "[]");
    console.log(oldTasks, oldTasks !== []);
    let task_id = 1;
    if (oldTasks.length != 0) {
        task_id = Math.max(...oldTasks.map(task => task["id"])) + 1;
    }
    console.log(task_id);

    oldTasks.push({ "id": task_id, "task": task, "status": 0 });
    localStorage.setItem('tasks', JSON.stringify(oldTasks))

    let task_wrapper = document.createElement('div');
    tasks_list.appendChild(task_wrapper);
    task_wrapper.id = task_id
    task_wrapper.classList.add('task-wrapper');
    task_wrapper.addEventListener('click', (event) => taskDone(event))
    task_wrapper.innerHTML =
        ` <div class="task">
            ${task}
          </div>
          <i class="remove-task fa fa-trash" aria-hidden="true" ></i>
        `;

    setTimeout(function () {
        task_wrapper.classList.add('show');
    }, 500);

}

function deleteTask(event) {
    let target = event.currentTarget;

    let tasks_list = JSON.parse(localStorage.getItem('tasks') || "[]");

    tasks_list = tasks_list.filter(task=>{
        console.log(task["id"],target.id)
        return task["id"] != target.id;
    })

    console.log(tasks_list);

    localStorage.setItem('tasks', JSON.stringify(tasks_list));

    target.classList.remove('show');
    setTimeout(() => {
        target.remove();
    }, 1000);
}