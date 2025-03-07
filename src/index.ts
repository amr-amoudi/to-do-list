type Tasks = {
    // color for a background color and a boxShadow
    color : string,
    // id for checking
    id: string,
    // for the checkbox
    isChecked: boolean,
    // html format for the li element
    htmlContent : string;
}

const input: HTMLInputElement = document.getElementById("to-do-input") as HTMLInputElement;
const addButton: HTMLButtonElement = document.getElementById("to-do-submit") as HTMLButtonElement;
const toDoList: HTMLUListElement = document.getElementById("to-do-list") as HTMLUListElement
const backgroundColor: HTMLInputElement = document.getElementById("to-do-background-color") as HTMLInputElement
const time : HTMLInputElement = document.getElementById("to-do-time") as HTMLInputElement
const deleteButton: HTMLButtonElement = document.getElementById("delete-all") as HTMLButtonElement


let tasksArray: Tasks[] = JSON.parse(localStorage.getItem("tasks") || "[]")

// render all tasks from localStorage if exists
renderTasks()
// add needed event listener to the tasks
addEventListeners()

// add task button
addButton.addEventListener("click", () => {
    // if the input is empty it will not add a <li> item
    if (input.value) {
        // display new task
        addToDo(input.value)
        // update localStorage
        localStorage.setItem("tasks", JSON.stringify(tasksArray))
        // add an event listener to the new task
        addEventListenerToNewTasks()
        // clear input
        input.value = "";
    }
})

function addEventListenerToNewTasks(): void {
    // gets an array of all the items that has the class of "check-box-button"
    // then takes the last item of that array
    // then add the handleTaskClick event listener to it
    document.querySelectorAll(".check-box-button")[tasksArray.length - 1].addEventListener("click", handleTaskClick)
}

// this function saves the checked tasks that the user finished
function handleTaskClick(e : Event) {
    // getting the target item to satisfy typescript
    const target = e.target as HTMLElement;
    // getting the id value passed in data-id
    const idValue: string = target.dataset.id || "";

    // map through the array of tasks
    tasksArray = tasksArray.map((task: Tasks): Tasks => {
        // when an id of an item matches with the idVale
        if (task.id === idValue) {
            // it returns the old properties of the task
            // but the isCheck get flipped based on what it was before
            // eg: {
            //      color: "#ffffff",
            //      id:"task1234",
            //      htmlContent: this should be the input and the label,
            //      isChecked: if it was true it turns to false
            //     }
            return {...task, isChecked: !task.isChecked}
        } else {
            // if the id doesn't equal to the idValue
            // it get returned as is
            return task
        }
    })

    // update the localStorage with the new tasksArray
    localStorage.setItem("tasks", JSON.stringify(tasksArray))
}

// use to add event listeners to all tasks when the app renders
function addEventListeners() {
    // gets an array of all the items that has the class of "check-box-button"
    document.querySelectorAll(".check-box-button").forEach((checkBox) => {
        // loop through then and add the handleTaskClick function as the click event listener
        checkBox.addEventListener("click", handleTaskClick)
    })
}

deleteButton.addEventListener("dblclick", () => {
    // calls the delete function when the delete button gets double-clicked
    deleteAllTasks()
})

function deleteAllTasks(): void {
    // resets all the values
    toDoList.textContent = ""
    tasksArray = []
    localStorage.setItem("tasks", "[]")
}

function getTime(value : string): string{
    // splits the value to 2
    const [hours, minutes] = value.split(":")
    // turns the hours to a number value
    let hoursNumber: number = Number(hours)
    let period  = "AM";

    // if the hours is grader or equal to 12
    // change the value of period to PM eg: 15:30
    if(hoursNumber >= 12){
        period  = "PM";
        // if hours are more than 12
        // it subtracts the number of hours from 12
        // eg: 15 -> 15 - 12 = 3 so it's 3pm
        if(hoursNumber > 12){
            hoursNumber -= 12;
        }
    }else if(hoursNumber === 0){
        // if hours = 0 just change the period to AM
        // no need to check if hours are less than 12
        // because the period is already AM
        hoursNumber = 12;
        period  = "AM";
    }

    // eg return: 3:40AM
    return `${hoursNumber}:${minutes}${period}`;
}

// this function creates and <li> element and returns 3 values
// 1- the HTML <li> element
// 2- the color of the background
// 3- the html format eg: <input type="checkbox"/> it's shown on line 157
function creatTaskElement(color: string, htmlFormat: string): [HTMLLIElement, string, string]{
    // creat a li element
    const htmlElement: HTMLLIElement = document.createElement("li")
    // add the COLOR to the background
    htmlElement.style.backgroundColor = color
    // add boxShadow based on the COLOR
    htmlElement.style.boxShadow = `${color} 0 0 40px`;
    // adding the htmlFormat in this case the input and the label
    htmlElement.innerHTML = htmlFormat;

    // return all the stuff
    return [htmlElement, color, htmlFormat];
}

// appending a "to do task" item to prevent re-render which can rerun the animation
function addToDo(input : string): void{
    // generating an ID from input value with a random number to prevent duplicates
    const elementId : string = input.split(" ").join("-") + Math.random() * 100;

    // getting the return values from creatTaskElement
    const [htmlElement, color, text] = creatTaskElement(
        // color value
        backgroundColor.value,
        // the htmlFormat
        `
            <input id=${elementId} type="checkbox">
            <label 
                class="check-box-button task" 
                for=${elementId} 
                data-id=${elementId}>
                    <span data-id=${elementId}>
                        ${getTime(time.value)} ${input} 
                    </span>
            </label>
        `
    )

    // push the item to the tasksArray

    tasksArray.push({
        color: color,
        id:elementId,
        isChecked: false,
        htmlContent: text
    })

    // append the li item to the html
    toDoList.appendChild(htmlElement)
}

function renderTasks(): void {
    // loop through all the tasksArray
    tasksArray.forEach(task => {
        // creating a li element for each task
        // in this case I only needed the html element
        const [htmlElement] = creatTaskElement(task.color,task.htmlContent)

        // get the checkbox element
        const checkboxes = htmlElement.getElementsByTagName("input");
        const checkbox = checkboxes[0] as HTMLInputElement;

        // set the checkbox value to checked or not
        checkbox.checked = task.isChecked;

        // append the li item to the html
        toDoList.appendChild(htmlElement)
    })
}


