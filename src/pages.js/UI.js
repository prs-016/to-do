import Project from "./project.js";
import Todo from "./todo.js";
import { saveProjects, loadProjects } from "./storage.js";


function UI(){
    const projects = loadProjects() || [new Project({ name: "Gym" })];
    let activeProject = projects[0];
    let activeTodo = null;

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

    function formatDisplayDate(dateString) {
        if (!dateString) return "";
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('en-US', options);
    }

    function formatInputDate(dateString) {
        if (!dateString) return "";
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        // Format to YYYY-MM-DDTHH:MM for datetime-local input
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function addCard(todo, project){
        if (!(todo instanceof Todo)) {
            todo = Todo.fromJSON(todo);
        }
        const card = document.createElement("div");
        right.appendChild(card);
        card.classList.add("card", todo.priority || "high");
        if (todo.checked) card.classList.add("checked");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox-${todo.id}`;
        checkbox.checked = !!todo.checked;
        const textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = todo.title;
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("date");
        dateDiv.textContent = formatDisplayDate(todo.date);
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
        card.appendChild(detailsBtn);
        card.appendChild(editBtn);
        card.appendChild(deleteBtn);

        detailsBtn.addEventListener("click",()=>{
            modal2.style.display = "flex";
            const closed = document.querySelector(".closeBtn");
            document.querySelector(".modal2 .title-text").textContent=todo.title;
            document.querySelector(".modal2 .project p").textContent = project.name;//need to change this
            document.querySelector(".modal2 .description p").textContent=todo.description;
            document.querySelector(".modal2 .date p").textContent=todo.date;
            document.querySelector(".modal2 .priority p").textContent=todo.priority;

            const closeBtn = document.querySelector(".modal2 .closeBtn");
            if (closeBtn) {
                closeBtn.onclick = function() {
                    modal2.style.display = "none";
                };
            }
        });

        editBtn.addEventListener("click",()=>{
            activeTodo = todo;
            modal3.style.display = "flex";
            const title = modal3.querySelector("#title");
            title.value=todo.title;
            title.placeholder=todo.title;
            const description= modal3.querySelector("#description");
            description.value=todo.description;
            description.placeholder=todo.description;
            const date = modal3.querySelector("#todo-date");
            date.value=todo.date;
            date.placeholder=todo.date;
            const checked=modal3.querySelector("#checkbox");
            checked.value=!!todo.checked;
            checked.placeholder=todo.checked;
            const buttons = modal3.querySelectorAll(".priority button");
            buttons.forEach((b) => b.classList.remove("selected"));
            const current = modal3.querySelector(`.priority .${todo.priority}`);
            if (current) current.classList.add("selected");
 
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    buttons.forEach((b) => b.classList.remove("selected"));
                    button.classList.add("selected");
                }, { once: false });
            });
            const form2 = modal3.querySelector(".form2");
            if (form2) {
                form2.addEventListener('submit', function(event)  {
                    event.preventDefault(); 
                    activeTodo.update({
                        title: title.value, 
                        description: description.value, 
                        date: date.value, 
                        priority: document.querySelector(".modal3 .priority button.selected")?.textContent.toLowerCase(), 
                        checked: checked.checked
                    });
                    saveProjects(projects); 
                    renderTodos(project);
                    modal3.style.display = "none";
                    activeTodo = null;
                    form2.reset();
                });
            }
        });


        deleteBtn.addEventListener("click",()=>{
            project.removetodo(todo); 
            saveProjects(projects); 
            renderTodos(project);
        })

        checkbox.addEventListener("change", ()=>{
            todo.toggleChecked();
            card.classList.toggle("checked");
            saveProjects(projects);
        });
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
        if (event.target === modal2) {
            modal2.style.display = "none";
        }
        if (event.target === modal3) { 
            modal3.style.display = "none";
        }
    };


    const form = modal.querySelector(".form");
    if (form) {
         const buttons = modal.querySelectorAll(".priority button");
            buttons.forEach((b) => b.classList.remove("selected"));
            const current = modal.querySelector(`.priority .${todo.priority}`);
            if (current) current.classList.add("selected");
            console.log("clicked outside!");
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    console.log("clicked inside!");
                    buttons.forEach((b) => b.classList.remove("selected"));
                    button.classList.add("selected");
                }, { once: false });
            });
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const title = modal.getElementById('title').value;
            const description = modal.getElementById('description').value;
            const date = modal.getElementById('todo-date').value;
            const checked = modal.getElementById("checkbox").checked;
            const selectedPriority = form.querySelector(".priority button.selected");
            const priority = selectedPriority ? selectedPriority.textContent.toLowerCase() : "low"; 

            const todo = new Todo({ title, description, date, priority, checked }); 
                activeProject.addtodo(todo); 
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
