
class Todo{
    constructor({id=null,title="Sample event to do", description="", date=null,priority="low",checked = false}={}){
        this.id = id || Todo.generateId();
        this.title = title;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.checked = checked;
    }

    static generateId(){
        return ("Id_"+crypto.randomUUID());
    }

    toggleChecked(){
        this.checked =!this.checked;
    }

    update(fields = {}) {
        Object.assign(this, fields);
    }

    toJSON() {
        return {
        id: this.id,
        title: this.title,
        description: this.description,
        date: this.date,
        priority: this.priority,
        checked: this.checked
        };
    }

    static fromJSON(obj) {
        return new Todo(obj);
    }
}


export default Todo;