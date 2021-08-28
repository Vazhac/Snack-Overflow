let questionForm = document.querySelector("#question-form")
let replyForm = document.querySelector("#reply-form")
let {removeAttributes, clearSubmitEventListeners} = require("./utils")


let addEventListenerToSubmitButton = async (submitButton,formType) => {
    if(submitButton){
        submitButton.addEventListener("click",async (event)=> {
          event.preventDefault()
            let form
            let parentType
            let parentId
            let body = {}
            if(formType === "question"){
                form = document.querySelector("#question-form")
                body.title = form.children[0].value
                body.message = form.children[1].value
            } else {
                form = document.querySelector("#reply-form")
                body.message = form.children[0].value
            }
            let type = form.getAttribute("type")
            let method = form.getAttribute("method")
            let url
            if(method==="PUT"){
                let id = form.getAttribute("message-id")
                url = `/${type}s/${id}`
            } else if(method==="POST"){
                parentId = form.getAttribute("parent-id")
                parentType = form.getAttribute("parent-type")
                url = `/${parentType}s/${parentId}/${type}s`
            }
            console.log(url)
            console.log(method)
            console.log("body: ",body)

            let res = await fetch(url,{
                method:method,
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
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
                    } else if (parentType === "question"){
                        ul = document.querySelector(`ul.${type}s`);
                    }
                    ul.append(li)
                    addEventListenerToEditButton(editButton,type)
                    addEventListenerToDeleteButton(deleteButton,type)
                    console.log("form attributes: ",form.attributes)
                    form.style.display="none"
                    console.log("form attributes after: ",form.attributes)
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

module.exports = {
    addEventListenerToSubmitButton
}
