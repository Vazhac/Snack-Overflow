let deleteButtons = document.getElementsByClassName("delete-button")
let addEventListenerToDeleteButton = async (deleteButton,type) => {
    if(deleteButton){
        deleteButton.addEventListener("click",async (event)=> {
            let id = Number(deleteButton.id.split("-")[1])
            let url = `/${type}s/${id}`
            console.log("delete url: ", url)
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


module.exports = {
    addEventListenerToDeleteButton
}
