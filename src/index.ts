
interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const KEY="simpleTodoWithTypescript";
const save=(tasks:Todo[])=>localStorage.setItem(KEY,JSON.stringify(tasks));
const load = (): Todo[] => {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Todo[]) : [];
};
