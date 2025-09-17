import Project from "./project.js";
import Todo from "./todo.js";
import { saveProjects, loadProjects } from "./storage.js";


function UI(){
    console.log("1");
    let projects = loadProjects();
    if (!projects || projects.length === 0) {
        projects = [
            new Project({ name: "Gym" }),
            new Project({ name: "Study" }),
            new Project({ name: "Work" })
        ];
        saveProjects(projects);
    }
    console.log("12");
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
console.log("123");
    function renderTodos(project) { 
        right.innerHTML = ""; 
        project.todolist.forEach((td) => addCard(td, project)); 
    }
console.log("1231");
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
console.log("12312");
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
        console.log("123123");
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
            if (form2){
                form2.onsubmit = function(event) {
                    event.preventDefault(); 
                    if (activeTodo) {
                        activeTodo.update({
                            title: title.value, 
                            description: description.value, 
                            date: date.value, 
                            priority: document.querySelector(".modal3 .priority button.selected")?.textContent.toLowerCase(), 
                            checked: checked.checked
                        });
                        saveProjects(projects); 
                        renderTodos(project);
                    }
                    modal3.style.display = "none";
                    activeTodo = null;
                    form2.reset();
                };
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
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((b) => b.classList.remove("selected"));
                button.classList.add("selected");
            });
            console.log("4231");
        });
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const title = modal.querySelector('#title').value;
            const description = modal.querySelector('#description').value;
            const date = modal.querySelector('#todo-date').value;
            const checked = modal.querySelector("#checkbox").checked;
            const selectedPriority = form.querySelector(".priority button.selected");
            const priority = selectedPriority ? selectedPriority.textContent.toLowerCase() : "low"; 

            const todo = new Todo({ title, description, date, priority, checked }); 
                activeProject.addtodo(todo); 
                renderTodos(activeProject);
                saveProjects(projects);

            modal.style.display = "none";
            form.reset();
        });

        console.log("aaaaaa");
        const addTodoBtn = document.querySelector(".addTodo");
        const addProjectBtn = document.querySelector(".addProject");
        const addNoteBtn = document.querySelector(".addNote");
        const allAddButtons = [addTodoBtn, addProjectBtn, addNoteBtn];
        const todoFormHTML = `
        <form action="" method="" class="form">
        <div class="container">
            <label for="title">
            <div class="text">Task Title:</div>
            <input type="text" placeholder="Title: Pay Bills" id="title" pattern=".*\\S.*" maxlength="20" required>
            </label>
        </div>
        <div class="container">
            <label for="description">
            <div class="text">Description:</div>
            <textarea placeholder="Description: Rent & Utilities" id="description" pattern=".*\\S.*" required rows="4" cols="50"></textarea>
            </label>
        </div>
        <div class="container">
            <label for="todo-date">
            <div class="text">Date and Time:</div>
            <input type="text" id="todo-date" placeholder="Select date and time" required>
            </label>
        </div>
        <div class="container">
            <label for="checkbox">
            <div class="text">Done?</div>
            <input type="checkbox" id="checkbox" value="no">
            </label>
        </div>
        <div class="priority">
            <div class="text">Priority:</div>
            <button type="button" class="high selected">High</button>
            <button type="button" class="medium">Medium</button>
            <button type="button" class="low">Low</button>
        </div>
        <div class="btn">
            <button class="submit-btn" type="submit">Create New TO-DO</button>
        </div>
        </form>
        `;

        const projectFormHTML = `
        <form action="" method="" class="form-project">
                    <div class="container">
                        <label for="title">
                            <div class="text">Project Title:</div>
                            <input type="text" placeholder="Project Title: Gym"  id="title"  pattern=".*\\S.*" maxlength="20" required="required">
                        </label>
                        <div class="btn">
                        <button class="submit-btn" type="submit">Create New TO-DO</button>
                    </div> 
                    </div>
                </form>
        `;



        function selectButton(selectedBtn) {
            allAddButtons.forEach((btn) => btn.classList.remove("selected"));
            selectedBtn.classList.add("selected");

            const cont = document.querySelector(".modal .cont");
            cont.querySelectorAll("form").forEach(f => f.remove());

            if(selectedBtn==addTodoBtn){
                cont.insertAdjacentHTML("beforeend", todoFormHTML);
                const form = cont.querySelector("form");
                const priorityBtns = form.querySelectorAll(".priority button");
                priorityBtns.forEach((btn) => {
                    btn.onclick = () => {
                        priorityBtns.forEach((b) => b.classList.remove("selected"));
                        btn.classList.add("selected");
                    };
                });
                form.addEventListener('submit', function(event) {
                    event.preventDefault(); 
                    const title = modal.querySelector('#title').value;
                    const description = modal.querySelector('#description').value;
                    const date = modal.querySelector('#todo-date').value;
                    const checked = modal.querySelector("#checkbox").checked;
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

            else if(selectedBtn==addProjectBtn){
                cont.insertAdjacentHTML("beforeend", projectFormHTML);
                const form = cont.querySelector("form");
                form.addEventListener('submit', function(event) {
                    event.preventDefault();
                    const nameInput = form.querySelector("#title");
                    const name =nameInput.value.trim();
                    nameInput.setCustomValidity("");

                    if (projects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
                        nameInput.setCustomValidity("Project name already taken.");
                        nameInput.reportValidity();
                        return;
                    }
                    else{
                        nameInput.setCustomValidity("");
                    }
        
                    const newproject =new Project({name});
                    projects.push(newproject);
                    activeProject=newproject;
                    const list = document.querySelector(".Project");
                    const container = document.createElement("div");
                    list.appendChild(container);
                    container.classList.add("container");
                    const btn = document.createElement("button");
                    container.appendChild(btn);
                    btn.textContent=newproject.name;
                    btn.classList.add(`${newproject.name}`);
                    const num = document.createElement("div");
                    container.appendChild(num);
                    num.textContent=0;
                    num.classList.add("num");
                    renderTodos(activeProject);
                    saveProjects(projects);
                    modal.style.display = "none";
                    form.reset();
                });
            }
        }
        console.log("1234");
        allAddButtons.forEach((btn) => {
          btn.addEventListener("click", () => selectButton(btn));
        });

    }


   

    const projectBtns = document.querySelectorAll(".Project .container button");
    console.log("Hello");
    projectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        console.log(btn+" selected");
        // Remove 'selected' class from all containers
        document.querySelectorAll(".Project .container").forEach((container) => {
            container.classList.remove("selected");
        });

        // Add 'selected' class to the clicked button's parent container
        btn.parentElement.classList.add("selected");
        console.log("should be updated"+btn);

        // Update activeProject based on the clicked button
        const projectName = btn.textContent.trim();
        activeProject = projects.find((project) => project.name === projectName);

        // Render todos for the selected project
        renderTodos(activeProject);
        saveProjects(projects);
    });
});

    if (activeProject){
        renderTodos(activeProject); 
    } 

    const copytext=document.querySelector(".copytext");
    copytext.innerHTML = `Copyright <span>&#169;</span> Prakhar_Shah ${new Date().getFullYear()} @`;
}

export default UI;

