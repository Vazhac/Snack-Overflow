window.addEventListener("load", (event) => {
  console.log("hello from javascript!");
  let deleteButton = document.getElementsByClassName("deleteQuestion")[0];
  let editButton = document.getElementsByClassName("editQuestion")[0];
  let answerButton = document.getElementsByClassName("answerQuestion")[0];
  let commentButton = document.getElementsByClassName("commentQuestion")[0];
  let editForm = document.getElementById("editForm");
  let answerForm = document.getElementById("answerForm");
  let commentForm = document.getElementById("commentForm");
  let editSubmitButton = document.getElementById("edit-submit");
  let answerSubmitButton = document.getElementById("answer-submit");
  let commentSubmitButton = document.getElementById("comment-submit");
  let answerEditButton = document.getElementsByClassName("editAnswer");
  let answerDeleteButton = document.getElementsByClassName("deleteAnswer");
  let commentEditButton = document.getElementsByClassName("editComment");
  let commentDeleteButton = document.getElementsByClassName("deleteComment");

  deleteButton.addEventListener("click", async (event) => {
    let res = await fetch(
      `http://localhost:8080/questions/${deleteButton.id}`,
      {
        method: "delete",
      }
    );

    window.location = `http://localhost:8080`;
  });

  if (answerEditButton.length) {
    for (editButton of answerEditButton) {
      editButton.addEventListener("click", async (event) => {});
    }
  }

  if (answerDeleteButton.length) {
    for (deleteButton of answerDeleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        let res = await fetch(`http://localhost:8080/answers/${deleteButton.id}`, {
          method: "delete",
        });

        let answer = document.querySelector(`ul.answers>li#${deleteButton.id}`);
        answer.remove();
      });
    }
  }

  if (commentEditButton.length) {
    for (editButton of commentEditButton) {
      editButton.addEventListener("click", async (event) => {});
    }
  }

  if (commentDeleteButton.length) {
    for (deleteButton of commentDeleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        let res = await fetch(`http://localhost:8080/comments/${deleteButton.id}`, {
          method: "delete",
        });

        let comment = document.querySelector(`ul.comments>li#${deleteButton.id}`);
        comment.remove();
      });
    }
  }



  editButton.addEventListener("click", async (event) => {
    editForm.style.display = "block";
  });

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
    let res = await fetch(
      `http://localhost:8080/questions/${commentButton.id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: commentButton.id,
          message: message.value,
        }),
      }
    );
    res = await res.json();
    if (res.message) {
      let li = document.createElement("li");
      li.id = res.id;
      li.innerText = commentForm.children[0].value;
      let deleteButton = document.createElement("button");
      let editButton = document.createElement("button");
      deleteButton.classList.add("deleteAnswer");
      editButton.classList.add("editAnswer");
      deleteButton.id = res.id;
      editButton.id = res.id;
      deleteButton.innerText = "Delete";
      editButton.innerText = "Edit";
      li.append(deleteButton);
      li.append(editButton);
      document.querySelector("ul.comments").append(li);
      commentForm.style.display = "none";

      deleteButton.addEventListener("click", async (event) => {
        let res = await fetch(`http://localhost:8080/comments/${deleteButton.id}`, {
          method: "delete",
        });

        let comment = document.querySelector(`ul.comments>li#${deleteButton.id}`);
        comment.remove();
      })
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
    let res = await fetch(
      `http://localhost:8080/questions/${answerButton.id}/answers`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: answerButton.id,
          message: message.value,
        }),
      }
    );
    res = await res.json();
    if (res.message) {
      let li = document.createElement("li");
      li.id = res.id;
      li.innerText = answerForm.children[0].value;
      let deleteButton = document.createElement("button");
      let editButton = document.createElement("button");
      deleteButton.classList.add("deleteAnswer");
      editButton.classList.add("editAnswer");
      deleteButton.id = res.id;
      editButton.id = res.id;
      deleteButton.innerText = "Delete";
      editButton.innerText = "Edit";
      li.append(deleteButton);
      li.append(editButton);
      document.querySelector("ul.answers").append(li);
      answerForm.style.display = "none";

      deleteButton.addEventListener("click", async (event) => {
        let res = await fetch(`http://localhost:8080/answers/${deleteButton.id}`, {
          method: "delete",
        });

        let answer = document.querySelector(`ul.answers>li#${deleteButton.id}`);
        answer.remove();
      })

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
    let res = await fetch(`http://localhost:8080/questions/${editButton.id}`, {
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
});
