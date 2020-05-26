
const dt = new Date();

document.getElementById('week').innerHTML = ` ${startWeek(dt)} - ${endWeek(dt)}`;

document.getElementById('today').innerHTML = getToday(dt);

getTasks(startWeek(dt));

/* ------------- HELPER FUNCS ANCHOR ------------ */

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

const cells = document.querySelectorAll('td');
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    return updateTask(e.target.taskId, e.target.nextSibling.dataset.text, e.target.checked);
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
  item.taskId = Date.now().toString(36) + Math.floor(Math.random() * Math.pow(10, 5)).toString(36);
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
    postNewTask(el.className, el.parentNode.className, item.taskId, assn, box.checked)
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
    console.dir(el);
    updateTask(el.parentNode.taskId, newText, el.previousSibling.checked);
  }
}


/* ------------- SERVER FUNCS ANCHOR ------------ */

function getTasks(start) {
  console.log('inside getTasks startWeek :>> ', start);
  fetch('http://localhost:3000/getTasks', /* {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'weekStart': start })
  } */)
  .then(res => res.json())
  .then(data => {
    console.log(`Got data: ${JSON.stringify(data)}`);
  })
  .catch(err => {
    console.error(JSON.stringify(err));
  })
}

function postNewTask(subject, day, id, task, done) {
  let data = {
    subject: subject,
    day: day,
    taskId: id,
    createdOn: new Date(),
    weekStart: startWeek(new Date()),
    weekEnd: endWeek(new Date()),
    task: task,
    done: done,
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
    taskId: id,
    modifiedOn: new Date(),
    task: task,
    done: done
  };
  console.log('updated data from client:>> ', data);
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

