const express = require('express')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const tasks = [
    { 
        id: "1",
        text: "task 1 makes a task",
        status: 0
    },
    { 
        id: "2",
        text: "task 2 makes a task",
        status: 0
    }
]

const inProcessTasks = [
    {
        id: "3",
        text: "buy oranges",
        status: 0
    },
    {
        id: "4",
        text: "Hoover",
        status: 0
    },
    {
        id: "3",
        text: "Practice JavaScript",
        status: 0
    }
]

app.use(express.static('public'))

//tasks
app.get('/tasks', (req, res) => {
    res.send(tasks)
})
app.post('/tasks', (req,res) => {
    const task = req.body
    tasks.push(task)
    res.send(tasks)
})

//inprocess tasks
app.get('/inProcessTasks', (req, res) => {
    res.send(inProcessTasks)
})
app.post('/inProcessTasks', (req,res) => {
    const task = req.body
    inProcessTasks.push(task)
    res.send(inProcessTasks)
})

app.listen(3000, () => {
    console.log('app server running on port', 3000)
})
