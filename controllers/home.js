/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    if (req.user) {
        res.redirect('/attendance');
    } else {

        res.redirect('/login');
    }
};
