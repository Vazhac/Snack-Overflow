let commentButtons = document.getElementsByClassName("comment-button")
let questionForm = document.querySelector("#question-form")
let replyForm = document.querySelector("#reply-form")
let {removeAttributes, clearSubmitEventListeners} = require("./utils")
let addEventListenerToCommentButton = async (commentButton,parent) => {
    if(commentButton){
        commentButton.addEventListener("click",async (event)=> {
          clearSubmitEventListeners(replyForm.children[1])
          removeAttributes(replyForm)
          if(questionForm.style.display==="block"){
            removeAttributes(questionForm)
            questionForm.style.display = "none"
          }
            replyForm.style.display = "block"
            replyForm.setAttribute("parent-type",parent)
            replyForm.setAttribute("parent-id",Number(commentButton.id.split("-")[1]))
            replyForm.setAttribute("type","comment")
            replyForm.setAttribute("method","POST")
            addEventListenerToSubmitButton(replyForm.children[1],"reply")
        })
    }
  }


  for(let commentButton of commentButtons){
    if(commentButton.classList.contains("answer-comment-button")){
        addEventListenerToCommentButton(commentButton,"answer")
    } else
    addEventListenerToCommentButton(commentButton,"question")
  }

module.exports = {
    addEventListenerToCommentButton
}
