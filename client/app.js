
const url = 'http://localhost:3000';
const cells = document.querySelectorAll('td');
const changeWeekButtons = document.querySelectorAll('.change-week-button')
let dayInWeek;

/* ------------- ANCHOR MODEL ------------ */

let user = {};
let tasks = [];

/* ------------- ANCHOR VIEWS ------------ */

function setWeek(day) {
  document.getElementById('week').innerHTML = ` ${startOfWeek(day)} to ${endOfWeek(day)}`;
  getTasks(startOfWeek(day));
  return dayInWeek = day;
};

function displayUser(user) {
  const html = document.getElementsByTagName('html')[0];
  html.style.backgroundImage = `url(${user.currBg})`;
  document.getElementById('points').innerHTML = user.points;
  document.getElementById('user').innerHTML = user.username + "'s";
}
function populateCells(tasks) {
  cells.forEach(cell => {
    cell.innerHTML = '';
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
  label.for = checkBox;
  if(task) {
    label.appendChild(document.createTextNode(task.task))
    label.className = 'text';
    label.setAttribute('data-text', task.task)
    item.appendChild(checkBox);
    item.appendChild(label);
    cell.appendChild(item);
  }
};

function calcPoints(e) {
  let currPoints = document.getElementById('points').innerHTML;
  e.target.checked ? currPoints++ : currPoints--;
  document.getElementById("points").innerHTML = currPoints
  return currPoints;
}

function changeBg(name) {
  const imageURL = user.bgList.filter(bg => bg.name === name )[0].url;
  const html = document.getElementsByTagName('html')[0];
  html.style.backgroundImage = `url(${imageURL})`;
  user.currBg = imageURL;
  updateBg({ name: name, url: imageURL });
};

/* ------------- ANCHOR UTILS - Views ------------ */

function getToday() {
  const now = new Date();
  const dayOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][now.getDay()];
  const dateString = now.toDateString();
  return `${dayOfWeek} ${dateString.substring(3, dateString.length - 5)}, ${now.getFullYear()}`;
};

function startOfWeek(day) {
  let clone = new Date(day);
  const diff = clone.getDate() - clone.getDay();
  return new Date(clone.setDate(diff)).toLocaleDateString();
};

function endOfWeek(day) {
  let clone = new Date(day);
  const diff = clone.getDate() - clone.getDay() + 6;
  return new Date(clone.setDate(diff)).toLocaleDateString();
};

/* -------- ANCHOR EVENT HANDLERS  - Controller ------- */

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    const currPoints = calcPoints(e);
    updatePoints('Thomas', currPoints);
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
        tasks.push(newTask);
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
    const index = tasks.findIndex(task => {
      task._id = el.parentNode._id;
    });
    tasks.splice(index, 1) 
    deleteTask(el.parentNode._id)// update the db with a controller
    el.parentNode.remove(); // MVC ok?
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

function changeWeek(direction) {
  if (direction === "weekPrev") {
    dayInWeek = new Date(dayInWeek.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (direction === "weekNext") {
    dayInWeek = new Date(dayInWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
  }
  setWeek(dayInWeek);
};

/* ------------- ANCHOR SERVER CALLS - Controller ------------ */

async function getUserData(name) {
  const response = await fetch(`${url}/getUserData/${name}`);
  user = await response.json();
  displayUser(user);
/* 
  .catch(err => console.error(err)) */
};

async function getTasks(day) {
  const weekBegin = day.replace(/\//g, "-");
  const response = await fetch(`${url}/getTasks/${weekBegin}`, {mode: 'cors'});
  tasks = await response.json(); // update the model
  populateCells(tasks);
  }/* )
  .catch(err => {
    console.error(JSON.stringify(err)); // TODO handle gracefully 
  })
}; */

async function postNewTask(subject, day, task) {
  let data = {
    subject: subject,
    day: day,
    createdOn: new Date(),
    weekStart: startOfWeek(new Date()),
    weekEnd: endOfWeek(new Date()),
    task: task,
  };
  const response = await fetch(`${url}/newTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  const newTask = await response.json();
  console.log('Success! Posted to database: ', newTask);
  return newTask;
/*     .catch(err => {
      console.error(err);
    }) */
};

function deleteTask(id) {
  fetch(`${url}/deleteTask`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'_id': id}),
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
  })
  .then(res => res.json())
  .then(data => {
    console.log('Updated task: ', JSON.stringify(data.task));
  })
  .catch(err => {
    console.error(err);
  })
};

function updatePoints(username, points) {
  let data = {
    username: username,
    points: points,
    modifiedOn: new Date(),
  };
  fetch(`${url}/updatePoints`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(data => {
    console.log('Updated points: ', JSON.stringify([data.username, data.points]));
  })
  .catch(err => {
    console.error(err);
  })
};

function updateBg(imageObj) {
  fetch(`${url}/bg/${user.username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(imageObj)
  })
  .then(res => res.json())
  .then(data => user = data) // maybe just update user.bgList
  .then(()=> console.log('inside app.updateBg - user :>> ', user))
}

/* ------------- ANCHOR INIT ------------- */

document.getElementById('today').innerHTML = getToday();
getUserData("Thomas");
setWeek(new Date());

cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});
