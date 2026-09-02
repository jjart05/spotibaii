export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err?.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large.' : 'Upload failed.';
    return res.status(400).json({ error: message });
  }
  const status = err.status || err.statusCode || 500;
  const message =
    status >= 500 ? 'Something went wrong. Please try again.' : err.message || 'Request failed.';
  res.status(status).json({ error: message });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Not found.' });
}
