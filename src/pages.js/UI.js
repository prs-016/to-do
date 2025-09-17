import Project from "./models/project.js";
import Todo from "./models/todo.js";
import { saveProjects, loadProjects } from "./storage.js";


function UI(){
    const projects = loadProjects() || [new Project({ name: "Gym" })];
    let activeProject = projects[0];
    const add = document.querySelector(".add");
    const modal = document.querySelector(".modal");
    const modal2 = document.querySelector(".modal2"); 
    const modal3 = document.querySelector(".modal3");
    const right = document.querySelector(".right");
    add.addEventListener("click",()=>{
        modal.style.display="flex";
    })

    function renderTodos(project) { 
        right.innerHTML = ""; 
        project.todolist.forEach((td) => addCard(td, project)); 
    }

    function addCard(todo, project){
        if (!(todo instanceof Todo)) {
            todo = Todo.fromJSON(todo);
        }
        const card = document.createElement("div");
        right.appendChild(card);
        card.classList.add("card", todo.priority || "high");
        todo.checked?card.classList.add("checked"):card.classList.remove("checked");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox-${todo.id}`;
        checkbox.checked = !!todo.checked;
        const textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = todo.title;
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("date");
        dateDiv.textContent = todo.date||"";  //need to splice and change this
        const timeDiv = document.createElement("div");
        timeDiv.classList.add("time");
        timeDiv.textContent = todo.timePart || "";     //need to change this
        const detailsBtn = document.createElement("button");
        detailsBtn.classList.add("details");
        detailsBtn.textContent = "details";
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit");
        editBtn.textContent = "📝";
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete");
        deleteBtn.textContent = "🗑️";
        card.appendChild(checkbox);
        card.appendChild(textDiv);
        card.appendChild(dateDiv);
        card.appendChild(timeDiv);
        card.appendChild(detailsBtn);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);

        detailsBtn.addEventListener("click",()=>{
            modal2.style.display = "flex";
            document.querySelector(".title-text").textContent=todo.title;
            document.querySelector(".project").textContent = activeProject.name;//need to change this
            document.querySelector(".description").textContent=todo.description;
            document.querySelector(".date").textContent=todo.date;
            document.querySelector(".priority").textContent=todo.priority;
        });

        editBtn.addEventListener("click",()=>{
            modal3.style.display = "flex";
            const title = document.querySelector(".modal3 .cont .container label input#title");
            title.value=todo.title;
            title.placeholder=todo.title;
            const description= document.querySelector(".modal3 #description");
            description.value=todo.description;
            description.placeholder=todo.description;
            const date = document.querySelector(".modal3 .cont .container label input#todo-date");
            date.value=todo.date;
            date.placeholder=todo.date;
            const checked=document.querySelector(".modal3 .cont .container label input#checkbox");
            checked.value=!!todo.checked;
            checked.placeholder=todo.checked;
            const buttons = document.querySelectorAll(".modal3 .priority button");
            buttons.forEach((button) => {
                button.onclick = () => {
                    buttons.forEach((b) => b.classList.remove("selected"));
                    button.classList.add("selected");
                };
            });
            const form2 = modal3.querySelector(".form2");
            if (form2) {
                form2.onsubmit = function (event) {
                    event.preventDefault(); 
                    modal3.style.display = "none";
                    form2.reset();
                    todo.update({
                        title: title.value, 
                        description: description.value, 
                        date: date.value, 
                        priority: document.querySelector(".modal3 .priority button.selected")?.textContent.toLowerCase(), 
                        checked: checked.checked
                    });
                    saveProjects(projects); 
                    renderTodos(project);
                };
            }
        });


        deleteBtn.addEventListener("click",()=>{
            project.removeTodo(todo);
            renderTodos(project); 
            saveProjects(projects); 
        })

        checkbox.addEventListener("change", ()=>{
            todo.toggleChecked();
            card.classList.toggle("checked");
            saveProjects(projects);
        })
    }

    const closed = document.querySelector(".closeBtn");

    if (closed) {
        closed.onclick = function() {
            modal2.style.display = "none";
        }
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target == modal2) {
            modal2.style.display = "none";
        }
        if (event.target == modal3) { 
            modal3.style.display = "none";
        }
    };


    const form = modal.querySelector(".form");
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const date = document.getElementById('todo-date').value;
            const checked = document.getElementById("checkbox").checked;
            const selectedPriority = form.querySelector(".priority button.selected");
            const priority = selectedPriority ? selectedPriority.textContent.toLowerCase() : "low"; 

            const todo = new Todo({ title, description, date, priority, checked }); 
                activeProject.addTodo(todo); 
                renderTodos(activeProject);
                saveProjects(projects);

            modal.style.display = "none";
            form.reset();
        });
    }
    if (activeProject){
        renderTodos(activeProject); 
    } 

    const copytext=document.querySelector(".copytext");
    copytext.innerHTML = `Copyright <span>&#169;</span> Prakhar_Shah ${new Date().getFullYear()} @`;
}

export default UI;
