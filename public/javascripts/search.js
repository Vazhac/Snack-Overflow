
let search = document.getElementById("search-bar")

search.addEventListener("keyup", async (event) => {
    let searchResults = document.getElementById("search-results")
    let oldResults = []
    for (let result of searchResults.children) {
        oldResults.push(result)
    }
    for (let oldResult of oldResults) {
        oldResult.remove()
    }
    let input = event.target.value
    console.log(input)
    if (!input) searchResults.style.display = "none"
    if (input.length) {
        let res = await fetch("/questions/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ input })
        })
        let questions = await res.json()
        for (let question of questions) {
            let result = document.createElement("li")
            let link = document.createElement("a")
            let title = document.createElement("div")
            title.id = `question-${question.id}-title`
            title.classList.add("search-title")
            title.innerText = question.title
            link.href = `/questions/${question.id}`
            link.style.textDecoration = "none"
            link.append(title)
            result.append(link)
            searchResults.append(result)
        }
        searchResults.style.display = "block"
        searchResults.style.height = "100px"
    }

})
