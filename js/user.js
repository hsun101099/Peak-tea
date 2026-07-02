/* 青山 Peak Tea — 目前使用者（本機儲存，與 Firebase 無關，永遠可用） */
const USER_KEY = 'peaktea_user';
const ADMIN_PASSWORD = '0000';

function getCurrentUser() {
  return localStorage.getItem(USER_KEY) || '';
}

function setCurrentUser(name) {
  localStorage.setItem(USER_KEY, name.trim());
}

/* 管理密碼一次性驗證，不記住狀態——管理功能只用來清空全部訂單 */
function checkAdminPassword() {
  const input = prompt('請輸入管理密碼：');
  if (input === null) return false;
  if (input === ADMIN_PASSWORD) return true;
  alert('密碼錯誤');
  return false;
}
