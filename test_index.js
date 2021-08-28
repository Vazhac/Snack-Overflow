window.addEventListener("load", (event) => {
    let deleteButtons = document.getElementsByClassName("delete-button")
    let editButtons = document.getElementsByClassName("edit-button")
    let commentButtons = document.getElementsByClassName("comment-button")
    let upvoteButtons = document.getElementsByClassName("upvote-button")
    let downvoteButtons = document.getElementsByClassName("downvote-button")
    let answerButtons = document.getElementsByClassName("answer-button")
    //let submitButtons = document.getElementsByClassName("submit")
    let questionForm = document.querySelector("#question-form")

    let replyForm = document.querySelector("#reply-form")


    let addEventListenerToSubmitButton = async (submitButton,formType) => {
        if(submitButton){
            submitButton.addEventListener("click",async (event)=> {
                //This is for comment submits, answer submits,
                //question edits, comment edits, answer edits
                let form
                let parentType
                let parentId
                let body = {}
                if(formType === "question"){//This must be an edit
                    form = document.querySelector("#question-form")
                    body.title = form.children[0]
                    body.message = form.children[1]
                } else if (formType === "reply"){
                    form = document.querySelector("#reply-form")
                    body.message = form.children[0]
                }
                let type = form.getAttribute("type")
                let method = form.getAttribute("method")
                let url
                if(method==="PUT"){
                    let id = form.getAttribute("id")
                    url = `${type}s/${id}`
                } else if(method==="POST"){
                    parentId = form.getAttribute("parent-id")
                    parentType = form.getAttribute("parent-type")
                    url = `/${parentType}s/${parentId}/${type}s`
                }

                let res = await fetch(url,{
                    method:method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body:body
                })
                res = await res.json()
                if(res.message){
                    if(method==="PUT"){
                        if(type === "question"){
                            document.getElementById("title").innerText = res.title;
                            document.getElementById("message").innerText = res.message;
                        } else {
                            document.getElementById(`${type}-${res.id}-message`).innerText = res.message;
                        }
                        form.style.display = "none"
                    } else if (method === "POST"){
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
                        if(type === "answer"){
                            let answerVoteCount = document.createElement("div")
                            answerVoteCount.id = `answer-${res.id}-vote-count`
                            answerVoteCount.innerText = 0
                            answerVoteCount.classList.add("answer-vote-count")
                            let upvoteButton = document.createElement("button")
                            upvoteButton.classList.add(`answer-upvote-button`,"upvote-button")
                            upvoteButton.id = `answer-${res.id}-upvote-button`
                            upvoteButton.innerText = "Upvote"
                            let downvoteButton = document.createElement("button")
                            downvoteButton.classList.add(`answer-downvote-button`,"downvote-button")
                            downvoteButton.id = `answer-${res.id}-downvote-button`
                            downvoteButton.innerText = "Downvote"
                            let commentButton = document.createElement("button")
                            commentButton.id=`answer-${res.id}-comment-button`
                            commentButton.classList.add("answer-comment-button","comment-button")
                            commentButton.innerText = "Comment"
                            li.append(answerVoteCount)
                            li.append(commentButton)
                            li.append(upvoteButton)
                            li.append(downvoteButton)
                            addEventListenerToVoteButton(upvoteButton,"answer","upvote")
                            addEventListenerToVoteButton(downvoteButton,"answer","downvote")
                            addEventListenerToCommentButton(commentButton,"answer")
                            addEventListenerToSubmitButton(answerCommentSubmitButton,"comment")
                        }
                        let deleteButton = document.createElement("button");
                        deleteButton.classList.add(`${type}-delete-button`,"delete-button");
                        deleteButton.id = `${type}-${res.id}-delete-button`;
                        deleteButton.innerText = "Delete";
                        let editButton = document.createElement("button");
                        editButton.classList.add(`${type}-edit-button`,"edit-button");
                        editButton.id = `${type}-${res.id}-edit-button`;
                        editButton.innerText = "Edit";
                        li.append(deleteButton);
                        li.append(editButton);
                        let ul
                        if(type==="comment" && parentType === "answer"){
                            ul = document.getElementById(`answer-${parentId}-comments`)
                            if(!ul){
                                ul = document.createElement("ul")
                                ul.id = `answer-${parentId}-comments`
                                ul.classList.add("answer-comments")
                                document.getElementById(`answer-${parentId}`).append(ul)
                            }
                        } else if (type === "comment" && parentType === "question"){
                            ul = document.querySelector(`ul.${type}s`);
                        }
                        ul.append(li)
                        addEventListenerToEditButton(editButton,type)
                        addEventListenerToDeleteButton(deleteButton,type)
                        console.log("HERE: ",form.attributes)
                        for(let attribute of form.attributes){
                            console.log("attribute: ",attribute)
                        }
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

    let addEventListenerToCommentButton = async (commentButton,parent) => {
        if(commentButton){
            commentButton.addEventListener("click",async (event)=> {
               if(parent === "answer"){
                replyForm.style.display = "block"
                replyForm.setAttribute("parent-type",parent)
                replyForm.setAttribute("parent-id",Number(commentButton.id.split("-")[1]))
                replyForm.setAttribute("type","comment")
                replyForm.setAttribute("method","POST")
                addEventListenerToSubmitButton(replyForm.children[1],"reply")
               } else if (parent === "question"){
                questionForm.style.display = "block"
                addEventListenerToSubmitButton(questionForm.children[2],"question")
               }

            })
        }
    }

    for(let commentButton of commentButtons){
        if(commentButton.classList.contains("answer-comment-button")){
            addEventListenerToCommentButton(commentButton,"answer")
        } else
        addEventListenerToCommentButton(commentButton,"question")
    }



    let addEventListenerToDeleteButton = async (deleteButton,type) => {
        if(deleteButton){
            deleteButton.addEventListener("click",async (event)=> {
                let id = Number(deleteButton.split("-")[1])
                let url = `${type}s/${id}`
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



    let addEventListenerToAnswerButton = async (answerButton) => {
        if(answerButton){
            answerButton.addEventListener("click",async (event)=> {
                let questionId = Number(answerButton.id.split("-")[1])
                replyForm.style.display = "block"
                replyForm.setAttribute("parent-type","question")
                replyForm.setAttribute("parent-id",questionId)
                replyForm.setAttribute("method","POST")
                replyForm.setAttribute("type","answer")
                addEventListenerToSubmitButton(replyForm.children[1],"reply")
            })
        }
    }

    for(let answerButton of answerButtons){
        addEventListenerToAnswerButton(answerButton)
    }

    let addEventListenerToEditButton = async (editButton,type) => {
        if(editButton){
            editButton.addEventListener("click",async (event)=> {
                let form
                if(type === "question"){
                    form = questionForm
                } else {
                    form = replyForm
                }
                form.style.display = "block"
                form.setAttribute("id",Number(editButton.id.split("-")[1]))
                form.setAttribute("method","PUT")
                form.setAttribute("type",type)
                if(type === "question"){//questionForm
                    let submit = document.querySelector("#question-submit")
                    addEventListenerToSubmitButton(submit,"question")
                } else {
                    let submit = document.querySelector("#reply-submit")
                    addEventListenerToSubmitButton(submit,"reply")
                }
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
})
