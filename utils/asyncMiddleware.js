
const asyncMiddleware = () =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
};
