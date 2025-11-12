interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const input = document.getElementById("taskInput") as HTMLInputElement | null;
const addBtn = document.getElementById("newTask") as HTMLButtonElement | null;
const list = document.getElementById("taskList") as HTMLUListElement | null;
const progress = document.getElementById("progress") as HTMLDivElement | null;
const numbers = document.getElementById(
  "numbers"
) as HTMLParagraphElement | null;

const KEY = "simpleTodoWithTypescript";

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
  if (tasks.length != 0) {
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "taskItem";
      const span = document.createElement("span");
      span.textContent = task.text;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        save(tasks);
        if (task.done) {
          span.style.textDecoration = "line-through";
        } else {
          span.style.textDecoration = "none";
        }
        updateProgress();
      });
      const editButton = document.createElement("button");
      const editImg = document.createElement("img");
      editImg.width = 48;
      editImg.height = 48;
      editImg.src = "https://img.icons8.com/sf-regular/48/create-new.png" ;
      editImg.alt = "Edit task";
      editButton.appendChild(editImg);
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
      const deleteButton=document.createElement("button");
      const deleteImg=document.createElement("img");
      deleteImg.width=48;
      deleteImg.height=48;
      deleteImg.src="https://img.icons8.com/material/24/filled-trash.png" ;
      deleteButton.appendChild(deleteImg);
      deleteButton.addEventListener("click",()=>{
        tasks.filter((t)=>t.id!=task.id);
        save(tasks);
        render();
      });
      li.append(checkbox,span,editButton,deleteButton);
      list.appendChild(li);
    });
  }
  updateProgress();
}
