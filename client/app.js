
/* ------------- ANCHOR HELPER FUNCS ------------ */

const dt = new Date();
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

document.getElementById('today').innerHTML = getToday(dt);

document.getElementById('week').innerHTML = ` ${startWeek(dt)} - ${endWeek(dt)}`;


/* -------- ANCHOR EVENT HANDLERS -------- */

const cells = document.querySelectorAll('td');
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    return toggleDone(e.target.taskId);
  } else if (e.target.className === 'text') {
    return (e.shiftKey) ? remove(e.target) : edit(e.target)
  } else {
    return add(e.target)
  }
};

function add(el) {
  const assn = prompt('add an assignment');
  const item = document.createElement("div");
  item.className = "item";
  item.taskId = el.children.length +1;
  const box = document.createElement("input");
  box.type = "checkbox";
  box.taskId = item.taskId;
  const label = document.createElement("label");
  label.for = box.taskId;
  if(assn) { 
    label.appendChild(document.createTextNode(assn))
    label.className = 'text';
    label.setAttribute('data-text', assn)
    item.appendChild(box);
    item.appendChild(label);
    el.appendChild(item);
    postNewTask(el.className, item.taskId, assn)
  }
};

function remove(el) {
  let sure = confirm(`Are you sure you want to delete \n ${el.innerHTML}?`)
  if (sure) { 
    deleteTask(el.parentNode.taskId)
    el.parentNode.remove();
  }
}

function edit(el) {
  let currText = el.dataset.text
  let newText = prompt('Edit Assignment', currText)
  if (newText) {
    el.dataset.text = newText;
    el.innerHTML = newText;
    updateTask(el.parentNode.parentNode.className, el.parentNode.taskId, newText);
  }
}


/* ------------- ANCHOR SERVER FUNCS ------------ */

function postNewTask(subject, id, task) {
  let data = {
    subject: subject,
    taskId: id,
    date: new Date(),
    task: task};
  fetch('http://localhost:3000/newTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => {
      console.log('Success: ', JSON.stringify(data))
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
}
function toggleDone(id) {
  fetch('http://localhost:3000/toggleDone', {
    method: 'PUT',
    // need to just send numbers
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"taskId": id}),
  })
  .then(res => res.json())
  .then(data => {
    console.log('Toggled task: ', JSON.stringify(data));
  })
  .catch(err => {
    console.error(err);
  })
}

function updateTask(subject, id, task) {
  let data = {
    subject: subject,
    taskId: id,
    modifiedOn: new Date(),
    task: task
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
    console.log('Updated task: ', JSON.stringify(data));
  })
  .catch(err => {
    console.error(err);
  })
}

