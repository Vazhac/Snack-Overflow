window.addEventListener("load", (event) => {
  console.log("hello from javascript!");
  let deleteButton = document.getElementsByClassName("delete")[0];
  let editButton = document.getElementsByClassName("edit")[0];
  let editForm = document.getElementById("editForm");
  let submitButton = document.getElementById("submit");

  deleteButton.addEventListener("click", async (event) => {
    let res = await fetch(`http://localhost:8080/questions/${deleteButton.id}`, {
      method: "delete",
    });
    window.location = 'http://localhost:8080';
  });

  editButton.addEventListener("click", async (event) => {
    console.log("edit button event listener is working");
    editForm.style.display = "block";
  });

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let title = editForm.children[0];
    let message = editForm.children[1];
    let errors = document.getElementById("errors");
    if (errors.innerText) {
        errors.innerText= "";
    }
    let res = await fetch(`http://localhost:8080/questions/${editButton.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: "PUT",
      body: JSON.stringify({ title: title.value, message: message.value }),
    });
    res = await res.json()
    if (res.title){
        document.getElementById("title").innerText = res.title
        document.getElementById("message").innerText = res.message
        editForm.style.display = "none";
    } else {

       for (let error of res){
           let li = document.createElement("li")
           li.innerText = error;
           errors.append(li);
       }
    }

  });
});
