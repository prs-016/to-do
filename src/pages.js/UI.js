import Project from "./models/project.js";
import Todo from "./models/todo.js";



function UI(){
    const Gym = new Project({name:"Gym"});
    const add = document.querySelector(".add");
    const modal = document.querySelector(".modal");
    add.addEventListener("click",()=>{
        modal.style.display="flex";
    })


    function addCard(Todo){
        const right = document.querySelector(".right");
        const card = document.createElement("div");
        right.appendChild(card);
        card.classList.add("card", "high");
        Todo.checked?card.classList.add("checked"):Todo.classList.remove("checked");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox";
        checkbox.value = Todo.checked;
        const textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = Todo.title;
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("date");
        dateDiv.textContent = Todo.date;  //need to splice and change this
        const timeDiv = document.createElement("div");
        timeDiv.classList.add("time");
        timeDiv.textContent = "9:00";     //need to change this
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
            modal2.style.display="flex";
            document.querySelector(".title-text").textContent=Todo.title;
            document.querySelector(".project").textContent="Gym";//need to change this
            document.querySelector(".description").textContent=Todo.description;
            document.querySelector(".date").textContent=Todo.date;
            document.querySelector(".priority").textContent=Todo.priority;
        });

        editBtn.addEventListener("click",()=>{
            modal3.style.display="flex";
            const title = document.querySelector(".modal3 .cont .container label input#title");
            title.value=Todo.title;
            title.placeholder=Todo.title;
            const description= document.querySelector(".modal3 .cont .container label input#description");
            description.value=Todo.description;
            description.placeholder=Todo.description;
            const date = document.querySelector(".modal3 .cont .container label input#todo-date");
            date.value=Todo.date;
            date.placeholder=Todo.date;
            const checked=document.querySelector(".modal3 .cont .container label input#checkbox");
            checked.value=Todo.checked;
            checked.placeholder=Todo.checked;
            const buttons = document.querySelectorAll(".modal3 .cont .priority button");
            const priorityInput = document.getElementById("priority");
            buttons.forEach(button => {
                button.addEventListener("click", () => {
                buttons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
                priorityInput.value = button.textContent.toLowerCase();
                });
            });
            const form2 = modal.querySelector(".form2");
            if (form2) {
                form2.addEventListener('submit', function(event) {
                    event.preventDefault(); 
                    modal3.style.display = "none";
                    form2.reset();
                    Todo.update({title: this.title, description: this.description, date: this.date, priority: this.priorityInput, checked: this.checked});
                });
            }
        });


        deleteBtn.addEventListener("click",()=>{
            Gym.removetodo(Todo);
            right.removeChild(card);
        })

        checkbox.addEventListener("change", ()=>{
            Todo.toggleChecked();
            card.classList.toggle("checked");
        })
    }

    const closed = document.querySelector(".closeBtn");

    if (closed) {
        closed.onclick = function() {
            modal2.style.display = "none";
        }
    }
    window.onclick = function(event) {
        if (event.target == modal2) {
            modal2.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const form = modal.querySelector(".form");
    if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('todo-date').value;
        const done = document.getElementById('checkbox').checked;
        const buttons = document.querySelectorAll(".priority button");
        const priorityInput = document.getElementById("priority");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            priorityInput.value = button.textContent.toLowerCase();
            });
        });

        Gym.addtodo({title: title, description:description, date: date, priority: priorityInput, checked: checked});
        addCard({title: title, description:description, date: date, priority: priorityInput, checked: checked});

        modal.style.display = "none";
        form.reset();
    });
}

}

export default UI;
