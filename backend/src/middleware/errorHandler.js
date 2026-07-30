export function errorHandler(err, req, res, next) {
  console.error('[ReviewLens API Error]', err.message);
  res.status(500).json({
    error: 'AI analysis failed',
    message: err.message,
  });
}
