

class Task {
}
const state = {
    tasks: []
}
const view = (state) => `
    <header>
        <h1>To do list!</h1>
    </header>

        <section>
            <ul>
                ${state.tasks.map(task => `
                <li>${task.text}
                    <input class="check" onchange="app.run('checked', ${task.id})" ${task.status===1 ? 'checked' : ''} type="checkbox" )">
                    <button class="delete" onclick="app.run('deleteTask',id)" id="${task.id}">Delete</button>
                </li>`).join("")}
            </ul>

        </section>
        <section>
            <form onsubmit="app.run('add', this);return false;">
                <input name="task" placeholder="add a task" />
                <button>Add</button>
            </form>
        </section>

`
const update = {
    add: (state, form) => {
        const data = new FormData(form)
        const task = {
            id: window.crypto.getRandomValues(new Uint8Array(3)).join(""),
            text: data.get('task'),
            status: 0
        }
        state.tasks.push(task)
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
        // showDelete(id)
        return state
    },
    // showDelete: (id) => {
    //     const index = state.tasks.findIndex(element=> element.status === 1)
    //     element.status === 1 ? document.getElementById(element.id) : ''
        
    //     element.style.display = "block"
    //     return state
    // }
}
app.start('todoApp', state, view, update)

