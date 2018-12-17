
module.exports = function(path) {
    path.replace(".", "/")
    return require(`.${path}`);
};