let upvoteButtons = document.getElementsByClassName("upvote-button")
let downvoteButtons = document.getElementsByClassName("downvote-button")
let questionForm = document.querySelector("#question-form")
let replyForm = document.querySelector("#reply-form")
let {removeAttributes, clearSubmitEventListeners} = require("./utils")
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


module.exports = {
    addEventListenerToVoteButton
}
