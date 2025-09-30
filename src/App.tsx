import { useEffect, useState } from "react";
import TodoItem from "./todoItem";
import { Construction } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Basse"

type Todo = {
  id : number;
  text:string;
  priority:Priority
}

function App() {
  
  const [input, setInput ]= useState("")
  const [priority, setPriority ]= useState<Priority>("Moyenne")

  const savedTodos = localStorage.getItem("todos")
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : []
  const [todos, setTodos]= useState<Todo[]>(initialTodos)

  const [filter , setFilter]= useState<Priority | "Tous">("Tous")

  useEffect(()=>{
     localStorage.setItem("todos", JSON.stringify(todos))
  } , [todos])

  function addTodo(){
    if (input.trim() == ""){
      return
    }

    const newTodo: Todo ={
       id : Date.now(),
       text:input.trim(),
       priority:priority
    }

    const newTodos = [newTodo , ...todos]
    setTodos(newTodos)
    setInput("")
    setPriority("Moyenne")
    console.log(todos)
  }
 
  let filteredTodos: Todo[]= []
  if (filter === "Tous"){
    filteredTodos=todos
  }else {
    filteredTodos= todos.filter((todo) => todo.priority === filter)
  }

  const urgentCount = todos.filter((t)=>t.priority === "Urgente").length
  const moyCount = todos.filter((t)=>t.priority === "Moyenne").length
  const baseCount = todos.filter((t)=>t.priority === "Basse").length
  const totalcount = todos.length

  function deleteTodo (id :number){
    const newTodos = todos.filter((todo)=>todo.id !==id)
    setTodos(newTodos)
  }

  return (
    <div className="flex justify-center">
     <div className="w-4/5 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2x1">
        <div className="flex gap-4">
          <input
            type="text" 
            className="input w-full"
            placeholder="Ajouter une tâche... "
            value={input}
            onChange={(e)=> setInput(e.target.value)}
          />
          <select 
            className="selct w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button onClick={addTodo} className="btn btn-primary">
            Ajouter
          </button>

        </div>
        
      <div className="space-y-2 flex-1 h-fit">
        <div className="flex flex-wrap grap-4 ">
          <button
          className={` btn btn-soft ${filter === "Tous" ? "btn btn-primary": ""}`}
          onClick={()=> setFilter("Tous")}
          >
            Tous ({totalcount})
          </button>
              <button
          className={` btn btn-soft ${filter === "Urgente" ? "btn btn-primary": ""}`}
          onClick={()=> setFilter("Urgente")}
          >
            Urgente({urgentCount})
          </button>
           <button
          className={` btn btn-soft ${filter === "Moyenne" ? "btn btn-primary": ""}`}
          onClick={()=> setFilter("Moyenne")}
          >
            Moyenne ({moyCount})
          </button>
            <button
          className={` btn btn-soft ${filter === "Basse" ? "btn btn-primary": ""}`}
          onClick={()=> setFilter("Basse")}
          >
            Basse ({baseCount})
          </button>
        
        </div>
      {
        filteredTodos.length > 0 ? (
          <ul className="divide-y divide-primary/20">
             { filteredTodos.map((todo)=> (
              <li key = {todo.id}>
                <TodoItem todo={todo}
                 onDelete={()=> deleteTodo(todo.id)}
                />
              </li>
             ))} 
          </ul>
        ) : (
          <div className="flex justify-center items-center flex-col p-5"> 
            <div>
              <Construction className="h-30 w-30 text-primary "/>
            </div>
            <p className="text-md"> Aucune tache pour ce filtre</p>
           </div>
        )
      }
      </div>
    
     </div>
    </div>
    
   
  )
}

export default App
