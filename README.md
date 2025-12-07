# AcuaKel - Frontend 🐠

Frontend del proyecto **AcuaKel**, construido con **React + TypeScript + Vite**, orientado al comercio y gestión de productos de acuarismo.

---

## 📂 Estructura del Proyecto

```
frontend/
├── node_modules
├── public
├── src
│   ├── common        # Hooks, tipos y componentes reutilizables
│   ├── componentes    # Componentes visuales y páginas
│   ├── i18n           # Internacionalización (es, en)
│   ├── modulos        # UI modals, QRs, Header, etc.
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Requisitos Previos

- **Node.js** (v18 o superior recomendado)
- **npm**
- **Git**

Verifica con:
```bash
node -v
npm -v
git --version
```

---

## 🚀 Instalación del Proyecto

### 1️⃣ Clonar el repositorio desde GitHub

```bash
git clone https://github.com/KelviCalle20/acuakel_backend.git
```

Luego entra a la carpeta del frontend:

```bash
cd frontend
```

### 2️⃣ Instalar dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
```

Esto instalará automáticamente **todas las dependencias y dependencias de desarrollo** definidas en tu `package.json`.

---

### 📦 Instalación manual (solo si es necesario)

Si por algún motivo necesitas instalar los paquetes manualmente, puedes usar:

#### Dependencias Principales

```bash
npm install axios file-saver i18next i18next-browser-languagedetector i18next-http-backend jspdf jspdf-autotable md5 react react-dom react-i18next react-icons react-router-dom recharts xlsx

```

#### Dependencias de Desarrollo

```bash
npm install -D @eslint/js @types/file-saver @types/md5 @types/react @types/react-dom @vitejs/plugin-react autoprefixer baseline-browser-mapping eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals postcss tailwindcss typescript typescript-eslint vite

```
### 3️⃣ Configurar proxy y variables de entorno

Si deseas acceder al backend desde otros dispositivos de la misma red, configura el proxy en:

```bash
vite.config.ts
```

Ejemplo:
```env
server: {
  host: true, // permite acceso desde celular
  proxy: {
    "/api": {
      target: "http://192.168.1.2:4000",
      changeOrigin: true,
      secure: false,
    },
  },
},

```
⚠️ Cambia la IP a la de tu PC donde corre el backend.

---

###  4️⃣ Configurar variables de entorno

Si el frontend requiere variables de entorno (como la URL del backend), crear un archivo `.env`:

```bash
#=======Ruta de la media del backend=======
VITE_MEDIA_URL=http://192.168.1.2:4000/media #poner la IP de su internet

```

> Cambia la IP por la de tu máquina en la red local para que otros dispositivos puedan acceder y la carpeta assets descompromirlo y darle la ruta correspondiente para que lea los medios.

---

## ⚡ Levantar la aplicación

Modo desarrollo:
```bash
npm run dev
```
- Accesible en `http://localhost:5173` y desde otros dispositivos en la misma red gracias a `vite.config.ts` (`host: true`).

Modo producción:
```bash
npm run build
npm run preview
```

> El proxy configurado en `vite.config.ts` asegura que `/api` apunte al backend, ajustando la IP según tu red.

---

### 🛠️ Scripts Disponibles


```env
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}

```
### 5️⃣ Tecnologias usadas

```bash
    React
    TypeScript
    Vite
    TailwindCSS
    Axios
    i18next
    React Router DOM
    Recharts
    jsPDF
    xlsx
```


### 6️⃣ Compilar el proyecto (opcional)

Si deseas compilar TypeScript a JavaScript:

```bash
npm run build
```


## 🌐 Funcionalidades Principales

- **Páginas de usuario:** Login, Registro, Home, Carrito, Productos
- **Páginas de administrador:** Admin, Estadísticas, Gestión de usuarios, roles, productos y categorías
- **Modals UI:** Categoría, Producto, Usuario, Descripción, Pago
- **Internacionalización:** Español (`es`) y Inglés (`en`)
- **Protección de rutas:** `ProtectedRoute` para páginas privadas
- **Hooks personalizados:** `useAuth` para manejar autenticación
- **Audio/Video:** Player integrado y multimedia en `src/componentes/AudioPlayer.tsx`

---
---
## 📌 Notas importantes

- Verificar que el **backend esté corriendo** antes de usar el frontend y que `VITE_API_URL` apunte correctamente a él.
- Mantener sincronizados los **endpoints** con los cambios del backend.
- Para acceso desde celular u otros dispositivos en la misma red, ajustar la IP en `vite.config.ts` y `.env`.
- Las imagenes mas importantes estan en el: `src/componentes/assets/` y deben respetar las rutas.
- Para desarrollo rápido, `npm run dev` recarga automáticamente los cambios.

---

✅ **Frontend listo para desarrollo y producción, totalmente compatible con el backend de AcuaKel, incluyendo acceso desde red local.**

