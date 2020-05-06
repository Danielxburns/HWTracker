

const cells = document.querySelectorAll('td');
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
})

function handleClick(e) {
  if(e.target.type === 'checkbox') {
    return handleCheckBox();
  } else if (e.target.className === 'text') {
    return edit(e.target);
  } else {
    return add(e.target)
  }
}

function handleCheckBox() {
  // tell the server to update the state of the task
  console.log("...aaand another one's gone, and other one's gone. Another one bites the dust!");
};

function edit(el) {
  let currText = el.dataset.text
  let newText = prompt('Edit Assignment', currText)
  el.dataset.text = newText;
  el.innerHTML = newText;
}

function add(el) {
  const assn = prompt('add an assignment');
  const item = document.createElement("div");
  item.className = "item"
  const box = document.createElement("input");
  box.type = "checkbox";
  box.id = box.id++ || 1;
  const label = document.createElement("label");
  label.for = box.id;
  if(assn) {
    const wrapper = document.createElement('span');
    wrapper.appendChild(document.createTextNode(assn))
    wrapper.className = 'text';
    wrapper.setAttribute('data-text', assn)
    item.appendChild(box);
    item.appendChild(wrapper);
    el.appendChild(item);
  }
};
