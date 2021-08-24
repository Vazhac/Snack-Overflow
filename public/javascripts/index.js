global.fetch = require("node-fetch");

window.addEventListener("load", (event) => {
  console.log("hello from javascript!");
  let deleteButton = document.getElementsByClassName("delete")[0];
  let editButton = document.getElementsByClassName("edit")[0];
  let editForm = document.getElementById("editForm");
  let submitButton = document.getElementById("submit");

  deleteButton.addEventListener("click", async (event) => {
    let res = await fetch(`localhost:8080/questions/${deleteButton.id}`, {
      method: "delete",
    });
  });

  editButton.addEventListener("click", async (event) => {
    console.log("edit button event listener is working");
    editForm.style.display = "block";
  });

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let title = editForm.children[0];
    let message = editForm.children[1];

    let res = await fetch(`localhost:8080/questions/${editButton.id}`, {
      method: "put",
      body: { title: title.value, message: message.value },
    });

    editForm.style.display = "none";
  });
});
