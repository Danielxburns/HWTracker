
const today = new Date();
const day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][today.getDay()]
document.getElementById('today').innerHTML = `${day} ${today.toLocaleDateString()}`;

const cells = document.querySelectorAll('td');
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
})

// EVENT HANDLERS

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    return handleCheckBox(e.target);
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
    postNewTask(assn)
  }
  console.dir(item.children[0]);
};

function handleCheckBox(el) {
  console.dir(el);
  toggleDone(el.taskId)
  console.log("...aaand another one's gone, and other one's gone. Another one bites the dust!");
};

function remove(el) {
  let sure = confirm(`Are you sure you want to delete \n ${el.innerHTML}?`)
  if (sure) { 
    deleteTask(el.children[0].taskId)
    el.parentNode.remove();
  }
}

function edit(el) {
  let currText = el.dataset.text
  let newText = prompt('Edit Assignment', currText)
  if (newText) {
    el.dataset.text = newText;
    el.innerHTML = newText;
    updateTask(el);
  }
}


// SERVER FUNCS

function postNewTask(task) {
  let data = {task: task};
  fetch('http://localhost:3000/newTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => {
      console.log('Success: ', data);
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
    body: JSON.stringify(id),
  })
  .then(res => res.json())
  .then(data => {
    console.log('Deleted: ', data);
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
    body: JSON.stringify(id),
  })
  .then(res => res.json())
  .then(data => {
    console.log('Toggled done: ', data);
  })
  .catch(err => {
    console.error(err);
  })
}

function updateTask(el) {

}