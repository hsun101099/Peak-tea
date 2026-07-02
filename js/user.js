/* 青山 Peak Tea — 目前使用者（本機儲存，與 Firebase 無關，永遠可用） */
const USER_KEY = 'peaktea_user';

function getCurrentUser() {
  return localStorage.getItem(USER_KEY) || '';
}

function setCurrentUser(name) {
  localStorage.setItem(USER_KEY, name.trim());
}
