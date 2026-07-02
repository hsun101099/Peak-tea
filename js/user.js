/* 青山 Peak Tea — 目前使用者 + 管理員狀態（本機儲存，與 Firebase 無關，永遠可用） */
const USER_KEY = 'peaktea_user';
const ADMIN_KEY = 'peaktea_is_admin';
const ADMIN_PASSWORD = '0000';

function getCurrentUser() {
  return localStorage.getItem(USER_KEY) || '';
}

function setCurrentUser(name) {
  localStorage.setItem(USER_KEY, name.trim());
}

function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === '1';
}

function unlockAdmin() {
  const input = prompt('請輸入管理員密碼：');
  if (input === null) return false;
  if (input === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, '1');
    return true;
  }
  alert('密碼錯誤');
  return false;
}

function lockAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}
