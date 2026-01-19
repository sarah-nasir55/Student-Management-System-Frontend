export const setCookie = (name, value, options = {}) => {
  const defaults = {
    path: '/',
    maxAge: 24 * 60 * 60, 
    ...options,
  };

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (defaults.maxAge) {
    cookieString += `; Max-Age=${defaults.maxAge}`;
  }
  if (defaults.path) {
    cookieString += `; Path=${defaults.path}`;
  }

  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

export const removeCookie = (name) => {
  setCookie(name, '', { maxAge: -1 });
};

export const getAllCookies = () => {
  const cookies = {};
  document.cookie.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(value || '');
    }
  });
  return cookies;
};

export const isTokenValid = () => {
  const token = getCookie('auth_token');
  return token !== null && token !== '';
};
