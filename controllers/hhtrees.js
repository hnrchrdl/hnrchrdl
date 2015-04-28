/**
 * GET /
 * Project HH Street Trees.
 */
exports.index = function(req, res) {
  res.render('hhtrees', {
    title: 'HH Trees'
  });
};