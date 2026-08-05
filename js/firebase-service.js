import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import { ADMIN_EMAIL, firebaseConfig, firebaseReady } from "./firebase-config.js";

let app; let auth; let db;
if (firebaseReady) { app = initializeApp(firebaseConfig); auth = getAuth(app); db = getFirestore(app); }

export function subscribeProducts(onProducts, onError = console.error, includeHidden = false) {
  if (!firebaseReady) { onError(new Error("Firebase pendiente")); return () => {}; }
  const source = includeHidden ? collection(db, "products") : query(collection(db, "products"), where("visible", "==", true));
  return onSnapshot(source, (snapshot) => onProducts(snapshot.docs.map((item) => ({ id:item.id, ...item.data() })).sort((a,b) => Number(a.sortOrder)-Number(b.sortOrder))), onError);
}
export function subscribeAppearance(onAppearance, onError = console.error) {
  if (!firebaseReady) return () => {};
  return onSnapshot(doc(db, "site", "appearance"), (snapshot) => onAppearance(snapshot.exists() ? snapshot.data() : {}), onError);
}
export async function login(email, password) {
  if (!firebaseReady) throw new Error("Primero configura Firebase.");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (credential.user.email?.toLowerCase() !== ADMIN_EMAIL) { await signOut(auth); throw new Error("Este correo no tiene permiso de administrador."); }
  return credential.user;
}
export function watchAdmin(callback) { if (!firebaseReady) { callback(null); return () => {}; } return onAuthStateChanged(auth, (user) => callback(user?.email?.toLowerCase() === ADMIN_EMAIL ? user : null)); }
export function logout() { return signOut(auth); }
async function optimizeImage(file, maxSide = 720, maxLength = 700000) {
  if (!file.type.startsWith("image/")) throw new Error("Selecciona una fotografía válida.");
  const bitmap = await createImageBitmap(file); const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d"); context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  let quality = 0.76; let result = canvas.toDataURL("image/jpeg", quality);
  while (result.length > maxLength && quality > 0.32) { quality -= 0.08; result = canvas.toDataURL("image/jpeg", quality); }
  if (result.length > maxLength + 50000) throw new Error("La fotografía continúa siendo demasiado grande. Elige una imagen más pequeña.");
  return result;
}
export async function saveAppearance(current, logoFile, heroFile) {
  if (!auth.currentUser || auth.currentUser.email?.toLowerCase() !== ADMIN_EMAIL) throw new Error("Acceso no autorizado.");
  const appearance = { logo:current.logo || "", hero:current.hero || "" };
  if (logoFile) appearance.logo = await optimizeImage(logoFile, 420, 250000);
  if (heroFile) appearance.hero = await optimizeImage(heroFile, 960, 520000);
  await setDoc(doc(db, "site", "appearance"), appearance, { merge:true });
}
export async function saveProduct(product, file) {
  if (!auth.currentUser || auth.currentUser.email?.toLowerCase() !== ADMIN_EMAIL) throw new Error("Acceso no autorizado.");
  const id = product.id || product.code.toUpperCase(); let image = product.image || "";
  if (file) image = await optimizeImage(file);
  await setDoc(doc(db, "products", id), { code:product.code.toUpperCase(), name:product.name, category:product.category, size:product.size || "", description:product.description || "", price:Number(product.price), image, available:Boolean(product.available), visible:Boolean(product.visible), sortOrder:Number(product.sortOrder) || 0 }, { merge:true });
}
export async function removeProduct(product) { await deleteDoc(doc(db, "products", product.id)); }
export async function seedInitialProducts() {
  if (!auth.currentUser || auth.currentUser.email?.toLowerCase() !== ADMIN_EMAIL) return;
  const existingProducts = await getDocs(collection(db, "products"));
  if (!existingProducts.empty) return;
  const initial = [
    ["A001","Alcancía Stitch","Alcancías","22 cm","Alcancía artesanal de yeso cerámico, lista para pintar.",30,"img/alcancias/alcancias1.jpg"],
    ["A002","Alcancía Unicornio","Alcancías","25 cm","Modelo infantil personalizado ideal para regalos.",35,"img/alcancias/alcancias2.jpg"],
    ["A003","Alcancía Mickey","Alcancías","25 cm","Diseño infantil decorativo elaborado en yeso cerámico.",35,"img/alcancias/alcancias3.jpg"],
    ["R001","Virgen María en Relieve","Relieves","30 cm","Figura decorativa con acabado artesanal.",40,"img/relieves/relieves1.jpg"],
    ["R002","La Última Cena","Relieves","40 cm","Relieve decorativo para hogares y espacios especiales.",60,"img/relieves/relieves2.jpg"],
    ["R003","Diseño Floral en Relieve","Relieves","25 cm","Decoración artesanal con detalles hechos a mano.",45,"img/relieves/relieves3.jpg"],
    ["P001","Charizard Papercraft","Papercraft","30 cm","Modelo 3D elaborado en papel para colección.",35,"img/papercraft/charizar.jpg"],
    ["P002","Charmilio Papercraft","Papercraft","25 cm","Figura 3D en papel para coleccionistas.",30,"img/papercraft/charmilio.jpg"],
    ["P003","Pikacho Papercraft","Papercraft","20 cm","Modelo decorativo en papel perfecto para regalos.",25,"img/papercraft/pikacho.jpg"]
  ];
  await Promise.all(initial.map(([code,name,category,size,description,price,image], index) => setDoc(doc(db, "products", code), { code,name,category,size,description,price,image,available:true,visible:true,sortOrder:index+1 }, { merge:true })));
}
export { firebaseReady };
