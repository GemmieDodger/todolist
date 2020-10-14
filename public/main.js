

class Task {
    constructor(text){
        this.id = window.crypto.getRandomValues(new Uint8Array(3)).join(""),
        this.text = text,
        this.status = 0
    }
}
const state = {
    tasks: [],
    inProcessTasks: [],
    dragging: null
}

//TASKS
const viewTask = task => {
    //split into a new function to show the viewing of task
    return `<li
    id="${task.id}"
    draggable="true" 
    onclick="app.run('done', ${task.id})"
    ondragstart="app.run('onDragTask', event)"
    class="${task.status === 0 ? '' : 'done'} listItem"

    >${task.text}
        <input class="check" onchange="app.run('checked', ${task.id})" ${task.status===1 ? 'checked' : ''} type="checkbox" )">
        <button class="deleteButton" onclick="app.run('deleteTask', ${task.id})">Delete</button>
    </li>
    `
}
//IN PROCESS TASKS
const viewInProcessTask = task => {
    //split into a new function to show the viewing of task
    return `<li
    id="${task.id}"
    draggable="true" 
    onclick="app.run('done', ${task.id})"
    ondragstart="app.run('onDragTask', event)"
    class=" listItem"
    >${task.text}
        <button class="deleteButton" onclick="app.run('deleteInProcessTask', ${task.id})">Delete</button>
    </li>
    `
} 


const view = (state) => `
    <header>
        <h1>To do list!</h1>
    </header>
        <div id="container">
            <section id="list1">
                <h3>Backlog</h3>
                    <ul>
                        ${state.tasks.map(viewTask).join("")}
                    </ul>
                    <div class="deleteOnHover" ondragover="event.preventDefault()" ondrop="app.run('onDropTask', event)">Delete</div>        
                    <form onsubmit="app.run('add', this);return false;">
                        <input name="task" placeholder="add a task" />
                        <button class="addButton">Add</button>
                    </form>   
            
                    </section>
            <section id="list2">
                <h3>In Process</h3>
                    <div style="height: 80%;" ondragover="event.preventDefault()"  ondrop="app.run('onDropInProcessTask', event)">
                    <ul>
                        ${state.inProcessTasks.map(viewInProcessTask).join("")}
                    </ul>
                    </div>
                    <div class="deleteOnHover" ondragover="event.preventDefault()" ondrop="app.run('onDropDeleteInProcessTask', event)">Delete</div>  
            </section>
        </div>
`
const update = {
    add: async (state, form) => {
        const data = new FormData(form)
        const task = new Task(data.get('task'))
      
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }
        fetch('/tasks', postRequest).then(() => app.run('getTasks'))
        return state
    },

    checked: (state, id) => {
        const task = state.tasks.find((task) => {return task.id == id})
        task.status = 1
        return state
    },
    deleteTask: (state, id) => {
    
        const index = state.tasks.findIndex(element=> element.id === id)
        state.tasks.splice(index,1)
        return state
    },

    onDragTask:  (state, event) => {
        event.dataTransfer.setData('text', event.target.id)
        return state
    },

    onDropTask: (state, event) => {
        const id = event.dataTransfer.getData('text')
        console.log(id)
        const index = state.tasks.findIndex(task => task.id == id)
        state.tasks.splice(index,1)
        return state
    },
    getTasks: async (state) => {

        state.tasks = await fetch('/tasks').then(res => res.json())
        return state
    },

    addTasks: (state, tasks) => { 
        state.tasks = {...state.tasks, ...tasks}
        return state //three dots remove from array concats to antoher array
    },
    //inprocesstasks
    addInProcessTask: (state, form => {
        const data = new FormData(form)
        const task = {
            id: window.crypto.getRandomValues(new Uint8Array(2)).join(),
            text: data.get('text'),
            status: 0
        }
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        } 
        fetch('/inProcessTasks',postRequest).then(() => app.run('getInProcessTasks'))
        return State
    }),

    getInProcessTasks: async (state) => {
        state.inProcessTasks = await fetch('/inProcessTasks').then(res => res.json())
        console.log(state.inProcessTasks)
        return state
    },
    addInProcessTasks: (state, inProcessTasks) => {
        state.inProcessTasks = {...state.inProcessTasks, ...inProcessTasks}
        return state
    },

    onDropInProcessTask: (state, event) => {
        const id = event.dataTransfer.getData('text')
        const index = state.tasks.findIndex(task => task.id == id)
        var movedTask = state.tasks.splice(index,1)
        console.log(movedTask)
        state.inProcessTasks = state.inProcessTasks.concat(movedTask)
        console.log(state.inProcessTasks)
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movedTask)
        } 
        return state
    },
    deleteInProcessTask: (state, id) => {
    
        const index = state.inProcessTasks.findIndex(element=> element.id === id)
        state.inProcessTasks.splice(index,1)
        return state
    },

    onDropDeleteInProcessTask: (state, event) => {
        const id = event.dataTransfer.getData('text')
        console.log(id)
        const index = state.inProcessTasks.findIndex(task => task.id == id)
        state.inProcessTasks.splice(index,1)
        return state

    }
    
    // onHightlightTask: (state, event) => {
    //     event.stopPropagation() //stops affecting other areas that are within another area
    //     const id= event.dataTransfer.getData('text')
    //     const task = state.tasks.find(task => task.id == id)
    //     task.highlight=true
    // }

}
app.start('todoApp', state, view, update)
app.run('getTasks')
app.run('getInProcessTasks')