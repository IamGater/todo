const todoInput = document.querySelector('.todo-input')
const todoButton = document.querySelector('.todo-button')
const todoList = document.querySelector('.todo-list')
const filterOption = document.querySelector('.filter-todo')


document.addEventListener('DOMContentLoaded', getTodos)
todoButton.addEventListener('click', addTodo)
todoList.addEventListener('click', deleteCheck)
filterOption.addEventListener('click', filterTodo)


const createDiv = (value, completed = false) => {
    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo', completed ? 'completed' : 'uncompleted')

    const newTodo = document.createElement('li')
    newTodo.innerText = value
    newTodo.classList.add('todo-item')
    todoDiv.appendChild(newTodo)

    const completeButton = document.createElement('button')
    completeButton.innerHTML = '<i class="fas fa-check"></i>'
    completeButton.classList.add('complete-btn')
    todoDiv.appendChild(completeButton)

    const editButton = document.createElement('button')
    editButton.innerHTML = '<i class="fas fa-edit"></i>'
    editButton.classList.add('edit-btn')
    editButton.addEventListener('mousedown', (e) => e.preventDefault())
    todoDiv.appendChild(editButton)

    const trashButton = document.createElement('button')
    trashButton.innerHTML = '<i class="fas fa-trash"></i>'
    trashButton.classList.add('trash-btn')
    todoDiv.appendChild(trashButton)

    const firstCompleted = todoList.querySelector('.completed')
    if (!completed && firstCompleted) {
        todoList.insertBefore(todoDiv, firstCompleted)
    } else {
        todoList.appendChild(todoDiv)
    }
}

function addTodo(event) {

    event.preventDefault()

    if (todoInput.value === '') {
        todoInput.placeholder = 'input text'
        return
    }

    createDiv(todoInput.value)

    saveLocalTodos({
        text: todoInput.value,
        completed: false
    })
    todoInput.value = ''
    todoInput.placeholder = ''
} 

function deleteCheck(e) {
    const item = e.target
    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement
        todo.classList.add('fall')
        removeLocalTodos(todo)
        todo.addEventListener('transitionend', function () {
            todo.remove()
        })
    }

    if (item.classList[0] === 'edit-btn') {
        const todo = item.parentElement
        const todoItem = todo.firstChild

        if (todoItem.isContentEditable) {
            todoItem.blur()
            return
        }

        const oldText = todoItem.innerText
        todoItem.contentEditable = true
        todoItem.focus()
        window.getSelection().selectAllChildren(todoItem)
        window.getSelection().collapseToEnd()

        todoItem.onkeydown = function (event) {
            if (event.key === 'Enter') {
                event.preventDefault()
                todoItem.blur()
            }
        }

        todoItem.addEventListener('blur', function () {
            todoItem.contentEditable = false
            const newText = todoItem.innerText.trim()
            if (newText === '') {
                todoItem.innerText = oldText
            } else {
                todoItem.innerText = newText
                editLocalTodos(oldText, newText)
            }
        }, { once: true })
    }

    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement
        const text = todo.firstChild.innerText
        let todos = JSON.parse(localStorage.getItem('todos') || '[]')

        todos = todos.map(function (item) {
            if (typeof item === 'string') {
                item = { text: item, completed: false }
            }
            if (item.text === text) {
                item.completed = !item.completed
            }
            return item
        })

        localStorage.setItem('todos', JSON.stringify(todos))
        todo.classList.toggle('completed')
        todo.classList.toggle('uncompleted')

        if (todo.classList.contains('completed')) {
            todoList.appendChild(todo)
        } else {
            const firstCompleted = todoList.querySelector('.completed')
            todoList.insertBefore(todo, firstCompleted)
        }
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes
    todos.forEach(function (todo) {
        switch (e.target.value) {
            case 'all':
                todo.style.display = 'flex'
                break;
            case 'completed':
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'flex'
                } else {
                    todo.style.display = 'none'
                }
                break;
            case 'uncompleted':
                if (todo.classList.contains('uncompleted')) {
                    todo.style.display = 'flex'
                } else {
                    todo.style.display = 'none'
                }
                break;
        }
    });
}



function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }

    todos.push(todo)
     localStorage.setItem('todos', JSON.stringify(todos))
}

function removeLocalTodos(todo) {
    const text = todo.firstChild.innerText
    let todos

    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }

    todos = todos.filter((item) => (typeof item === 'string' ? item : item.text) !== text)
    localStorage.setItem('todos', JSON.stringify(todos))
}

function editLocalTodos(oldText, newText) {
    let todos

    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }

    todos = todos.map(function (item) {
        if (typeof item === 'string') {
            item = { text: item, completed: false }
        }
        if (item.text === oldText) {
            item.text = newText
        }
        return item
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}

function getTodos() {
    let todos
    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    todos = todos.map(function (todo) {
        return typeof todo === 'string' ? { text: todo, completed: false } : todo
    })
    localStorage.setItem('todos', JSON.stringify(todos))

    todos.forEach(function (todo) {
        createDiv(todo.text, todo.completed)
    })
 }