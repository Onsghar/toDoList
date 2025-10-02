import { useState } from "react";
import { Trash, Check, AlertCircle, Info, CheckCircle } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
  completed: boolean;
  editing: boolean;
};

type Props = {
  todo: Todo;
  onDelete: () => void;
  onToggleComplete: () => void;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
};

const TodoItem = ({ todo, onDelete, onToggleComplete, isSelected, onToggleSelect }: Props) => {
  const [editText, setEditText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      setEditText(todo.text);
    }
  };

  const saveEdit = (e?: React.KeyboardEvent) => {
    if ((e?.key === "Enter" || !e) && editText.trim()) {
      // Ici, tu pourrais propager l'édition au parent si besoin
      setIsEditing(false);
    }
  };

  const priorityIcon = {
    Urgente: <AlertCircle className="w-4 h-4 text-red-400" />,
    Moyenne: <Info className="w-4 h-4 text-yellow-400" />,
    Basse: <CheckCircle className="w-4 h-4 text-green-400" />,
  };

  return (
    <div
      className={`card bg-slate-800/70 backdrop-blur-sm border border-slate-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${
        todo.completed ? "opacity-60" : ""
      } ${isSelected ? "ring-2 ring-cyan-500" : ""}`}
      onDoubleClick={handleEdit}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-lg"
            checked={todo.completed || isSelected}
            onChange={() => {
              if (!todo.completed) onToggleSelect(todo.id);
              else onToggleComplete();
            }}
          />
          {isEditing ? (
            <input
              type="text"
              className="input input-bordered flex-1 bg-slate-700 text-white"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={() => saveEdit()}
              onKeyDown={(e) => e.key === "Enter" && saveEdit(e)}
              autoFocus
            />
          ) : (
            <div className={`flex-1 ${todo.completed ? "line-through text-slate-500" : "text-white"}`}>
              {todo.text}
              <span className="ml-2">{priorityIcon[todo.priority]}</span>
            </div>
          )}
          <span
            className={`badge badge-lg ${
              todo.priority === "Urgente"
                ? "badge-error"
                : todo.priority === "Moyenne"
                ? "badge-warning"
                : "badge-success"
            }`}
          >
            {todo.priority}
          </span>
        </div>
        <button onClick={onDelete} className="btn btn-sm btn-error btn-ghost ml-2" aria-label="Supprimer">
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;