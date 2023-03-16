module.exports = (AsyncFunction) => (req, res, next) => {
  Promise.resolve(AsyncFunction(req, res, next)).catch(next);
};
