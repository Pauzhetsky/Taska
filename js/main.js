// находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Функции
function addTask (event) {
  // отменяем отправку формы
  event.preventDefault();
  // достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  // описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // добавляю объект в массив с задачами
  tasks.push(newTask);

  // Сохраняем задачу в хранилище браузера localStorage
  saveToLocalStorage();

  renderTask(newTask);

// очищаем поля ввода и возвращаем фокус на него
taskInput.value = '';
taskInput.focus();

checkEmptyList();
}

function deleteTask (event) {
  // Если клик был НЕ по кнопке 'удалить задачу'
  if (event.target.dataset.action !== 'delete') return;
  
    const parentNode = event.target.closest('.list-group-item');

    // определяем id задачи
  const id = Number(parentNode.id);
  
  // находим индекс задачи в массиве
  const index = tasks.findIndex( (task) => task.id === id);

  // удаляем задачу через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id);

  // Сохраняем задачу в хранилище браузера localStorage
  saveToLocalStorage();

  // удаляем задачу из разметки
  parentNode.remove();

  checkEmptyList();
}

function doneTask (event) {
  // Если клик был НЕ по кнопке 'задача выполнена'
  if (event.target.dataset.action !== 'done') return;
  
  // Проверяем что бы клик был по кнопке 'задача выполнена'
    const parentNode = event.target.closest('.list-group-item');

  // Определяем id задачи
    const id = Number(parentNode.id);
    const task = tasks.find( (task) => task.id === id);
    task.done = !task.done;

  // Сохраняем задачу в хранилище браузера localStorage
  saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/books.webp" alt="Empty" width="100" class="mt-3">
					<div class="empty-list__title">ещё ничего не записано...</div>
				</li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  // формируем css класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  // формируем разметку для новой задачи
  const taskHTML = `
    <li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;
// добавляем задачу на страницу
tasksList.insertAdjacentHTML('beforeend', taskHTML);
}