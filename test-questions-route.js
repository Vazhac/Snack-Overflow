router.get('/', asyncHandler(async (req, res, next) => {
const totalQuestions = await Question.count();
const amountOfPages = Math.ceil(totalQuestions / 5)
let currentPage = 1;
if (req.query.page) {
    currentPage = Number(req.query.page);
}
let pageNumbers = []
for(let page = currentPage-2;pageNumbers.length<amountOfPages;page++){
    if(page>0 && page !== currentPage){
        pageNumbers.push(page)
    }
    pageNumbers.push(page)
}
const questions = await Question.findAll({
    include: [Answer, Comment, Upvote],
    offset: (currentPage - 1) * numberOfLinks,
    limit: numberOfLinks,
    orderBy: [["id", "DESC"]]
});

for (let question of questions) {
    question.voteCount = question.Upvotes.reduce((accum, upvote) => {
        if (upvote.isPositive) return 1
        else return -1
    }, 0)
}
res.render('questions', {
    questions,
    session: req.session,
    amountOfPages,
    pageNumbers,
    currentPage
})
}));
