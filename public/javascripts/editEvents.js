let editButtons = document.getElementsByClassName("edit-button")
let questionForm = document.querySelector("#question-form")
let replyForm = document.querySelector("#reply-form")
let {removeAttributes, clearSubmitEventListeners} = require("./utils")


let addEventListenerToEditButton = async (editButton,type) => {
    if(editButton){
        editButton.addEventListener("click",async (event)=> {
            let form
            let submit
            if(type === "question"){
                form = questionForm
                clearSubmitEventListeners(document.querySelector("#question-submit"))
                submit = document.querySelector("#question-submit")
            } else {
                form = replyForm
                clearSubmitEventListeners(document.querySelector("#reply-submit"))
                submit = document.querySelector("#reply-submit")
            }
            removeAttributes(form)
            form.style.display = "block"
            form.setAttribute("message-id",Number(editButton.id.split("-")[1]))
            form.setAttribute("method","PUT")
            form.setAttribute("type",type)
            addEventListenerToSubmitButton(submit,type)
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
