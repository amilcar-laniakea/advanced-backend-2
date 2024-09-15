export const Response = (
  res,
  data,
  message = null,
  status = 200,
  success = true,
  cookieName = null,
  cookieValue = null,
  expirationTime = 1800000
) => {
  if (cookieName && cookieValue) {
    res.cookie(cookieName, cookieValue, { maxAge: expirationTime });
  }

  res.status(status).json({
    status,
    success,
    data,
    message,
  });
};
