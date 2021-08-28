let editButtons = document.getElementsByClassName("edit-button")
let {clearForms, clearSubmitEventListeners,setFormAttributes} = require("./utils")

let addEventListenerToEditButton = async (editButton,type) => {
    if(editButton){
        editButton.addEventListener("click",async (event)=> {
            let selfId = Number(editButton.id.split("-")[1])
            let attributes = {
                "type":type,
                "method":"PUT",
                "passedId":selfId,
                "parentType":null
            }
            clearSubmitEventListeners()
            clearForms()
            let form = type === "question" ? document.querySelector("#question-form") : document.querySelector("#reply-form")
            let submit = type === "question" ? document.querySelector("#question-submit") : document.querySelector("#reply-submit")
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
