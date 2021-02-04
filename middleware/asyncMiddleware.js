// Removing and Improving the try/catch block in the routes
function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = asyncMiddleware;
