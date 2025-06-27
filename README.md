# Chef On Demand - Backend

Benvenuto nel progetto **Chef On Demand**, una piattaforma completa che consente agli chef di creare menu personalizzati, gestire piatti, ricevere richieste e interagire con i clienti. Questo repository contiene il backend dell’applicazione.

## 🚀 Tecnologie utilizzate

- Node.js + Express
- Prisma ORM + MySQL
- JWT Authentication
- Nodemailer per email (con Gmail)
- Google Maps API (per la parte frontend)
- CORS + dotenv + bcrypt + multer + zod

---

## 📦 Installazione

### 1. Clona il repository

```bash
git clone https://github.com/Stefan3l/chef-on-demand.git
cd chef-on-demand
```

### 2. Installa le dipendenze

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

## 🔑 Configurazione `.env`

### Backend (`server/.env`)

Crea un file `.env` nella cartella `server/` con questo contenuto:

```
PORT=3000
JWT_SECRET=laTuaChiaveSuperSegreta
DATABASE_URL="mysql://user:password@host:port/database"
EMAIL_USER=tuo.email@gmail.com
EMAIL_PASS=laTuaPasswordDaApp
```

Oppure usa `.env.example` come riferimento.

### Frontend (`client/.env`)

```
VITE_GOOGLE_MAPS_API_KEY=laTuaAPIKeyGoogle
VITE_API_URL=http://localhost:3000
```

---

## ▶️ Avvio del progetto

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

---

## 📂 Struttura delle cartelle principali

```
/server
  /controllers
  /middlewares
  /routes
  /prisma
  index.js
  .env
/client
  /components
  /pages
  /context
  App.jsx
  main.jsx
```

---

## 🧪 Test

Puoi testare le API usando Postman o Insomnia. Le rotte sono protette con JWT e richiedono autenticazione.

---

## 👨‍🍳 Autore

Sviluppato da Mihăilă Ștefănel – test tecnico Full Stack Developer – progetto **Chef On Demand**.
