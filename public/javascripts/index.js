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

  let addEventListenerToDelete = async (deleteButton,type)=> {
    deleteButton.addEventListener("click", async (event) => {
      let id
      if(type === "question"){
        id = Number(deleteButton.id.slice(15))
      } else if (type === "answer"){
        id = Number(deleteButton.id.slice(13))
      } else if (type === "comment"){
        id = Number(deleteButton.id.slice(14))
      }
      await fetch(`http://localhost:8080/${type}s/${id}`, {
        method: "delete",
      });
      if(type === "question") window.location = `http://localhost:8080`
      else {
        let reply = document.querySelector(`#${type}-id${id}`)
        console.log("reply: ",reply)
        reply.remove();
      }
    })
  }

  let addEventListenerToEditButton = async (editButton,type) => {
    editButton.addEventListener("click", async (event) => {
      let form
      let id
      if(type === "comment"){
        form = editCommentForm
        id = Number(editButton.id.slice(12))
      } else if (type === "answer"){
        form = editAnswerForm
        id = Number(editButton.id.slice(11))
      }
     form.style.display = "block"
     form.setAttribute(`${type}Id`,id)
    });
  }

  let addEventListenerToEditSubmit = async (editSubmit,type) => {
  if(editSubmit){
    editSubmit.addEventListener("click",async (event) => {
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
      if(type === "answer"){
        form = editAnswerForm
        message = form.children[0].value
      } else if (type === "comment"){
        form = editCommentForm
        message = form.children[0].value
      } else if (type === "question"){
        form = editForm
        message = form.children[1].value
        title = form.children[0].value
        questionId = Number(editButton.id.slice(13));
      }
      if(questionId){
        res = await fetch(`http://localhost:8080/questions/${questionId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({title,message}),
      });
      }
        res = await fetch(`http://localhost:8080/${type}s/${form.getAttribute(`${type}Id`)}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "put",
        body:JSON.stringify({message})
      });
      res = await res.json()
      if(res.message){
        if(type === "question"){
          document.getElementById("title").innerText = res.title;
          document.getElementById("message").innerText = res.message;
          form.style.display = "none";
        } else {
          document.getElementById(`${type}-id${res.id}`).innerText = res.message;
          form.style.display = "none";
        }
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


  if (answerDeleteButton.length) {
    for (deleteButton of answerDeleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        console.log("THIS SHOULD BE DIFFERENT ANSWER DELETE ID's: ",`${Number(deleteButton.id.slice(13))}`)
        let id = Number(deleteButton.id.slice(13));
        console.log("HERE: ", deleteButton.id)
        let res = await fetch(`http://localhost:8080/answers/${id}`, {
          method: "delete",
        });

        let answer = document.querySelector(`li#answer-id${id}`);
        answer.remove();
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

  let addEventListenerToReplySubmit = async (submitButton,type) => {
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let form
    let message
    let questionId
    let errors = document.getElementById("errors");
    if (errors.innerHTML) {
      errors.innerHTML = "";
    }
    if(type==="comment"){
      form = commentForm
      questionId = Number(commentButton.id.slice(16));
    }
    else{
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
      addEventListenerToEditButton(editButton,type)
      addEventListenerToEditSubmit(form.children[1],type)
      addEventListenerToDelete(deleteButton,type)
    } else {
      for (let error of res) {
        let li = document.createElement("li");
        li.innerText = error;
        errors.append(li);
      }
    }
  })
}

  if (answerEditButton.length) {
    for (editButton of answerEditButton) {
      addEventListenerToEditButton(editButton,"answer")
    }
  }

  if (commentEditButton.length) {
    for (editButton of commentEditButton) {
      addEventListenerToEditButton(editButton,"comment")
    }
  }
  addEventListenerToDelete(deleteButton,"question")
  addEventListenerToEditSubmit(editAnswerSubmit,"answer")
  addEventListenerToEditSubmit(editCommentSubmit,"comment")
  addEventListenerToEditSubmit(editSubmitButton,"question")
  addEventListenerToReplySubmit(answerSubmitButton,"answer")
  addEventListenerToReplySubmit(commentSubmitButton,"comment")
});




// editSubmitButton.addEventListener("click", async (event) => {
  //   event.preventDefault();
  //   let title = editForm.children[0];
  //   let message = editForm.children[1];
  //   let errors = document.getElementById("errors");
  //   if (errors.innerHTML) {
  //     errors.innerHTML = "";
  //   }
  //   let id = Number(editButton.id.slice(13));
  //   let res = await fetch(`http://localhost:8080/questions/${id}`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     method: "PUT",
  //     body: JSON.stringify({ title: title.value, message: message.value }),
  //   });
  //   res = await res.json();
  //   if (res.title) {
  //     document.getElementById("title").innerText = res.title;
  //     document.getElementById("message").innerText = res.message;
  //     editForm.style.display = "none";
  //   } else {
  //     for (let error of res) {
  //       let li = document.createElement("li");
  //       li.innerText = error;
  //       errors.append(li);
  //     }
  //   }
  // });



  // answerSubmitButton.addEventListener("click", async (event) => {
  //   event.preventDefault();
  //   let message = answerForm.children[0];
  //   let errors = document.getElementById("errors");
  //   if (errors.innerHTML) {
  //     errors.innerHTML = "";
  //   }
  //   let id = Number(answerButton.id.slice(15));
  //   let res = await fetch(
  //     `http://localhost:8080/questions/${id}/answers`,
  //     {
  //       method: "post",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         questionId: id,
  //         message: message.value,
  //       }),
  //     }
  //   );
  //   res = await res.json();
  //   if (res.message) {
  //     let li = document.createElement("li");
  //     li.id = `answer-id${res.id}`;
  //     li.innerText = answerForm.children[0].value;
  //     let deleteButton = document.createElement("button");
  //     let editButton = document.createElement("button");
  //     deleteButton.classList.add("delete-answer");
  //     editButton.classList.add("edit-answer");
  //     deleteButton.id = `delete-answer${res.id}`;
  //     editButton.id = `edit-answer${res.id}`;
  //     deleteButton.innerText = "Delete";
  //     editButton.innerText = "Edit";
  //     li.append(deleteButton);
  //     li.append(editButton);
  //     document.querySelector("ul.answers").append(li);
  //     answerForm.style.display = "none";

  //     deleteButton.addEventListener("click", async (event) => {
  //       await fetch(`http://localhost:8080/answers/${res.id}`, {
  //         method: "delete",
  //       });
  //       let answer = document.querySelector(`#answer-id${res.id}`)
  //       console.log(answer)
  //       answer.remove();
  //     })

  //     editButton.addEventListener("click",async event => {
  //       editAnswerForm.style.display = "block"
  //       editAnswerForm.setAttribute('answerId',`${Number(editButton.id.slice(11))}`)
  //       console.log("YEAHH: ",editButton.id,"   ", Number(editButton.id.slice(11)))
  //     })
  //     addEventListenerToEditAnswerForm(editAnswerForm.children[1])
  //   } else {
  //     for (let error of res) {
  //       let li = document.createElement("li");
  //       li.innerText = error;
  //       errors.append(li);
  //     }
  //   }
  // });
