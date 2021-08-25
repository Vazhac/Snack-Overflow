window.addEventListener("load", (event) => {
  console.log("hello from javascript!");
  let deleteButton = document.getElementsByClassName("delete")[0];
  let editButton = document.getElementsByClassName("edit")[0];
  let answerButton = document.getElementsByClassName("answer")[0];
  let commentButton = document.getElementsByClassName("comment")[0];
  let editForm = document.getElementById("editForm");
  let answerForm = document.getElementById("answerForm");
  let commentForm = document.getElementById("commentForm");
  let editSubmitButton = document.getElementById("edit-submit");
  let answerSubmitButton = document.getElementById("answer-submit");
  let commentSubmitButton = document.getElementById("comment-submit");
  let answerEditButton = document.getElementsByClassName("editAnswer")[0];
  let answerDeleteButton = document.getElementsByClassName("deleteAnswer")[0];
  let commentEditButton = document.getElementsByClassName("editComment")[0];
  let commentDeleteButton = document.getElementsByClassName("deleteComment")[0];

  if (answerEditButton) {
    answerEditButton.addEventListener("click", async (event) => {
      editForm.style.display = "block";
    });
  }

  if (answerDeleteButton) {
    answerDeleteButton.addEventListener("click", async (event) => {
      let res = await fetch(`/answers/${answerDeleteButton.id}`, {
        method: "delete",
      });

      let answer = document.querySelector(`li.${answerDeleteButton.id}`);
      answer.remove();
    });
  }

  if (commentEditButton) {
    commentEditButton.addEventListener("click", async (event) => {
      editForm.style.display = "block";
    });
  }

  if (commentDeleteButton) {
    commentDeleteButton.addEventListener("click", async (event) => {
      let res = await fetch(`/answers/${commentDeleteButton.id}`, {
        method: "delete",
      });

      let comment = document.querySelector(`li.${commentDeleteButton.id}`);
      comment.remove();
    });
  }

  deleteButton.addEventListener("click", async (event) => {
    let res = await fetch(
      `http://localhost:8080/questions/${deleteButton.id}`,
      {
        method: "delete",
      }
    );

    window.location = `http://localhost:8080`;
  });

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
      li.innerText = commentForm.children[0].value;
      document.querySelector("ul.comments").append(li);
      commentForm.style.display = "none";
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
      li.innerText = answerForm.children[0].value;
      document.querySelector("ul.answers").append(li);
      answerForm.style.display = "none";
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
