const isLogin = (req, res, next) => {
    if (req.user) {
        next()
    } else{
        return res.status(401).send('Acces Denied')
    }
}

module.exports = isLogin;