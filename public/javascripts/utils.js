

let clearSubmitEventListeners = async () => {
  let oldQuestionSubmit = document.querySelector("#question-submit")
  let oldReplySubmit = document.querySelector("#reply-submit")
  let newQuestionSubmit = oldQuestionSubmit.cloneNode(true);
  let newReplySubmit = oldReplySubmit.cloneNode(true)
  oldReplySubmit.parentNode.replaceChild(newReplySubmit, oldReplySubmit);
  oldQuestionSubmit.parentNode.replaceChild(newQuestionSubmit, oldQuestionSubmit)
}

let removeFormAttributes = async (form) => {
  form.removeAttribute("parent-type")
  form.removeAttribute("parent-id")
  form.removeAttribute("type")
  form.removeAttribute("method")
  form.removeAttribute("message-id")
}

let clearForms = async () => {
  replyForm.style.display = "none"
  questionForm.style.display = "none"
  removeFormAttributes(document.querySelector("#reply-form"))
  removeFormAttributes(document.querySelector("#question-form"))
}

let setFormAttributes = async (form,attributes) => {
  for(let attribute in attributes){
    form.setAttribute(attribute,attributes[attribute])
  }
}

let getFormAttributes = async (form) => {
  let attributes = {}
  attributes.type=form.getAttribute("type")
  attributes.method=form.getAttribute("method")
  attributes.passedId=form.getAttribute("passed-id")
  attributes.parentId=form.getAttribute("parent-id")
  attributes.passedId = Number(attributes.passedId)
  return attributes
}


module.exports = {
  clearSubmitEventListeners,
  clearForms,
  setFormAttributes,
  getFormAttributes
}
