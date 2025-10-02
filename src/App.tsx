import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction, Search, Trash2, CheckCircle, Edit3, Filter } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
  completed: boolean;
  editing: boolean; // Pour l'édition inline
};

function App() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const [searchTerm, setSearchTerm] = useState(""); // Nouvelle recherche
  const [sortByPriority, setSortByPriority] = useState<"asc" | "desc">("asc");

  const savedTodos = localStorage.getItem("todos");
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : [];
  const [todos, setTodos] = useState<Todo[]>(initialTodos.map((t: Todo) => ({ ...t, editing: false })));

  const [filter, setFilter] = useState<Priority | "Tous">("Tous");
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  // Hook custom pour filtrage + recherche + tri
  const filteredTodos = todos
    .filter((todo) => (filter === "Tous" || todo.priority === filter))
    .filter((todo) => todo.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const prioOrder = { Urgente: 3, Moyenne: 2, Basse: 1 };
      const aPrio = prioOrder[a.priority];
      const bPrio = prioOrder[b.priority];
      return sortByPriority === "asc" ? aPrio - bPrio : bPrio - aPrio;
    });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const urgentCount = todos.filter((t) => t.priority === "Urgente").length;
  const moyCount = todos.filter((t) => t.priority === "Moyenne").length;
  const basseCount = todos.filter((t) => t.priority === "Basse").length;
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority,
      completed: false,
      editing: false,
    };
    setTodos([newTodo, ...todos]);
    setInput("");
    setPriority("Moyenne");
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    setSelectedTodos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    setSelectedTodos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id); // Désélectionne si complété
      return newSet;
    });
  };

  const toggleSelect = (id: number) => {
    setSelectedTodos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const bulkDelete = () => {
    setTodos(todos.filter((todo) => !selectedTodos.has(todo.id)));
    setSelectedTodos(new Set());
  };

  const bulkComplete = () => {
    setTodos(todos.map((todo) => (selectedTodos.has(todo.id) ? { ...todo, completed: true } : todo)));
    setSelectedTodos(new Set());
  };

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header créatif */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <CheckCircle className="h-10 w-10 text-cyan-400" /> Ma Todo App
          </h1>
          <p className="text-slate-400">Gère tes tâches avec style ✨</p>
          {/* Barre de progression */}
          <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-500 mt-1">{progress}% complété ({completedCount}/{totalCount})</p>
        </div>

        {/* Formulaire d'ajout */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-2xl border border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              className="input input-bordered w-full bg-slate-700 text-white placeholder-slate-400"
              placeholder="Ajouter une tâche magique..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            <select
              className="select select-bordered w-full sm:w-auto bg-slate-700 text-white"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="Urgente">🚨 Urgente</option>
              <option value="Moyenne">⚡ Moyenne</option>
              <option value="Basse">😌 Basse</option>
            </select>
            <button onClick={addTodo} className="btn btn-primary w-full sm:w-auto">
              <Edit3 className="w-4 h-4 mr-2" /> Ajouter
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                className="input input-bordered w-full pl-10 bg-slate-700 text-white placeholder-slate-400"
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setSortByPriority(sortByPriority === "asc" ? "desc" : "asc")}
              className="btn btn-ghost btn-sm flex items-center gap-1"
              title="Trier par priorité"
            >
              <Filter className="w-4 h-4" />
              {sortByPriority === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Filtres avec stats */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            className={`btn ${filter === "Tous" ? "btn-primary" : "btn-ghost"} badge badge-circle badge-sm mr-2`}
            onClick={() => setFilter("Tous")}
          >
            Tous ({totalCount})
          </button>
          <button
            className={`btn ${filter === "Urgente" ? "btn-primary" : "btn-ghost"} badge badge-circle badge-error badge-sm mr-2`}
            onClick={() => setFilter("Urgente")}
          >
            Urgente ({urgentCount})
          </button>
          <button
            className={`btn ${filter === "Moyenne" ? "btn-primary" : "btn-ghost"} badge badge-circle badge-warning badge-sm mr-2`}
            onClick={() => setFilter("Moyenne")}
          >
            Moyenne ({moyCount})
          </button>
          <button
            className={`btn ${filter === "Basse" ? "btn-primary" : "btn-ghost"} badge badge-circle badge-success badge-sm mr-2`}
            onClick={() => setFilter("Basse")}
          >
            Basse ({basseCount})
          </button>
        </div>

        {/* Actions bulk */}
        {selectedTodos.size > 0 && (
          <div className="bg-amber-900/20 border border-amber-500 rounded-lg p-3 mb-4 flex gap-2 justify-center">
            <span className="text-amber-300 flex items-center gap-1">
              {selectedTodos.size} sélectionné(s)
            </span>
            <button onClick={bulkComplete} className="btn btn-success btn-sm">
              <CheckCircle className="w-4 h-4 mr-1" /> Tout cocher
            </button>
            <button onClick={bulkDelete} className="btn btn-error btn-sm">
              <Trash2 className="w-4 h-4 mr-1" /> Tout supprimer
            </button>
          </div>
        )}

        {/* Liste des todos */}
        <div className="space-y-3">
          {filteredTodos.length > 0 ? (
            <ul className="space-y-2">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className="animate-fadeIn">
                  <TodoItem
                    todo={todo}
                    isSelected={selectedTodos.has(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onToggleComplete={() => toggleTodo(todo.id)}
                    onToggleSelect={toggleSelect}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-600">
              <Construction className="h-16 w-16 text-slate-500 mb-4 animate-pulse" />
              <p className="text-slate-400 text-lg">Aucune tâche pour ce filtre... Crée-en une !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;