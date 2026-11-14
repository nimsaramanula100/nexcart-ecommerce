// EN: Final Express middleware for 404 routing and standardized error responses; SI: 404 සහ ඒකාකාර දෝෂ ප්‍රතිචාර සඳහා අවසාන Express middleware.
const notFound = (req, res, next) => {
  // EN: Turn an unmatched request path into an Error for the shared handler; SI: නොගැළපෙන request path එක පොදු handler වෙත Error එකක් ලෙස යවයි.
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // EN: Preserve an existing status, default to 500, and hide stack traces in production; SI: පවතින status රැකගෙන, නැතිනම් 500 යොදා production හි stack trace සඟවයි.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
