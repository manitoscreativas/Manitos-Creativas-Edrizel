# Manitos Creativas Edrizel

Catálogo web adaptable para computadora y celular, publicado mediante GitHub Pages y administrado con Firebase.

## Funciones

- Catálogo público con búsqueda y categorías.
- Pedidos por WhatsApp al +51 937 344 997.
- Inicio de sesión exclusivo para `manitoscreativas154@gmail.com`.
- Agregar, modificar, ocultar, agotar y eliminar productos.
- Carga de fotografías desde celular o computadora.
- Impresión del catálogo físico A4, completa o por categoría.

## Publicación en GitHub Pages

1. Subir estos archivos a la raíz de la rama `main` del repositorio.
2. Abrir **Settings → Pages**.
3. Elegir **Deploy from a branch**, rama `main` y carpeta `/(root)`.
4. Guardar y esperar a que GitHub publique el sitio.
5. En Firebase abrir **Authentication → Configuración → Dominios autorizados**.
6. Agregar el dominio `manitoscreativas.github.io`.

Dirección prevista: `https://manitoscreativas.github.io/Manitos-Creativas-Edrizel/`

Firebase ya está conectado en `js/firebase-config.js`. Authentication, el usuario administrador, Firestore y sus reglas también deben permanecer habilitados.

Las fotografías nuevas se reducen automáticamente y se guardan en Firestore para mantener el proyecto dentro del plan gratuito Spark. Cada producto usa una sola imagen optimizada.

La configuración web de Firebase identifica el proyecto, pero nunca deben guardarse contraseñas, cuentas de servicio ni claves privadas en este repositorio público.
