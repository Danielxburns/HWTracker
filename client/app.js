/* const { link } = require("fs"); */

const url = 'https://booooooooom.herokuapp.com';// maybe move this to controller
const cells = document.querySelectorAll('td');
let dayInWeek;

/* ------------- ANCHOR INIT ------------- */

document.getElementById('today').innerHTML = getToday();
getUserData("Thomas");
setWeek(new Date());

cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

/* ------------- ANCHOR MODEL ------------ */

let user = {};
let tasks = [];
let wishlist = []; // do I use this anymore or is it always a property of the user now?  

/* ------------- ANCHOR VIEWS ------------ */

function setWeek(day) {
  document.getElementById('week').innerHTML = ` ${startOfWeek(day)} to ${endOfWeek(day)}`;
  getTasks(startOfWeek(day));
  return dayInWeek = day;
};

function displayUserInfo(user) {
  console.log('indside displayUserInfo - user :>> ', user);
  const html = document.getElementsByTagName('html')[0];
  html.style.backgroundImage = `url(${user.currBg.url})`;
  document.getElementById('points').innerHTML = user.points;
  document.getElementById('user').innerHTML = user.username + "'s";
  user.bgList.forEach(background => addToSelect( 'bg', background));
  user.wishlist.forEach(wish => addToSelect( 'wl', wish))
  document.getElementById('bg').value=user.currBg.name;
  document.getElementById('wl').value=user.currWish.name;
  document.getElementById('wishPic').src=user.currWish.imageURL;
  // set alt to name
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
  const linkToAssmt = document.createElement("a");
  linkToAssmt.innerHTML = "&#x1F517;";
  linkToAssmt.href = task.link;
  if(task) {
    console.log('inside displayTask - task :>> ', task);
    label.appendChild(document.createTextNode(task.task))
    label.className = 'text';
    label.setAttribute('data-text', task.task);
    item.appendChild(checkBox);
    if (task.link) { item.appendChild(linkToAssmt) }
    item.appendChild(label);
    cell.appendChild(item);
  }
};

function addToSelect(selectId, item) {
  const sel = document.getElementById(selectId);
  let opt = document.createElement('option');
  opt.value = item.name;
  opt.text = item.name;
  sel.add(opt);
};

function calcPoints(e) {
  let currPoints = document.getElementById('points').innerHTML;
  e.target.checked ? currPoints++ : currPoints--;
  document.getElementById("points").innerHTML = currPoints
  return currPoints;
}

function changeBg(bgName) {
  user.currBg = user.bgList.filter(bg => bg.name === bgName)[0];
  const html = document.getElementsByTagName('html')[0];
  html.style.backgroundImage = `url(${user.currBg.url})`;
  updateBg(user.currBg)
};

function addBg() {
  const url = prompt("paste url of image here");
  const name = prompt("what would you like to call your new background?");
  const bgObj = { "url": url, "name": name };
  if(url && name) { 
    user.bgList.push(bgObj);
    addToSelect('bg', bgObj);
    document.getElementById('bg').value = name;
    changeBg(name);
    console.log('added background - bgObj :>> ', bgObj);
  };
};
                
function showWish(wishName) {
  user.currWish = user.wishlist.filter(wish => wish.name === wishName)[0];
  document.getElementById('wish-pic').src = user.currWish.imageURL;
  document.getElementById('wish-link').href = user.currWish.itemURL;
  updateWl(user.currWish);
};
function addWish() {
  const itemURL = prompt("paste item address here")
  const imageURL = prompt("paste image address here");
  const name = prompt("what name would you like to give your wish?");
  const wlObj = { "itemURL": itemURL, "imageURL": imageURL, "name": name };
  if(itemURL && name) { 
    user.wishlist.push(wlObj);
    addToSelect('wl', wlObj);
    document.getElementById('wl').value = name;
    showWish(name);
    console.log('added wish! - wlObj :>> ', wlObj);
  };
}
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

/* -------- ANCHOR EVENT HANDLERS  - Controllers ------- */

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    const currPoints = calcPoints(e);
    updatePoints('Thomas', currPoints);
    return updateTask(e.target.parentNode._id, e.target.nextSibling.dataset.text, e.target.checked);
  } else if (e.target.tagName === "a") {

  }
  else if (e.target.className === 'text') {
    return (e.shiftKey) ? remove(e.target) : edit(e.target)
  } else {
    return addNewTask(e.target)
  }
};

function handleBackground() {
  // seems like there should be an easier way to do this
  const bodyStyles = this.getComputedStyle(document.querySelector('body'));
  const url = bodyStyles.backgroundImage.slice(5, -2);
  const file = url.split('/').pop();
  let index = backgrounds.indexOf(file)
  if(index >= backgrounds.length - 1) {
    index = -1
  }
  const nextFile = backgrounds[index + 1]
  const nextURL = url.replace(file, nextFile);
  document.querySelector('body').style.backgroundImage = `url(${nextURL})`;
}

async function addNewTask(el) {
    const assignment = prompt('add an assignment');
    const link = prompt('add link');
    if (assignment) {
      try {
        const newTask = await postNewTask(el.className, el.parentNode.className, assignment, link);
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

function prevWish() {
  let index = user.wishlist.findIndex(wish => wish.name === user.currWish.name);
  if (index === 0) { index = user.wishlist.length};

  showWish(user.wishlist[index -1].name)
}
function nextWish() {
  let index = user.wishlist.findIndex(wish => wish.name === user.currWish.name);
  if (index === user.wishlist.length - 1) { index = -1 };
  showWish(user.wishlist[index + 1].name)
}

/* ------------- ANCHOR SERVER CALLS - Controllers ------------ */

async function getUserData(name) {
  const response = await fetch(`${url}/getUserData/${name}`);
  user = await response.json();
  displayUserInfo(user);
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

async function getBackgrounds() {
  const data = await fetch(`${url}/background`);
  images = await data.json();
  images.forEach(image => {
    backgrounds.push(image);
  })
  // if new POST request to images collection returning the image
}

async function postNewTask(subject, day, task, link) {
  const data = {
    subject: subject,
    day: day,
    createdOn: new Date(),
    weekStart: startOfWeek(new Date()),
    weekEnd: endOfWeek(new Date()),
    task: task,
    link: link,
  };
  const response = await fetch(`${url}/newTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
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
    body: JSON.stringify({'_id': id})
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
    body: JSON.stringify(data)
  })
  .then(res => res.json())
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

function updateBg(bgObj) {
  fetch(`${url}/bg/${user._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bgObj)
  })
  .then(res => res.json())
  .then(res => {
    user.bgList = res.bgList;
  })
  .catch(err => console.error('there was an error updating the background: ', err));
};

function updateWl(wlObj) {
  fetch(`${url}/wl/${user._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(wlObj)
  })
  .then(res => res.json())
  .then(res => {
    user.wishlist = res.wishlist;
  })
  .catch(err => console.error('there was an error updating the wish list: ', err));
}


