let answerButtons = document.getElementsByClassName("answer-button")
let commentButtons = document.getElementsByClassName("comment-button")
let {clearForms, clearSubmitEventListeners,setFormAttributes} = require("./utils")

let addEventListenerToReplyButton = async (replyButton,type,parentType) => {
    if(replyButton){
        replyButton.addEventListener("click",async (event)=> {
          let parentId = Number(replyButton.id.split("-")[1])
          let attributes = {
            "type":type,
            "method":"POST",
            "passedId":parentId,
            "parentType":parentType
        }
          clearSubmitEventListeners()
          clearForms()
          let form = document.querySelector("#reply-form")
          let submit = document.querySelector("#reply-submit")
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

module.exports = {
  addEventListenerToReplyButton
}
