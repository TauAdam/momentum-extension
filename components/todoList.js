const button = document.querySelector('.open-todo')
const popup = document.querySelector('.popup_todo')
export const TodoList = () => {
  button.addEventListener('click', () => {
    popup.classList.toggle('active')
    renderTasks()
  })
}

const form = document.querySelector('form')
const taskList = document.querySelector('.task-list')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

const renderTasks = () => {
  taskList.innerHTML = ''
  for (let i = 0; i < tasks.length; i++) {
    const li = document.createElement('li')
    li.classList.add('task')
    li.textContent = tasks[i].title
    if (tasks[i].completed) {
      li.classList.add('completed')
    }
    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = 'X'
    deleteBtn.addEventListener('click', () => {
      tasks.splice(i, 1)
      localStorage.setItem('tasks', JSON.stringify(tasks))
      renderTasks()
    })
    li.appendChild(deleteBtn)
    li.addEventListener('click', () => {
      tasks[i].completed = !tasks[i].completed
      localStorage.setItem('tasks', JSON.stringify(tasks))
      renderTasks()
    })
    taskList.appendChild(li)
  }
}

form.addEventListener('submit', e => {
  e.preventDefault()
  const newTaskInput = document.querySelector('.new-task')
  if (!newTaskInput.value.trim()) {
    return
  }
  tasks.push({ title: newTaskInput.value.trim(), completed: false })
  localStorage.setItem('tasks', JSON.stringify(tasks))
  newTaskInput.value = ''
  renderTasks()
})
