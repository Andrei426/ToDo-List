// Получаем элементы со страницы
const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

// Здесь храним все задачи
let todos = [];

// Текущий фильтр: all / active / done
let currentFilter = "all";

// Загружаем задачи из localStorage при старте
function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved);
  }
}

// Сохраняем задачи в localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Отрисовываем список задач
function render() {
  // Очищаем список
  list.innerHTML = "";

  // Фильтруем задачи
  let filteredTodos = todos;
  if (currentFilter === "active") {
    filteredTodos = todos.filter((t) => !t.done);
  } else if (currentFilter === "done") {
    filteredTodos = todos.filter((t) => t.done);
  }

  // Показываем/скрываем сообщение "Список пуст"
  if (filteredTodos.length === 0) {
    emptyMessage.classList.add("show");
  } else {
    emptyMessage.classList.remove("show");
  }

  // Создаём элементы для каждой задачи
  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.done) {
      li.classList.add("done");
    }

    // Чекбокс
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    // Текст задачи
    const span = document.createElement("span");
    span.textContent = todo.text;

    // Кнопка удаления
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Добавить новую задачу
function addTodo(text) {
  const newTodo = {
    id: Date.now(), // уникальный id
    text: text,
    done: false,
  };
  todos.push(newTodo);
  saveTodos();
  render();
}

// Переключить статус (выполнено / не выполнено)
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  });
  saveTodos();
  render();
}

// Удалить задачу
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

// Обработка отправки формы
form.addEventListener("submit", (event) => {
  event.preventDefault(); // чтобы страница не перезагружалась

  const text = input.value.trim();
  if (text === "") {
    alert("Введите текст задачи");
    return;
  }

  addTodo(text);
  input.value = "";
  input.focus();
});

// Обработка фильтров
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Убираем active со всех кнопок
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    // Добавляем active на нажатую
    button.classList.add("active");

    currentFilter = button.dataset.filter;
    render();
  });
});

// Старт приложения
loadTodos();
render();
