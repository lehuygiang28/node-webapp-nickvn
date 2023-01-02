function changeLayoutMiddleware(_req, res, next) {
    // if(_req.options)
    // {
    console.log(_req);
    // }
    next();
}

module.exports = {
    changeLayoutMiddleware,
};