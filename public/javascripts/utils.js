
let clearSubmitEventListeners = async (submitButton) => {
  let newSubmitButton = submitButton.cloneNode(true);
  submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
  console.log(newSubmitButton)
}

let removeAttributes = async (form) => {
  form.removeAttribute("parent-type")
  form.removeAttribute("parent-id")
  form.removeAttribute("type")
  form.removeAttribute("method")
  form.removeAttribute("message-id")
}


module.exports = {
  removeAttributes,
  clearSubmitEventListeners
}
