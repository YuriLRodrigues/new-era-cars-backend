export const validateUsername = (username: string) => {
  const sanitizedUsername = username.replace(/\s+/g, '_');

  if (/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
    return sanitizedUsername.toLowerCase();
  } else {
    return sanitizedUsername.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  }
};
