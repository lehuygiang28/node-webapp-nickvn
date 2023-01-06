function validIDnumber(req, res, next) {
    var reg = /^\d+$/;
    if (req.params.id && reg.test(req.params.id)) {
        res.locals.id = Number.parseInt(req.params.id);
    } else {
        res.locals.id = undefined;
    }
    console.log(res.locals.id);
    next();
}

module.exports = { validIDnumber }