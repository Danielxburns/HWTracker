
const dt = new Date();

document.getElementById('week').innerHTML = ` ${startWeek(dt)} - ${endWeek(dt)}`;

document.getElementById('today').innerHTML = getToday(dt);

const cells = document.querySelectorAll('td');
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

const url = 'https://peaceful-gorge-58758.herokuapp.com'; 

getTasks();

/* ------------- ANCHOR UTILS ------------ */

function getToday(day) {
  const dayOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day.getDay()];
  const dateString = day.toDateString();
  return `${dayOfWeek} ${dateString.substring(3, dateString.length - 5)}, ${day.getFullYear()}`;
}

function startWeek(day) {
  const diff = day.getDate() - day.getDay() + (day.getDay()? 0 : -6);
  return new Date(day.setDate(diff)).toLocaleDateString();
};

function endWeek(day) {
  const diff = day.getDate() - day.getDay() + (day.getDay()? 0 : 6);
  return new Date(day.setDate(diff)).toLocaleDateString();
};

function populateCells(tasks) {
  console.log('inside populateCells tasks :>> ', tasks);
  cells.forEach(cell => {
    const subj = cell.className;
    const day = cell.parentNode.className;
    const tasksOfTheDay = tasks.filter(task => (task.subject === subj && task.day === day));
    tasksOfTheDay.forEach(task => displayTask(cell, task));
  })
}

function displayTask(cell, task) {
  const item = document.createElement("div");
  item.className = "item";
  item._id = task._id;
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  if(task.done) { checkBox.checked = true }
  const label = document.createElement("label");
  label.for = checkBox; // REVIEW does this need to be tied to an id?
  if(task) { // don't do anything if there is no task entered
    label.appendChild(document.createTextNode(task.task))
    label.className = 'text';
    label.setAttribute('data-text', task.task)
    item.appendChild(checkBox);
    item.appendChild(label);
    cell.appendChild(item);
  }
};

/* -------- ANCHOR EVENT HANDLERS -------- */

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    return updateTask(e.target.parentNode._id, e.target.nextSibling.dataset.text, e.target.checked);
  } else if (e.target.className === 'text') {
    return (e.shiftKey) ? remove(e.target) : edit(e.target)
  } else {
    return addNewTask(e.target)
  }
};

async function addNewTask(el) {
    const assignment = prompt('add an assignment');
    if (assignment) {
      try {
        const newTask = await postNewTask(el.className, el.parentNode.className, assignment);
        /* console.log('Success! Posted to database: ', newTask); */
        return await displayTask(el, newTask);
      }
      catch(err) {
        console.log('There was an error :>> ', err);
      }
  }
};

function remove(el) {
  let sure = confirm(`Are you sure you want to delete \n ${el.innerHTML}?`)
  if (sure) { 
    deleteTask(el.parentNode._id)
    el.parentNode.remove();
  }
};

function edit(el) {
  let currText = el.dataset.text
  let newText = prompt('Edit Assignment', currText)
  if (newText) {
    el.dataset.text = newText;
    el.innerHTML = newText;
    updateTask(el.parentNode._id, newText, el.previousSibling.checked);
  }
};

/* ------------- ANCHOR SERVER CALLS ------------ */


function getTasks() {
  fetch(`${url}/getTasks`, {mode: 'no-cors'})
  .then(res => res.json())
  .then(data => {
    populateCells(data);
  })
  .catch(err => {
    console.error(JSON.stringify(err)); // TODO handle gracefully 
  })
};

async function postNewTask(subject, day, task) {
  const data = {
    subject: subject,
    day: day,
    createdOn: new Date(),
    weekStart: startWeek(new Date()),
    weekEnd: endWeek(new Date()),
    task: task,
  };
  const config = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'mode': 'no-cors'
    },
    body: JSON.stringify(data),
    mode: 'no-cors'
  };
  console.log('app.postNewTask config :>> ', config);
  const request = new Request(`${url}/newTask`, config)
  console.log('app.postNewTask request.headers:>> ', request.headers);
  const response = await fetch(request);
  try {
    const taskData = await response.json();
    console.log('taskData :>> ', taskData);
    return taskData;
  } catch(err) {
    throw(err);
  }
};

function deleteTask(id) {
  fetch(`${url}/deleteTask`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'_id': id}),
    mode: 'no-cors'
  })
  .then(res => res.json())
  .then(data => {
    console.log('Deleted: ', JSON.stringify(data));
  })
  .catch(err => {
    console.error(err);
  })
};

function updateTask(id, task, done) {
  let data = {
    _id: id,
    modifiedOn: new Date(),
    task: task,
    done: done
  };
  fetch(`${url}/updateTask`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    mode: 'no-cors'
  })
  .then(res => res.json())
  .then(data => {
    console.log('Updated task: ', JSON.stringify(data.task));
  })
  .catch(err => {
    console.error(err);
  })
};

