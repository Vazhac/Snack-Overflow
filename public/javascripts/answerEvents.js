let answerButtons = document.getElementsByClassName("answer-button")
let questionForm = document.querySelector("#question-form")
let replyForm = document.querySelector("#reply-form")
let {removeAttributes, clearSubmitEventListeners} = require("./utils")
let addEventListenerToAnswerButton = async (answerButton) => {
    if(answerButton){
        answerButton.addEventListener("click",async (event)=> {
          clearSubmitEventListeners(replyForm.children[1])
            let questionId = Number(answerButton.id.split("-")[1])
            removeAttributes(replyForm)
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


module.exports = {
  addEventListenerToAnswerButton
}
