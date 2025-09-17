import Todo from "./todo.js";

class Project{
    constructor({name="Sample",todolist=[]}={}){
        this.name=name;
        this.todolist=todolist;
    }

    addtodo(Todo){
        this.todolist.push(Todo);
    }

    removetodo(Todo){
        this.todolist=this.todolist.filter(card=>card.id!=todo.id);
    }

    toJSON() {
        return {
            name: this.name,
            todolist: this.todolist.map(todo => todo.toJSON())
        };
    }

    static fromJSON(obj) {
        const project = new Project(obj.name);
        project.todolist = obj.todolist.map(todoData => Todo.fromJSON(todoData));
        return project;
    }
}

export default Project;