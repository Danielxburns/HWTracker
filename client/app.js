
const dt = new Date();

document.getElementById('week').innerHTML = ` ${startWeek(dt)} - ${endWeek(dt)}`;

document.getElementById('today').innerHTML = getToday(dt);

const cells = document.querySelectorAll('td');
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

getTasks(); // chain funcs to display response data

/* ------------- HELPER FUNCS ANCHOR ------------ */

function populateCells(tasks) {
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
  if(task) { // don't do anything if there is no task entered)
    label.appendChild(document.createTextNode(task.task))
    label.className = 'text';
    label.setAttribute('data-text', task.task)
    item.appendChild(checkBox);
    item.appendChild(label);
    cell.appendChild(item);
  }
};


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

/* -------- EVENT HANDLERS ANCHOR -------- */

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    return updateTask(e.target.parentNode._id, e.target.nextSibling.dataset.text, e.target.checked);
  } else if (e.target.className === 'text') {
    return (e.shiftKey) ? remove(e.target) : edit(e.target)
  } else {
    return add(e.target)
  }
};

async function add(el) {
    const assignment = prompt('add an assignment', 'enter assignment here');
    try {
      await postNewTask(el.className, el.parentNode.className, assignment)
        .then(displayTask(el, assignment));
    }
    catch(err) {
      console.log('There was an error :>> ', err);
    }
};

function remove(el) {
  let sure = confirm(`Are you sure you want to delete \n ${el.innerHTML}?`)
  if (sure) { 
    deleteTask(el.parentNode.taskId)
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

/* ------------- SERVER FUNCS ANCHOR ------------ */

function getTasks() {
  fetch('http://localhost:3000/getTasks')
  .then(res => res.json())
  .then(data => {
    populateCells(data);
  })
  .catch(err => {
    console.error(JSON.stringify(err));
  })
};

function postNewTask(subject, day, task) {
  let data = {
    subject: subject,
    day: day,
    createdOn: new Date(),
    weekStart: startWeek(new Date()),
    weekEnd: endWeek(new Date()),
    task: task,
  };
  fetch('http://localhost:3000/newTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => {
      console.log('Success! Posted to database: ', JSON.stringify(data));
    })
    .catch(err => {
      console.error(JSON.stringify(err));
    })
};

function deleteTask(id) {
  fetch('http://localhost:3000/deleteTask', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'taskId': id}),
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
  fetch('http://localhost:3000/updateTask', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(data => {
    console.log('Updated task: ', JSON.stringify(data.task));
  })
  .catch(err => {
    console.error(err);
  })
};

