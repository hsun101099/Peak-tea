/* 青山 Peak Tea — 揪團點餐：共用訂單清單（Firestore 即時同步）
   目前使用者的姓名是本機資料，與 Firebase 無關，見 js/user.js */

import { db } from './firebase-init.js';
import {
  collection, addDoc, deleteDoc, doc, onSnapshot,
  query, orderBy, getDocs, writeBatch, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const ordersCol = collection(db, 'orders');
const ordersQuery = query(ordersCol, orderBy('createdAt', 'asc'));

/* callback(list) 會在初次連線與之後每次資料變動時觸發；回傳 unsubscribe function */
export function subscribeGroupOrder(callback) {
  return onSnapshot(ordersQuery, (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(list);
  }, (err) => {
    console.error('Firestore 訂閱失敗', err);
    callback([], err);
  });
}

export async function addToGroupOrder(item) {
  await addDoc(ordersCol, { ...item, createdAt: serverTimestamp() });
}

export async function removeFromGroupOrder(id) {
  await deleteDoc(doc(db, 'orders', id));
}

export async function clearGroupOrder() {
  const snap = await getDocs(ordersCol);
  const batch = writeBatch(db);
  snap.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

export function computeStats(list) {
  const people = new Set(list.map(i => i.person)).size;
  const cups = list.reduce((sum, i) => sum + i.qty, 0);
  const total = list.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  return { people, cups, total };
}
