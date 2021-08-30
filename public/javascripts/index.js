
window.addEventListener("load", async event => {

    let answerButtons = document.getElementsByClassName("answer-button")
    let commentButtons = document.getElementsByClassName("comment-button")
    let editButtons = document.getElementsByClassName("edit-button")
    let deleteButtons = document.getElementsByClassName("delete-button")
    let upvoteButtons = document.getElementsByClassName("upvote-button")
    let downvoteButtons = document.getElementsByClassName("downvote-button")


let createForm = () => {
  let form = document.createElement("form")
  let message = document.createElement("textarea")
  let submit = document.createElement("input")
  form.id = "reply-form"
  form.style.display = "none"
  message.setAttribute("name","message")
  message.setAttribute("placeholder","message")
  submit.id = "reply-submit"
  submit.classList.add("submit")
  submit.setAttribute("type","submit")
  submit.setAttribute("value","submit")
  form.append(message)
  form.append(submit)
  return form
}

let clearSubmitEventListeners = () => {
    let oldQuestionSubmit = document.querySelector("#question-submit")
    let newQuestionSubmit = oldQuestionSubmit.cloneNode(true);
    oldQuestionSubmit.parentNode.replaceChild(newQuestionSubmit, oldQuestionSubmit)
    let replySubmit = document.querySelector("#reply-submit")
    if(replySubmit){
      let oldReplySubmit = document.querySelector("#reply-submit")
      let newReplySubmit = oldReplySubmit.cloneNode(true)
      oldReplySubmit.parentNode.replaceChild(newReplySubmit, oldReplySubmit);
    }
  }

  let removeFormAttributes = (form) => {
    if(form){
      form.removeAttribute("parent-type")
      form.removeAttribute("passed-id")
      form.removeAttribute("type")
      form.removeAttribute("method")
    }
  }

  let clearForms = () => {
    let replyForm = document.getElementById("reply-form")
    if(replyForm)replyForm.remove()
    document.getElementById("question-form").style.display = "none"
    removeFormAttributes(document.querySelector("#reply-form"))
    removeFormAttributes(document.querySelector("#question-form"))
  }

  let setFormAttributes = (form,attributes) => {
    for(let attribute in attributes){
      form.setAttribute(attribute,attributes[attribute])
    }
  }

  let getFormAttributes = (form) => {
    let attributes = {}
    attributes.type=form.getAttribute("type")
    attributes.method=form.getAttribute("method")
    attributes.passedId=form.getAttribute("passed-id")
    attributes.parentType=form.getAttribute("parent-type")
    attributes.passedId = Number(attributes.passedId)
    return attributes
  }

    const createAnswerItem = (type, res) => {
      const postLayout = document.createElement('div');
      postLayout.classList.add('post_layout');
      postLayout.id = `${type}-${res.id}`;

        const upperContainer = document.createElement('div');
          upperContainer.classList.add('upper_container');

          const votesContainer = document.createElement('div');
            votesContainer.classList.add('votes_container');

            const upVoteButton = document.createElement('button');
            upVoteButton.classList.add(`${type}-upvote-button`,"upvote-button");
              upVoteButton.id = `${type}-${res.id}-upvote-button`;
              upVoteButton.innerText = 'Upvote';
              addEventListenerToVoteButton(upVoteButton,"answer","upvote")

            const answerVoteCount = document.createElement('div');
            answerVoteCount.classList.add(`${type}-vote-count`);
              answerVoteCount.id = `${type}-${res.id}-vote-count`;
              answerVoteCount.innerText = 0;

            const downVoteButton = document.createElement('button');
              downVoteButton.classList.add(`${type}-downvote-button`,"downvote-button")
              downVoteButton.id = `${type}-${res.id}-downvote-button`;
              downVoteButton.innerText = 'Downvote';
              addEventListenerToVoteButton(downVoteButton,"answer","downvote")

          votesContainer.appendChild(upVoteButton);
          votesContainer.appendChild(answerVoteCount);
          votesContainer.appendChild(downVoteButton);

          const messageContainer = document.createElement('div');
            messageContainer.classList.add('message_container');

            const author = document.createElement('p');
              author.id=`${type}-${res.id}-author`
              author.innerText=res.author

            const message = document.createElement('p');
              message.id = `${type}-${res.id}-message`
              message.innerText = res.message

          messageContainer.appendChild(author);
          messageContainer.appendChild(message);

        upperContainer.appendChild(votesContainer);
        upperContainer.appendChild(messageContainer);

      postLayout.appendChild(upperContainer);

        const commentsContainer = document.createElement('div');
          commentsContainer.classList.add('comments_container');
          commentsContainer.id = `${type}-${res.id}-comments`;

          const comment = document.createElement('div');
            comment.classList.add('comment');

          const postButtons = document.createElement('div');
            postButtons.classList.add('post_buttons');

            const commentButton = document.createElement("button")
              commentButton.classList.add(`${type}-comment-button`,"comment-button")
              commentButton.id=`${type}-${res.id}-comment-button`
              commentButton.innerText = "Comment";
              addEventListenerToReplyButton(commentButton, "comment", "answer");

            const deleteButton = document.createElement("button");
              deleteButton.classList.add(`${type}-delete-button`,"delete-button");
              deleteButton.id = `${type}-${res.id}-delete-button`;
              deleteButton.innerText = "Delete";
              addEventListenerToDeleteButton(deleteButton,type)

            const editButton = document.createElement("button");
              editButton.classList.add(`${type}-edit-button`,"edit-button");
              editButton.id = `${type}-${res.id}-edit-button`;
              editButton.innerText = "Edit";
              addEventListenerToEditButton(editButton, type);

          postButtons.appendChild(commentButton);
          postButtons.appendChild(deleteButton);
          postButtons.appendChild(editButton);

        commentsContainer.appendChild(comment);
        commentsContainer.appendChild(postButtons);

      postLayout.appendChild(commentsContainer);
      return postLayout;
    };

    const createComment = (type, res) => {
      const comment = document.createElement('div');
      comment.classList.add('comment');
      comment.id = `${type}-${res.id}`;

        const author = document.createElement('span');
          author.id = `comment-${res.id}-author`;
          author.innerText = res.author;

        const message = document.createElement('span');
          message.id = `comment-${res.id}-message`;
          message.innerText = res.message;

        const deleteButton = document.createElement("button");
          deleteButton.classList.add(`${type}-delete-button`,"delete-button");
          deleteButton.id = `${type}-${res.id}-delete-button`;
          deleteButton.innerText = "Delete";
          addEventListenerToDeleteButton(deleteButton,type);

        const editButton = document.createElement("button");
          editButton.classList.add(`${type}-edit-button`,"edit-button");
          editButton.id = `${type}-${res.id}-edit-button`;
          editButton.innerText = "Edit";
          addEventListenerToEditButton(editButton, type);


      comment.appendChild(author);
      comment.appendChild(message);
      comment.appendChild(deleteButton);
      comment.appendChild(editButton);

      return comment;
    };

    let createListItem = (type,res) => {
        let li = document.createElement("li");
        li.id = `${type}-${res.id}`;
        let author = document.createElement("div")
        author.id=`${type}-${res.id}-author`
        author.innerText=res.author
        let message = document.createElement("div")
        message.id = `${type}-${res.id}-message`
        message.innerText = res.message
        li.append(author)
        li.append(message)
        return li
    }

    let addAnswerFunctionality = (li,type,res) => {
        let answerVoteCount = document.createElement("div")
        answerVoteCount.id = `${type}-${res.id}-vote-count`
        answerVoteCount.innerText = 0
        answerVoteCount.classList.add(`${type}-vote-count`)
        let upvoteButton = document.createElement("button")
        upvoteButton.classList.add(`${type}-upvote-button`,"upvote-button")
        upvoteButton.id = `${type}-${res.id}-upvote-button`
        upvoteButton.innerText = "Upvote"
        let downvoteButton = document.createElement("button")
        downvoteButton.classList.add(`${type}-downvote-button`,"downvote-button")
        downvoteButton.id = `${type}-${res.id}-downvote-button`
        downvoteButton.innerText = "Downvote"
        let commentButton = document.createElement("button")
        commentButton.id=`${type}-${res.id}-comment-button`
        commentButton.classList.add(`${type}-comment-button`,"comment-button")
        commentButton.innerText = "Comment"
        li.append(answerVoteCount)
        li.append(commentButton)
        li.append(upvoteButton)
        li.append(downvoteButton)
        addEventListenerToVoteButton(upvoteButton,"answer","upvote")
        addEventListenerToVoteButton(downvoteButton,"answer","downvote")
        addEventListenerToReplyButton(commentButton,"comment","answer")
    }
    let addDeleteFunctionality = (li,type,res) => {
        let deleteButton = document.createElement("button");
        deleteButton.classList.add(`${type}-delete-button`,"delete-button");
        deleteButton.id = `${type}-${res.id}-delete-button`;
        deleteButton.innerText = "Delete";
        li.append(deleteButton);
        addEventListenerToDeleteButton(deleteButton,type)
    }

    let addEditFunctionality = (li,type,res) => {
        let editButton = document.createElement("button");
        editButton.classList.add(`${type}-edit-button`,"edit-button");
        editButton.id = `${type}-${res.id}-edit-button`;
        editButton.innerText = "Edit";
        li.append(editButton);
        addEventListenerToEditButton(editButton,type)
    }

    let addAnswerCommentFunctionality = (comment, parentId) => {
        let comments = document.getElementById(`answer-${parentId}-comments`)
        //comments div will always already exist
        // if(!comments){
        //     comments = document.createElement("comments")
        //     comments.id = `answer-${parentId}-comments`
        //     comments.classList.add("answer-comments")
        //     document.getElementById(`answer-${parentId}`).append(comments)
        // }
        comments.append(comment)
    }
    //important
    let createNewElement = async (type,res,parentType,parentId) => {

        let li = createListItem(type,res)
        const comment = createComment(type, res);
        if(type === "answer"){
            addAnswerFunctionality(li,type,res)
        }
        addDeleteFunctionality(li,type,res)
        addEditFunctionality(li,type,res)
        if(type==="comment" && parentType === "answer"){
        addAnswerCommentFunctionality(comment, parentId)
        } else if (parentType === "question"){
            // let ul = document.querySelector(`ul.${type}s`);
            // ul.append(li)
            if (type === 'answer') {
              const answer = createAnswerItem(type, res);
              const answers = document.querySelector('.answers');
              answers.append(answer);
            } else if (type === 'comment') {
              const comment = createComment(type, res);
              const comments = document.querySelector('.comments_container');
              comments.append(comment);
            }
        }
    }


    let addEventListenerToSubmitButton = async (submitButton,form) => {
        if(submitButton){
            submitButton.addEventListener("click",async (event)=> {
              event.preventDefault()
                let body = {}
                let {type,method,passedId,parentType} = getFormAttributes(form)
                for(let input of form.children){
                    if (input.name === "message"){
                        body.message = input.value
                    } else if (input.name === "title"){
                        body.title = input.value
                    }
                }

                let url

                if(method==="PUT"){
                    url = `/${type}s/${passedId}`
                } else if (method==="POST") {
                    url = `/${parentType}s/${passedId}/${type}s`
                }
                let res = await fetch(url,{
                    method:method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body:JSON.stringify(body)
                })
                res = await res.json()
                if(res.message){
                    if(type === "question"){
                        document.getElementById("title").innerText = res.title;
                        document.getElementById("message").innerText = res.message;
                        form.style.display = "none"
                        return
                    } else if (method === "PUT"){
                        document.getElementById(`${type}-${res.id}-message`).innerText = res.message;
                    } else if (method === "POST"){
                        createNewElement(type,res,parentType,passedId)
                    }
                    form.remove()
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

    let addEventListenerToDeleteButton = async (deleteButton,type) => {
        if(deleteButton){
            deleteButton.addEventListener("click",async (event)=> {
                let id = Number(deleteButton.id.split("-")[1])
                let url = `/${type}s/${id}`
                await fetch(url, {
                    method: "delete",
                  });
                if(type === "question"){
                    window.location = "/"
                }else{
                    let reply = document.querySelector(`#${type}-${id}`)
                    reply.remove();
                }
            })
        }
      }

      for(let deleteButton of deleteButtons){
        if(deleteButton.classList.contains("question-delete-button")){
            addEventListenerToDeleteButton(deleteButton,"question")
        } else if (deleteButton.classList.contains("answer-delete-button")){
            addEventListenerToDeleteButton(deleteButton,"answer")
        } else if (deleteButton.classList.contains("comment-delete-button")){
            addEventListenerToDeleteButton(deleteButton,"comment")
        }
      }


    let addEventListenerToReplyButton = async (replyButton,type,parentType) => {
        if(replyButton){
            replyButton.addEventListener("click",async (event)=> {
              let parentId = Number(replyButton.id.split("-")[1])
              let attributes = {
                "type":type,
                "method":"POST",
                "passed-id":parentId,
                "parent-type":parentType
            }
              clearSubmitEventListeners()
              clearForms()
              let form = createForm()
              let parent = document.getElementById(`${parentType}-${parentId}`)
              let submit = form.children[1]
              parent.append(form)
              setFormAttributes(form,attributes)
              form.style.display = "block"
              addEventListenerToSubmitButton(submit,form)
            })
        }
      }



    for(let answerButton of answerButtons){
        addEventListenerToReplyButton(answerButton,"answer","question")
    }

    for(let commentButton of commentButtons){
      if(commentButton.classList.contains("answer-comment-button")){
          addEventListenerToReplyButton(commentButton,"comment","answer")
      } else
      addEventListenerToReplyButton(commentButton,"comment","question")
    }


    let addEventListenerToEditButton = async (editButton,type) => {
        if(editButton){
            editButton.addEventListener("click",async (event)=> {
                let selfId = Number(editButton.id.split("-")[1])
                let attributes = {
                    "type":type,
                    "method":"PUT",
                    "passed-id":selfId,
                    "parent-type":null
                }
                clearSubmitEventListeners()
                clearForms()
                let form
                let submit
                if(type === "question"){
                  form = document.querySelector("#question-form")
                  submit = document.querySelector("#question-submit")
                } else {
                  form = createForm()
                  submit = form.children[1]
                  let parent = document.getElementById(`${type}-${selfId}`)
                  parent.append(form)
                }
                setFormAttributes(form,attributes)
                form.style.display = "block"
                addEventListenerToSubmitButton(submit,form)
            })
        }
    }


    for(let editButton of editButtons){
        if(editButton.classList.contains("question-edit-button")){
            addEventListenerToEditButton(editButton,"question")
        } else if (editButton.classList.contains("answer-edit-button")){
            addEventListenerToEditButton(editButton,"answer")
        } else if (editButton.classList.contains("comment-edit-button")){
            addEventListenerToEditButton(editButton,"comment")
        }
    }



    let addEventListenerToVoteButton = async (voteButton,type,voteType) => {
        if(voteButton){
          voteButton.addEventListener("click",async (event)=> {
            let scoreChange
            if (voteType === "upvote")scoreChange = 1
            else if (voteType === "downvote")scoreChange = -1
              let id = Number(voteButton.id.split("-")[1])
              await fetch(`/${type}s/${id}/${voteType}s`,{
                method:"POST"
              })
              let voteCount = document.getElementById(`${type}-${id}-vote-count`)
              voteCount.innerText = Number(voteCount.innerText)+scoreChange
              voteButton.style.display = "none"
              if(voteType === "upvote"){
                document.getElementById(`${type}-${id}-downvote-button`).style.display="none"
              } else {
                document.getElementById(`${type}-${id}-upvote-button`).style.display="none"
              }
          })
        }
      }

    for(let upvoteButton of upvoteButtons){
        if(upvoteButton.classList.contains("answer-upvote-button")){
          addEventListenerToVoteButton(upvoteButton,"answer","upvote")
        } else if (upvoteButton.classList.contains("question-upvote-button")){
          addEventListenerToVoteButton(upvoteButton,"question","upvote")
        }
      }

      for(let downvoteButton of downvoteButtons){
        if(downvoteButton.classList.contains("answer-downvote-button")){
          addEventListenerToVoteButton(downvoteButton,"answer","downvote")
        } else if (downvoteButton.classList.contains("question-downvote-button")){
          addEventListenerToVoteButton(downvoteButton,"question","downvote")
        }
      }


})
