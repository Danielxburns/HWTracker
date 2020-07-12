
const url = 'http://localhost:3000';
const cells = document.querySelectorAll('td');
const changeWeekButtons = document.querySelectorAll('.change-week-button')
let dayInWeek;
const user = {
  username: "Thomas",
  bgList: {
    bunnies: '/images/bunny.png',
    bricks: '/images/bricks.jpg',
    cave_painting: '/images/cave_painting.jpg',
    burnt_wood: '/images/burnt_wood.jpg',
    kealing: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/787c7134862611.56f1bac606f4f.png'
  }
}

/* ------------- ANCHOR UTILS ------------ */

function getToday() {
  const now = new Date();
  const dayOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][now.getDay()];
  const dateString = now.toDateString();
  return `${dayOfWeek} ${dateString.substring(3, dateString.length - 5)}, ${now.getFullYear()}`;
};

function setWeek(day) {
  document.getElementById('week').innerHTML = ` ${startOfWeek(day)} to ${endOfWeek(day)}`;
  getTasks(startOfWeek(day));
  return dayInWeek = day;
};

function startOfWeek(day) {
  let clone = new Date(day);
  const diff = clone.getDate() - clone.getDay() + (clone.getDay()? -6 : 0);
  return new Date(clone.setDate(diff)).toLocaleDateString();
};

function endOfWeek(day) {
  let clone = new Date(day);
  const diff = clone.getDate() - clone.getDay() + (clone.getDay()? 0 : 6);
  return new Date(clone.setDate(diff)).toLocaleDateString();
};

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

/* -------- ANCHOR EVENT HANDLERS -------- */

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    let points = document.getElementById('points')
    e.target.checked ? points.innerHTML++ : points.innerHTML--
    updatePoints('Thomas', points.innerHTML)
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

function changeWeek(direction) {
  console.log('inside changeWeek direction :>> ', direction);
  console.log('inside changeWeek - dayInWeek :>> ', dayInWeek);
  if (direction === "weekPrev") {
    dayInWeek = new Date(dayInWeek.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (direction === "weekNext") {
    dayInWeek = new Date(dayInWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
  }
  console.log('inside changeWeek - dayInWeek :>> ', dayInWeek);
  setWeek(dayInWeek);
};

function changeBg(name) {
  const image = user.bgList[name]
  console.log(image);
  const body = document.getElementsByTagName('body')[0];
  body.style.backgroundImage = `url(${image})`;
};

/* ------------- ANCHOR SERVER CALLS ------------ */

function getTasks(day) {
  const weekBegin = day.replace(/\//g, "-");
  fetch(`${url}/getTasks/${weekBegin}`, {mode: 'cors'})
  .then(res => res.json())
  .then(data => {
    populateCells(data);
  })
  .catch(err => {
    console.error(JSON.stringify(err)); // TODO handle gracefully 
  })
};

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
  const taskData = await response.json();
  console.log('Success! Posted to database: ', taskData);
  return taskData;
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
/*   .then(data => {
    console.log('Updated task: ', JSON.stringify(data.task));
  }) */
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

cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});


document.getElementById('today').innerHTML = getToday();
setWeek(new Date());

