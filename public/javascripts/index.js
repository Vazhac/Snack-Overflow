window.addEventListener("load", (event) => {
  let deleteButton = document.querySelector(".delete-question");
  let editButton = document.querySelector(".edit-question-button");
  let answerButton = document.querySelector(".answer-question");
  let commentButton = document.querySelector(".comment-question");
  let editForm = document.getElementById("edit-form");
  let answerForm = document.getElementById("answer-form");
  let commentForm = document.getElementById("comment-form");
  let answerCommentForm = document.getElementById("answer-comment-form")
  let answerCommentSubmitButton = document.getElementById("answer-comment-submit")
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
  let questionUpvoteButton = document.querySelector(".upvote-question")
  let questionDownvoteButton = document.querySelector(".downvote-question")
  let answerUpvoteButtons = document.getElementsByClassName("upvote-answer")
  let answerDownvoteButtons = document.getElementsByClassName("downvote-answer")
  let answerCommentButtons = document.getElementsByClassName("comment-answer")


  let addEventListenerToVoteButton = async (voteButton,type,voteType) => {
    if(voteButton){
      voteButton.addEventListener("click",async (event)=> {
        let scoreChange
        if (voteType === "upvote")scoreChange = 1
        else if (voteType === "downvote")scoreChange = -1
          let id = Number(voteButton.id.split("-")[2])
          await fetch(`/${type}s/${id}/${voteType}s`,{
            method:"POST"
          })
          let voteCount = document.getElementById(`${type}-vote-count-${id}`)
          voteCount.innerText = Number(voteCount.innerText)+scoreChange
          voteButton.style.display = "none"
          if(voteType === "upvote"){
            document.getElementById(`downvote-${type}-${id}`).style.display="none"
          } else {
            document.getElementById(`upvote-${type}-${id}`).style.display="none"
          }
      })
    }
  }
  if (editButton) {
    editButton.addEventListener("click", async (event) => {
      editForm.style.display = "block";
    });
  }
  
  answerButton.addEventListener("click", async (event) => {
    answerForm.style.display = "block";
  });

  let addEventListenerToDelete = async (deleteButton,type)=> {
    if (deleteButton) {
      deleteButton.addEventListener("click", async (event) => {
        let id = Number(deleteButton.id.split("-")[2])
        await fetch(`/${type}s/${id}`, {
          method: "delete",
        });
        if(type === "question") window.location = `/`
        else {
          let reply = document.querySelector(`#${type}-${id}`)
          reply.remove();
        }
      })
    }
  }

  let addEventListenerToEditButton = async (editButton,type) => {
    editButton.addEventListener("click", async (event) => {
      let form
      let id = Number(editButton.id.split("-")[2])
      if(type === "comment"){
        form = editCommentForm
      } else if (type === "answer"){
        form = editAnswerForm
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
        questionId = Number(editButton.id.split("-")[2]);
      }
      if(questionId){
        res = await fetch(`/questions/${questionId}`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({title,message}),
      });
      }
      else{
        res = await fetch(`/${type}s/${form.getAttribute(`${type}Id`)}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "put",
        body:JSON.stringify({message})
      });
    }
      res = await res.json()
      if(res.message){
        if(type === "question"){
          document.getElementById("title").innerText = res.title;
          document.getElementById("message").innerText = res.message;
          form.style.display = "none";
        } else {
          document.getElementById(`${type}-message-${res.id}`).innerText = res.message;
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
  let addEventListenerToCommentButton = async (commentButton,type) => {
    commentButton.addEventListener("click", async (event) => {
        if(type === "question"){
          commentForm.style.display = "block";
        } else if (type === "answer"){
          answerCommentForm.style.display = "block"
          let id = Number(commentButton.id.split("-")[2])
          answerCommentForm.setAttribute("answerId",id)
        }
    });
  }

  let addEventListenerToReplySubmit = async (submitButton,type) => {
  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    let answerId = answerCommentForm.getAttribute("answerId")
    let form
    let message
    let res
    let errors = document.getElementById("errors");
    if (errors.innerHTML) {
      errors.innerHTML = "";
    }
    if(answerId){
      form = answerCommentForm
    }
    else if (type === "answer"){
      form = answerForm
    }
    else if(type==="comment"){
      form = commentForm
    }
    message = form.children[0].value
    console.log("answerId: ",answerId)
    if(!answerId){
      let questionId = Number(answerButton.id.split("-")[2])
      res = await fetch(
        `/questions/${questionId}/${type}s`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message
          }),
        });
    } else {
      res = await fetch(
        `/answers/${answerId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message
          }),
        });
    }
    console.log(submitButton,type,answerId)
    console.log("form: ",form)
    res = await res.json();
    if (res.message) {
      let li = document.createElement("li");
      li.id = `${type}-${res.id}`;
      let author = document.createElement("div")
      author.id=`${type}-author-${res.id}`
      author.innerText=res.author
      let message = document.createElement("div")
      message.id = `${type}-message-${res.id}`
      message.innerText = res.message
      li.append(author)
      li.append(message)
      if(type === "answer"){
        let answerVoteCount = document.createElement("div")
        answerVoteCount.id = `answer-vote-count-${res.id}`
        answerVoteCount.innerText = 0
        answerVoteCount.classList.add("answer-vote-count")
        let upvoteButton = document.createElement("button")
        upvoteButton.classList.add(`upvote-answer`)
        upvoteButton.id = `upvote-answer-${res.id}`
        upvoteButton.innerText = "Upvote"
        let downvoteButton = document.createElement("button")
        downvoteButton.classList.add(`downvote-answer`)
        downvoteButton.id = `downvote-answer-${res.id}`
        downvoteButton.innerText = "Downvote"
        let commentButton = document.createElement("button")
        commentButton.id=`comment-answer-${res.id}`
        commentButton.classList.add("comment-answer")
        commentButton.innerText = "Comment"
        li.append(answerVoteCount)
        li.append(commentButton)
        li.append(upvoteButton)
        li.append(downvoteButton)
        addEventListenerToVoteButton(upvoteButton,"answer","upvote")
        addEventListenerToVoteButton(downvoteButton,"answer","downvote")
        addEventListenerToCommentButton(commentButton,"answer")
        addEventListenerToReplySubmit(answerCommentSubmitButton,"comment")
      }
      let deleteButton = document.createElement("button");
      deleteButton.classList.add(`delete-${type}`);
      deleteButton.id = `delete-${type}-${res.id}`;
      deleteButton.innerText = "Delete";
      let editButton = document.createElement("button");
      editButton.classList.add(`edit-${type}`);
      editButton.id = `edit-${type}-${res.id}`;
      editButton.innerText = "Edit";
      li.append(deleteButton);
      li.append(editButton);
      let ul
      if(!answerId){
        ul = document.querySelector(`ul.${type}s`);
      } else {
        ul = document.getElementById(`answer-comments-${answerId}`)
        if(!ul){
          ul = document.createElement("ul")
          ul.id = `answer-comments-${answerId}`
          ul.classList.add("answer-comments")
          document.getElementById(`answer-${answerId}`).append(ul)
        }
      }
      console.log("form second: ", form, ul)
      ul.append(li)
      form.style.display = "none";
      if(form.id === "answer-comment-form")form.setAttribute("answerId",null)
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

if (commentDeleteButton.length) {
  for (let deleteButton of commentDeleteButton) {
    addEventListenerToDelete(deleteButton,"comment")
  }
}

if (answerDeleteButton.length) {
  for (let deleteButton of answerDeleteButton) {
    addEventListenerToDelete(deleteButton,"answer")
  }
}

  if (answerEditButton.length) {
    for (let editButton of answerEditButton) {
      addEventListenerToEditButton(editButton,"answer")
    }
  }

  if (commentEditButton.length) {
    for (let editButton of commentEditButton) {
      addEventListenerToEditButton(editButton,"comment")
    }
  }

  if(answerUpvoteButtons.length){
    for(let answerUpvoteButton of answerUpvoteButtons){
      addEventListenerToVoteButton(answerUpvoteButton,"answer","upvote")
    }
  }

  if(answerDownvoteButtons.length){
    for(let answerDownvoteButton of answerDownvoteButtons){
      addEventListenerToVoteButton(answerDownvoteButton,"answer","downvote")
    }
  }
  if(answerCommentButtons.length){
    for(let answerCommentButton of answerCommentButtons){
      addEventListenerToCommentButton(answerCommentButton,"answer")
    }
  }
  addEventListenerToCommentButton(commentButton,"question")
  addEventListenerToReplySubmit(answerCommentSubmitButton,"comment")
  addEventListenerToVoteButton(questionUpvoteButton,"question","upvote")
  addEventListenerToVoteButton(questionDownvoteButton,"question","downvote")
  addEventListenerToDelete(deleteButton,"question")
  addEventListenerToEditSubmit(editAnswerSubmit,"answer")
  addEventListenerToEditSubmit(editCommentSubmit,"comment")
  addEventListenerToEditSubmit(editSubmitButton,"question")
  addEventListenerToReplySubmit(answerSubmitButton,"answer")
  addEventListenerToReplySubmit(commentSubmitButton,"comment")
});
