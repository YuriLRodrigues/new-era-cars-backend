export const validateUsername = (username: string) => {
  if (/^[a-zA-Z0-9_]+$/.test(username)) {
    return username.toLowerCase();
  } else {
    return username.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
  }
};
