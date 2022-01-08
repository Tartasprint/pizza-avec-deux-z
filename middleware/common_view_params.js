module.exports = (req, res, next) => {
    res.locals.user = req.session.user || null;
    if (res.locals.user) console.log(res.locals.user)
    next();
}