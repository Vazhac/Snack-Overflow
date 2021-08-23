let loginUser = (req,res,user) => {
    req.session.auth = {
        user:{
            id:user.id
        }
    }
}


module.exports = loginUser
