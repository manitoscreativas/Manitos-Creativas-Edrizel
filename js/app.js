import { subscribeAppearance, subscribeProducts } from "./firebase-service.js";

const fallbackProducts = [
  { id:"A001", code:"A001", name:"Alcancía Stitch", category:"Alcancías", size:"22 cm", description:"Alcancía artesanal de yeso cerámico, lista para pintar.", price:30, image:"img/alcancias/alcancias1.jpg", available:true, visible:true, sortOrder:1 },
  { id:"A002", code:"A002", name:"Alcancía Unicornio", category:"Alcancías", size:"25 cm", description:"Modelo infantil personalizado ideal para regalos.", price:35, image:"img/alcancias/alcancias2.jpg", available:true, visible:true, sortOrder:2 },
  { id:"A003", code:"A003", name:"Alcancía Mickey", category:"Alcancías", size:"25 cm", description:"Diseño infantil decorativo elaborado en yeso cerámico.", price:35, image:"img/alcancias/alcancias3.jpg", available:true, visible:true, sortOrder:3 },
  { id:"R001", code:"R001", name:"Virgen María en Relieve", category:"Relieves", size:"30 cm", description:"Figura decorativa con acabado artesanal.", price:40, image:"img/relieves/relieves1.jpg", available:true, visible:true, sortOrder:4 },
  { id:"R002", code:"R002", name:"La Última Cena", category:"Relieves", size:"40 cm", description:"Relieve decorativo para hogares y espacios especiales.", price:60, image:"img/relieves/relieves2.jpg", available:true, visible:true, sortOrder:5 },
  { id:"R003", code:"R003", name:"Diseño Floral en Relieve", category:"Relieves", size:"25 cm", description:"Decoración artesanal con detalles hechos a mano.", price:45, image:"img/relieves/relieves3.jpg", available:true, visible:true, sortOrder:6 },
  { id:"P001", code:"P001", name:"Charizard Papercraft", category:"Papercraft", size:"30 cm", description:"Modelo 3D elaborado en papel para colección.", price:35, image:"img/papercraft/charizar.jpg", available:true, visible:true, sortOrder:7 },
  { id:"P002", code:"P002", name:"Charmilio Papercraft", category:"Papercraft", size:"25 cm", description:"Figura 3D en papel para coleccionistas.", price:30, image:"img/papercraft/charmilio.jpg", available:true, visible:true, sortOrder:8 },
  { id:"P003", code:"P003", name:"Pikacho Papercraft", category:"Papercraft", size:"20 cm", description:"Modelo decorativo en papel perfecto para regalos.", price:25, image:"img/papercraft/pikacho.jpg", available:true, visible:true, sortOrder:9 }
];

let products = fallbackProducts;
let selectedCategory = "Todos";
const grid = document.querySelector("#productGrid");
const notice = document.querySelector("#catalogNotice");
const search = document.querySelector("#searchInput");

function renderProducts() {
  const term = search.value.trim().toLowerCase();
  const filtered = products.filter((item) => item.visible !== false && (selectedCategory === "Todos" || item.category === selectedCategory) && `${item.name} ${item.code}`.toLowerCase().includes(term));
  grid.innerHTML = filtered.map((item) => `
    <article class="product-card">
      <div class="product-image"><img src="${item.image}" alt="${item.name}"><span class="code">${item.code}</span>${item.available ? "" : '<span class="sold-out">Agotado</span>'}</div>
      <div class="product-info"><span class="category">${item.category} · ${item.size || ""}</span><h3>${item.name}</h3><p>${item.description || ""}</p><div class="product-bottom"><strong>S/ ${Number(item.price).toFixed(2)}</strong><a href="https://wa.me/51937344997?text=${encodeURIComponent(`Hola, quiero consultar por ${item.name} (${item.code})`)}" target="_blank" rel="noreferrer">Pedir por WhatsApp</a></div></div>
    </article>`).join("");
  notice.textContent = filtered.length ? `${filtered.length} producto${filtered.length === 1 ? "" : "s"}` : "No se encontraron productos.";
}

document.querySelectorAll("#categoryTabs button").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll("#categoryTabs button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active"); selectedCategory = button.dataset.category; renderProducts();
}));
search.addEventListener("input", renderProducts);
document.querySelector("#menuButton").addEventListener("click", () => document.querySelector("#menu").classList.toggle("open"));

renderProducts();
subscribeProducts((firebaseProducts) => { if (firebaseProducts.length) products = firebaseProducts; renderProducts(); }, () => { notice.textContent = "Mostrando catálogo inicial. Firebase está pendiente de configuración."; });
subscribeAppearance((appearance) => {
  if (appearance.logo) document.querySelectorAll("[data-site-logo]").forEach((image) => { image.src = appearance.logo; });
  if (appearance.hero) document.querySelector("#heroImage").src = appearance.hero;
});
