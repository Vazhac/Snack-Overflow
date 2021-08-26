window.addEventListener("load", (event) => {
  console.log("hello from javascript!");
  let deleteButton = document.getElementsByClassName("delete-question")[0];
  let editButton = document.getElementsByClassName("edit-question-button")[0];
  let answerButton = document.getElementsByClassName("answer-question")[0];
  let commentButton = document.getElementsByClassName("comment-question")[0];
  let editForm = document.getElementById("edit-form");
  let answerForm = document.getElementById("answer-form");
  let commentForm = document.getElementById("comment-form");
  let editSubmitButton = document.getElementById("edit-submit");
  let answerSubmitButton = document.getElementById("answer-submit");
  let commentSubmitButton = document.getElementById("comment-submit");
  let answerEditButton = document.getElementsByClassName("edit-answer");
  let answerDeleteButton = document.getElementsByClassName("delete-answer");
  let commentEditButton = document.getElementsByClassName("edit-comment");
  let commentDeleteButton = document.getElementsByClassName("delete-comment");
  let editCommentForm = document.querySelector("#edit-comment-form")
  let editAnswerForm = document.querySelector("#edit-answer-form")
  let editAnswerSubmit = document.querySelector("#edit-answer-submit")
  let editCommentSubmit = document.querySelector("#edit-comment-submit")


  editButton.addEventListener("click", async (event) => {
    editForm.style.display = "block";
  });

  answerButton.addEventListener("click", async (event) => {
    answerForm.style.display = "block";
  });

  let addEventListenerToDelete = async (deleteButton, type) => {
    deleteButton.addEventListener("click", async (event) => {
      let id
      if (type === "question") {
        id = Number(deleteButton.id.slice(15))
      } else if (type === "answer") {
        id = Number(deleteButton.id.slice(13))
      } else if (type === "comment") {
        id = Number(deleteButton.id.slice(14))
      }
      await fetch(`http://localhost:8080/${type}s/${id}`, {
        method: "delete",
      });
      if (type === "question") {
        window.location = `http://localhost:8080`
      }
      else {
        let reply = document.querySelector(`#${type}-id${id}`)
        console.log("reply: ", reply)
        reply.remove();
      }
    })
  }

  let addEventListenerToEditButton = async (editButton, type) => {
    editButton.addEventListener("click", async (event) => {
      let form
      let id
      if (type === "comment") {
        form = editCommentForm
        id = Number(editButton.id.slice(12))
      } else if (type === "answer") {
        form = editAnswerForm
        id = Number(editButton.id.slice(11))
      }
      form.style.display = "block"
      form.setAttribute(`${type}Id`, id)
    });
  }

  let addEventListenerToEditSubmit = async (editSubmit, type) => {
    if (editSubmit) {
      editSubmit.addEventListener("click", async (event) => {
        event.preventDefault()
        let errors = document.getElementById("errors");
        if (errors.innerHTML) {
          errors.innerHTML = "";
        }
        let questionId
        let form
        let message
        let title
        let res
        if (type === "answer") {
          form = editAnswerForm
          message = form.children[0].value
        } else if (type === "comment") {
          form = editCommentForm
          message = form.children[0].value
        } else if (type === "question") {
          form = editForm
          message = form.children[1].value
          title = form.children[0].value
          questionId = Number(editButton.id.slice(13));
        }
        if (questionId) {
          res = await fetch(`http://localhost:8080/questions/${questionId}`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify({ title, message }),
          });
        }
        let res = await fetch(`http://localhost:8080/${type}s/${form.getAttribute(`${type}Id`)}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({ title, message }),
        });
      }
        res = await fetch(`http://localhost:8080/${type}s/${form.getAttribute(`${type}Id`)}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "put",
        body: JSON.stringify({ message })
      });
      res = await res.json()
      if (res.message) {
        if (type === "question") {
          document.getElementById("title").innerText = res.title;
          document.getElementById("message").innerText = res.message;
          form.style.display = "none";
        } else {
          for (let error of res) {
            let li = document.createElement("li");
            li.innerText = error;
            errors.append(li);
          }
        }
      })
    }
  }

commentButton.addEventListener("click", async (event) => {
  commentForm.style.display = "block";
});

let addEventListenerToReplySubmit = async (submitButton, type) => {
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let form
    let message
    let questionId
    let errors = document.getElementById("errors");
    if (errors.innerHTML) {
      errors.innerHTML = "";
    }
    if (type === "comment") {
      form = commentForm
      questionId = Number(commentButton.id.slice(16));
    }
    else {
      form = answerForm
      questionId = Number(answerButton.id.slice(15))
    }
    message = form.children[0].value
    let res = await fetch(
      `http://localhost:8080/questions/${questionId}/${type}s`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          message
        }),
      });
    res = await res.json();
    if (res.message) {
      let li = document.createElement("li");
      li.id = `${type}-id${res.id}`;
      li.innerText = form.children[0].value;
      let deleteButton = document.createElement("button");
      let editButton = document.createElement("button");
      deleteButton.classList.add(`delete-${type}`);
      editButton.classList.add(`edit-${type}`);
      deleteButton.id = `delete-${type}${res.id}`;
      editButton.id = `edit-${type}${res.id}`;
      deleteButton.innerText = "Delete";
      editButton.innerText = "Edit";
      li.append(deleteButton);
      li.append(editButton);
      document.querySelector(`ul.${type}s`).append(li);
      form.style.display = "none";
      addEventListenerToEditButton(editButton, type)
      addEventListenerToEditSubmit(form.children[1], type)
      addEventListenerToDelete(deleteButton, type)
    } else {
      for (let error of res) {
        let li = document.createElement("li");
        li.innerText = error;
        errors.append(li);
      }
    }
  })
}

if (commentDeleteButton.length) {
  for (let deleteButton of commentDeleteButton) {
    addEventListenerToDelete(deleteButton, "comment")
  }
}

if (answerDeleteButton.length) {
  for (let deleteButton of answerDeleteButton) {
    addEventListenerToDelete(deleteButton, "answer")
  }
}

if (answerEditButton.length) {
  for (let editButton of answerEditButton) {
    addEventListenerToEditButton(editButton, "answer")
  }
}

if (commentEditButton.length) {
  for (let editButton of commentEditButton) {
    addEventListenerToEditButton(editButton, "comment")
  }
}

addEventListenerToDelete(deleteButton, "question")
addEventListenerToEditSubmit(editAnswerSubmit, "answer")
addEventListenerToEditSubmit(editCommentSubmit, "comment")
addEventListenerToEditSubmit(editSubmitButton, "question")
addEventListenerToReplySubmit(answerSubmitButton, "answer")
addEventListenerToReplySubmit(commentSubmitButton, "comment")
});
