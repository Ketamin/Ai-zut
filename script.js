class Todo {
  constructor() {
    this.id = 0
    this.tasks = []
    this.isEditing = false
    this.editingId = null
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []

    for (const task of tasks) {
      this.tasks.push({
        id: this.id++,
        ...task,
      })
    }
  }

  addTask(taskTitle, taskDate) {
    // Find task with greatest id
    const greatestIdTask = this.tasks.reduce(
      (prev, current) => (prev.id > current.id ? prev : current),
      {}
    )

    const shouldUseGreatestTask = Object.keys(greatestIdTask).length > 0

    const task = {
      id: shouldUseGreatestTask ? greatestIdTask.id + 1 : 0,
      task: taskTitle,
      done: false,
      date: taskDate,
    }

    if (task.task.length < 3 || task.task.length > 255) {
      alert('Task title has to be longer than 3 characters')
      return
    }

    if (task.date) {
      const today = new Date()
      const taskDateObject = new Date(task.date)
      if (taskDateObject <= today) {
        alert('Task date has to be in the future')
        return
      }
    }

    this.tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
    this.draw()
  }

  removeTask(index) {
    this.tasks.splice(index, 1)
    this.draw()
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  doneTask(index) {
    this.tasks[index].done = true
    this.isEditing = false
    this.draw()
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  undoneTask(index) {
    this.tasks[index].done = false
    this.draw()
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  editTask(index, newTitle, newDate) {
    console.log(index)
    if (newTitle.length < 3) {
      alert('Task title has to be longer than 3 characters')
      return false
    }

    const today = new Date()
    const newDateObject = new Date(newDate)
    if (newDateObject <= today) {
      alert('Task date has to be in the future')
      return false
    }

    // Find task with id === index
    const task = this.tasks.find((task) => task.id === index)
    task.task = newTitle
    task.date = newDate
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
    this.draw()
    return true
  }

  searchAndMark(searchText) {
    this.tasks.forEach((task, index) => {
      const titleText = task.task
      const taskTitle = document.querySelector(`[data-id="${task.id}"] .task`)
      taskTitle.innerHTML = titleText

      if (searchText.length < 2) {
        this.draw()
        return
      }

      if (titleText.includes(searchText)) {
        const markedTitle = titleText.replace(
          new RegExp(searchText, 'g'),
          `<mark>${searchText}</mark>`
        )
        taskTitle.innerHTML = markedTitle

        // We should filter out tasks that are not matched
        this.tasks = this.tasks.filter((task) => task.task.includes(searchText))
        this.draw()
      }
    })
  }

  draw() {
    const todoList = document.getElementById('todo-list')
    todoList.innerHTML = ''

    this.tasks.forEach((task, index) => {
      const taskElement = document.createElement('div')
      taskElement.classList.add('task-element')
      const taskTitle = document.createElement('div')
      const taskDate = document.createElement('div')
      const taskCheckbox = document.createElement('input')
      taskCheckbox.type = 'checkbox'
      taskCheckbox.checked = task.done

      if (task.done) {
        taskTitle.classList.add('done')
      } else {
        taskTitle.classList.remove('done')
      }

      taskCheckbox.addEventListener('click', (e) => {
        if (taskCheckbox.checked) {
          this.doneTask(index)
        } else {
          this.undoneTask(index)
        }
        // stop propagation to prevent click on taskElement
        e.stopPropagation()
      })

      taskTitle.classList.add('task')
      taskDate.classList.add('date')
      taskDate.innerText = task.date
      taskTitle.innerText = task.task

      taskElement.addEventListener('click', (e) => {
        // If user click on delete button just return
        if (e.target.classList.contains('remove-button')) {
          return
        }
        e.stopPropagation()

        if (!task.done) {
          const fullTaskElement = document.querySelector(
            `[data-id="${task.id}"]`
          )

          if (this.isEditing) {
            if (
              parseInt(e.target.closest('.task-element').dataset.id) !==
                this.editingId &&
              this.tasks.length > 1
            ) {
              const currentEditingTaskInput = document.querySelector(
                `[data-id="${this.editingId}"] .editing_input`
              )
              const currentEditingTaskDate = document.querySelector(
                `[data-id="${this.editingId}"] .editing_input_date`
              )
              // We should now edit task
              if (
                this.editTask(
                  this.editingId,
                  currentEditingTaskInput.value,
                  currentEditingTaskDate.value
                )
              ) {
                this.isEditing = false
              }
              return
            }
          }

          this.isEditing = true
          this.editingId = task.id

          const inputTitle = document.createElement('input')
          inputTitle.value = task.task
          inputTitle.classList.add('editing_input')
          inputTitle.dataset.id = task.id
          const inputDate = document.createElement('input')
          inputDate.type = 'date'
          inputDate.value = task.date
          inputDate.classList.add('editing_input_date')
          inputDate.dataset.id = task.id

          if (fullTaskElement.contains(taskCheckbox)) {
            fullTaskElement.removeChild(taskCheckbox)
          }

          taskTitle.replaceWith(inputTitle)
          taskDate.replaceWith(inputDate)

          // Handle click outside fullTaskElement
          const outsideClickListener = (event) => {
            const removeOutsideClickListener = () => {
              document.removeEventListener('click', outsideClickListener)
            }
            if (
              !fullTaskElement.contains(event.target) &&
              // Check if user click on another task
              event.target.closest('.task')?.innerHTML !== task.task &&
              this.isEditing
            ) {
              const currentInputTitle = document.querySelector(
                `[data-id="${task.id}"] .editing_input`
              )
              const currentInputDate = document.querySelector(
                `[data-id="${task.id}"] .editing_input_date`
              )
              console.log(task)
              if (
                this.editTask(
                  task.id,
                  currentInputTitle.value,
                  currentInputDate.value
                )
              ) {
                this.isEditing = false
                removeOutsideClickListener()
              }
              return
            }
          }
          document.addEventListener('click', outsideClickListener)
        }
      })

      const removeButton = document.createElement('button')
      removeButton.classList.add('remove-button')
      removeButton.innerText = 'Delete'
      removeButton.addEventListener('click', () => {
        this.removeTask(index)
      })

      taskElement.dataset.id = task.id
      taskElement.appendChild(taskCheckbox)
      taskElement.appendChild(taskTitle)
      taskElement.appendChild(taskDate)
      taskElement.appendChild(removeButton)
      todoList.appendChild(taskElement)
    })
  }
}

const todo = new Todo()
todo.draw()

const addTodoButton = document.getElementById('add-todo')
const searchInput = document.getElementById('search')

addTodoButton.addEventListener('click', () => {
  const input = document.getElementById('todo-input')
  const date = document.getElementById('todo-date')
  const taskTitle = input.value
  const taskDate = date.value
  todo.addTask(taskTitle, taskDate)
  input.value = ''
})

searchInput.addEventListener('input', () => {
  const searchText = searchInput.value
  todo.searchAndMark(searchText)
})
