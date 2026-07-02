/* 青山 Peak Tea — 揪團點餐：目前使用者 + 共用訂單清單（localStorage） */

const USER_KEY = 'peaktea_user';
const ORDER_KEY = 'peaktea_group_order';

function getCurrentUser() {
  return localStorage.getItem(USER_KEY) || '';
}

function setCurrentUser(name) {
  localStorage.setItem(USER_KEY, name.trim());
}

function getGroupOrder() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function saveGroupOrder(list) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(list));
}

function addToGroupOrder(item) {
  const list = getGroupOrder();
  list.push(item);
  saveGroupOrder(list);
  return list;
}

function removeFromGroupOrder(index) {
  const list = getGroupOrder();
  list.splice(index, 1);
  saveGroupOrder(list);
  return list;
}

function clearGroupOrder() {
  saveGroupOrder([]);
}

function groupStats() {
  const list = getGroupOrder();
  const people = new Set(list.map(i => i.person)).size;
  const cups = list.reduce((sum, i) => sum + i.qty, 0);
  const total = list.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  return { people, cups, total };
}
