let {getFormAttributes} = require("./utils")

let createListItem = async (type,res) => {
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
    addEventListenerToCommentButton(commentButton,"comment","answer")
}
let addDeleteFunctionality = async (li,type,res) => {
    let deleteButton = document.createElement("button");
    deleteButton.classList.add(`${type}-delete-button`,"delete-button");
    deleteButton.id = `${type}-${res.id}-delete-button`;
    deleteButton.innerText = "Delete";
    li.append(deleteButton);
    addEventListenerToDeleteButton(deleteButton,type)
}

let addEditFunctionality = async (li,type,res) => {
    let editButton = document.createElement("button");
    editButton.classList.add(`${type}-edit-button`,"edit-button");
    editButton.id = `${type}-${res.id}-edit-button`;
    editButton.innerText = "Edit";
    li.append(editButton);
    addEventListenerToEditButton(editButton,type)
}

let addAnswerCommentFunctionality = async (li,parentId) => {
    let ul = document.getElementById(`answer-${parentId}-comments`)
    if(!ul){
        ul = document.createElement("ul")
        ul.id = `answer-${parentId}-comments`
        ul.classList.add("answer-comments")
        document.getElementById(`answer-${parentId}`).append(ul)
    }
    ul.append(li)
}
let createNewElement = async (type,res,parentType,parentId) => {

    let li = createListItem(type,res)
    if(type === "answer"){
        addAnswerFunctionality(li,type,res)
    }
    addDeleteFunctionality(li,type,res)
    addEditFunctionality(li,type,res)
    if(type==="comment" && parentType === "answer"){
    addAnswerCommentFunctionality(li,parentId)
    } else if (parentType === "question"){
        let ul = document.querySelector(`ul.${type}s`);
        ul.append(li)
    }
}


let addEventListenerToSubmitButton = async (submitButton,form) => {
    if(submitButton){
        submitButton.addEventListener("click",async (event)=> {
          event.preventDefault()
            let body = {}
            let {type,method,passedId,parentType} = getFormAttributes(form)
            //might need to get this form again, dont know if it will be the old version without the input values
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
                } else if (method === "PUT"){
                    document.getElementById(`${type}-${res.id}-message`).innerText = res.message;
                } else if (method === "POST"){
                    createNewElement(type,res,parentType,parentId)
                }
                form.style.display = "none"
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
