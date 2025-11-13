interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const form = document.getElementById("todoForm") as HTMLFormElement | null;
const input = document.getElementById("taskInput") as HTMLInputElement | null;
const addBtn = document.getElementById("newTask") as HTMLButtonElement | null;
const list = document.getElementById("taskList") as HTMLUListElement | null;
const progress = document.getElementById("progress") as HTMLDivElement | null;
const numbers = document.getElementById(
  "numbers"
) as HTMLParagraphElement | null;

const KEY = "simpleTodoWithTypescript";
const uid = () => Math.random().toString(36).slice(2, 9);

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input) {
    addTask(input.value);
    input.value = "";
    input.focus();
  }
});

const save = (tasks: Todo[]) =>
  localStorage.setItem(KEY, JSON.stringify(tasks));

const load = (): Todo[] => {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Todo[]) : [];
};
let tasks: Todo[] = load();

function updateProgress() {
  if (!progress || !numbers) return;
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  progress.style.width = percent + "%";
  numbers.textContent = `${done} / ${total}`;
}

function render() {
  if (!list || !progress || !numbers) return;
  list.innerHTML = "";

  if (tasks.length != 0) {
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "taskItem";

      const span = document.createElement("span");
      span.textContent = task.text;
      span.style.textDecoration = task.done ? "line-through" : "none";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        save(tasks);
        span.style.textDecoration = task.done ? "line-through" : "none";
        updateProgress();
      });

      const editButton = document.createElement("button");
      editButton.className= "editBtn";
      editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      editButton.addEventListener("click", () => {
        span.contentEditable = "true";
        span.focus();

        span.addEventListener(
          "blur",
          () => {
            const newText = span.textContent?.trim();
            if (newText && newText !== task.text) {
              task.text = newText;
              save(tasks);
              render();
            } else {
              span.textContent = task.text;
            }
            span.contentEditable = "false";
          },
          { once: true }
        ); //not the same thing to be called multiple times;
      });

      const deleteButton = document.createElement("button");
      deleteButton.className= "deleteBtn";
      deleteButton.innerHTML = '<i style="width:32,height:32"class="fa-solid fa-trash"></i>';
      deleteButton.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id != task.id);
        save(tasks);
        render();
      });

      li.append(checkbox, span, editButton, deleteButton);
      list.appendChild(li);
    });
  }
  updateProgress();
}

function addTask(text: string) {
  const trimmed = text.trim();
  if (trimmed == "") return;
  tasks.unshift({ id: uid(), text: trimmed, done: false });
  save(tasks);
  render();
}

if (addBtn && input) {
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = "";
    input.focus();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      addTask(input.value);
      input.value = "";
      input.focus();
    }
  });
}
