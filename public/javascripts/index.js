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

  deleteButton.addEventListener("click", async (event) => {
    let id = Number(deleteButton.id.slice(15))
    let res = await fetch(
      `http://localhost:8080/questions/${id}`,
      {
        method: "delete",
      }
    );

    window.location = `http://localhost:8080`;
  });
  let addEventListenerToEditAnswerForm = async (editAnswerSubmit) => {
  if(editAnswerSubmit){
    editAnswerSubmit.addEventListener("click",async event => {
      event.preventDefault()
      let errors = document.getElementById("errors");
      if (errors.innerHTML) {
        errors.innerHTML = "";
      }
      let message = editAnswerForm.children[0].value
      let res = await fetch(`http://localhost:8080/answers/${editAnswerForm.getAttribute('answerId')}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "put",
        body:JSON.stringify({message})
      });
      res = await res.json()
      if(res.message){
        document.getElementById(`answer-id${res.id}`).innerText = res.message;
        editAnswerForm.style.display = "none";
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
let addEventListenerToEditCommentForm = async (editCommentSubmit) => {
  console.log("EDIT COMMENT SUBMIT",editCommentSubmit)
  if (editCommentSubmit){
    console.log("EDIT COMMENT SUBMIT",editCommentSubmit)
    editCommentSubmit.addEventListener("click",async event => {
      event.preventDefault()
      let errors = document.getElementById("errors");
      if (errors.innerHTML) {
        errors.innerHTML = "";
      }
      let message = editCommentForm.children[0].value
      let res = await fetch(`http://localhost:8080/comments/${editCommentForm.getAttribute('commentId')}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "put",
        body:JSON.stringify({message})
      });
      res = await res.json()
      if(res.message){
        document.getElementById(`comment-id${res.id}`).innerText = res.message;
        editCommentForm.style.display = "none";
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

  if (answerEditButton.length) {
    for (editButton of answerEditButton) {
      editButton.addEventListener("click", async (event) => {
       editAnswerForm.style.display = "block"
       editAnswerForm.setAttribute('answerId',`${Number(editButton.id.slice(12))}`)
       console.log("ANSWER EDIT BUTTON: ",editButton.id.slice(12))
       console.log(editButton.id.slice(12))
       console.log("edit answer form answer id attribute: ", editAnswerForm.getAttribute('answerId'))
      });
    }
  }

  if (answerDeleteButton.length) {
    for (deleteButton of answerDeleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        let id = Number(deleteButton.id.slice(14));
        let res = await fetch(`http://localhost:8080/answers/${id}`, {
          method: "delete",
        });

        let answer = document.querySelector(`li#answer-id${id}`);
        answer.remove();
      });
    }
  }

  if (commentEditButton.length) {
    for (editButton of commentEditButton) {
      editButton.addEventListener("click", async (event) => {
        editCommentForm.style.display = "block"
        editCommentForm.setAttribute('commentId',`${Number(editButton.id.slice(12))}`)
      });
    }
  }



  if (commentDeleteButton.length) {
    for (deleteButton of commentDeleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        let id = Number(deleteButton.id.slice(14));
        let res = await fetch(`http://localhost:8080/comments/${id}`, {
          method: "delete",
        });

        let comment = document.querySelector(`#comment-id${id}`)
        console.log(comment)
        comment.remove();
      });
    }
  }


  commentButton.addEventListener("click", async (event) => {
    commentForm.style.display = "block";
  });

  commentSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let message = commentForm.children[0];
    let errors = document.getElementById("errors");
    if (errors.innerHTML) {
      errors.innerHTML = "";
    }
    let id = Number(commentButton.id.slice(16));
    let res = await fetch(
      `http://localhost:8080/questions/${id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: id,
          message: message.value,
        }),
      }
    );
    res = await res.json();
    if (res.message) {
      let li = document.createElement("li");
      li.id = `comment-id${res.id}`;
      li.innerText = commentForm.children[0].value;
      let deleteButton = document.createElement("button");
      let editButton = document.createElement("button");
      deleteButton.classList.add("delete-answer");
      editButton.classList.add("edit-answer");
      deleteButton.id = `delete-comment${res.id}`;
      editButton.id = `edit-comment${res.id}`;
      deleteButton.innerText = "Delete";
      editButton.innerText = "Edit";
      li.append(deleteButton);
      li.append(editButton);
      document.querySelector("ul.comments").append(li);
      commentForm.style.display = "none";
      deleteButton.addEventListener("click", async (event) => {
        await fetch(`http://localhost:8080/comments/${res.id}`, {
          method: "delete",
        });
        let comment = document.querySelector(`#comment-id${res.id}`)
        console.log(comment)
        comment.remove();
      })
      editButton.addEventListener("click",async event => {
        editCommentForm.style.display = "block"
        editCommentForm.setAttribute('commentId',`${Number(editButton.id.slice(12))}`)
      })
      addEventListenerToEditCommentForm(editCommentForm.children[1])
    } else {
      for (let error of res) {
        let li = document.createElement("li");
        li.innerText = error;
        errors.append(li);
      }
    }
  });

  answerButton.addEventListener("click", async (event) => {
    answerForm.style.display = "block";
  });

  answerSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let message = answerForm.children[0];
    let errors = document.getElementById("errors");
    if (errors.innerHTML) {
      errors.innerHTML = "";
    }
    let id = Number(answerButton.id.slice(15));
    let res = await fetch(
      `http://localhost:8080/questions/${id}/answers`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: id,
          message: message.value,
        }),
      }
    );
    res = await res.json();
    if (res.message) {
      let li = document.createElement("li");
      li.id = `answer-id${res.id}`;
      li.innerText = answerForm.children[0].value;
      let deleteButton = document.createElement("button");
      let editButton = document.createElement("button");
      deleteButton.classList.add("delete-answer");
      editButton.classList.add("edit-answer");
      deleteButton.id = `delete-answer${res.id}`;
      editButton.id = `edit-answer${res.id}`;
      deleteButton.innerText = "Delete";
      editButton.innerText = "Edit";
      li.append(deleteButton);
      li.append(editButton);
      document.querySelector("ul.answers").append(li);
      answerForm.style.display = "none";

      deleteButton.addEventListener("click", async (event) => {
        await fetch(`http://localhost:8080/answers/${res.id}`, {
          method: "delete",
        });
        let answer = document.querySelector(`#answer-id${res.id}`)
        console.log(answer)
        answer.remove();
      })

      editButton.addEventListener("click",async event => {
        editAnswerForm.style.display = "block"
        editAnswerForm.setAttribute('answerId',`${Number(editButton.id.slice(11))}`)
        console.log("YEAHH: ",editButton.id,"   ", Number(editButton.id.slice(11)))
      })
      addEventListenerToEditAnswerForm(editAnswerForm.children[1])
    } else {
      for (let error of res) {
        let li = document.createElement("li");
        li.innerText = error;
        errors.append(li);
      }
    }
  });
  editSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let title = editForm.children[0];
    let message = editForm.children[1];
    let errors = document.getElementById("errors");
    if (errors.innerHTML) {
      errors.innerHTML = "";
    }
    let id = Number(editButton.id.slice(13));
    let res = await fetch(`http://localhost:8080/questions/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ title: title.value, message: message.value }),
    });
    res = await res.json();
    if (res.title) {
      document.getElementById("title").innerText = res.title;
      document.getElementById("message").innerText = res.message;
      editForm.style.display = "none";
    } else {
      for (let error of res) {
        let li = document.createElement("li");
        li.innerText = error;
        errors.append(li);
      }
    }
  });
  addEventListenerToEditAnswerForm(editAnswerSubmit)
addEventListenerToEditCommentForm(editCommentSubmit)
});
