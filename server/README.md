# Trullo

## Innehållsförteckning
- [Resonemang](#resonemang)
- [Teknologier](#teknologier)
- [Installation](#installation)
  - [Förutsättningar](#förutsättningar)
  - [Klona repot](#klona-repot)
  - [Installera beroenden](#installera-beroenden)
  - [Konfigurera miljövariabler](#konfigurera-miljövariabler)
  - [Starta servern](#starta-servern)
- [API Reference](#api-reference)
  - [Användarhantering](#användarhantering)
    - [Registrera användare](#registrera-användare)
    - [Logga in användare](#logga-in-användare)
    - [Logga ut användare](#logga-ut-användare)
    - [Hämta alla användare](#hämta-alla-användare)
    - [Uppdatera användare](#uppdatera-användare)
    - [Ta bort användare](#ta-bort-användare)
  - [Projekthantering](#projekthantering)
    - [Skapa projekt](#skapa-projekt)
    - [Hämta alla projekt](#hämta-alla-projekt)
    - [Hämta specifikt projekt](#hämta-specifikt-projekt)
    - [Uppdatera projekt](#uppdatera-projekt)
    - [Ta bort projekt](#ta-bort-projekt)
  - [Uppgiftshantering](#uppgiftshantering)
    - [Skapa uppgift](#skapa-uppgift)
    - [Hämta alla uppgifter](#hämta-alla-uppgifter)
    - [Tilldela uppgift](#tilldela-uppgift)
    - [Uppdatera uppgift](#uppdatera-uppgift)
    - [Ta bort uppgift](#ta-bort-uppgift)

Trullo är en kanban-API byggd med Express och MongoDB. Den är designad för att hantera projekt, uppgifter och användare genom ett RESTful API.

## Resonemang

Jag valde att använda MongoDB istället för SQL för Trullo på grund av flera anledningar. MongoDB är en NoSQL-databas, vilket betyder att det inte använder sig av traditionella tabeller med rader och kolumner för att lagra data. Detta ger MongoDB en flexibilitet att hantera stora mängder data med varierande struktur, vilket är användbart för Trullo eftersom projekten kan ha olika typer av uppgifter med olika strukturer.

En annan anledning var att MongoDB är designat för att hantera stora mängder data med hög prestanda, vilket är viktigt för Trullo eftersom systemet kan ha många projekt med många uppgifter. MongoDB:s skalbarhet och prestanda gör det möjligt för Trullo att hantera ett stort antal användare och projekt samtidigt.

## Teknologier

-   **Backend**: Node.js, Express, MongoDB
-   **Verktyg**: ESLint, Prettier

## Installation

### Förutsättningar

Se till att du har följande installerat:

-   Node.js
-   npm eller yarn
-   MongoDB

### Klona repot

```bash
git clone https://github.com/dens0n/Trullo-backend.git
cd trullo/server
```

### Installera beroenden

```bash
npm install
```

### Konfigurera miljövariabler

Skapa en `.env`-fil i `server`-mappen och lägg till följande:

```env
DB_URI=din_mongodb_uri
JWT_SECRET=din_hemliga_nyckel
PORT=3000
```

### Starta servern

```bash
npm run dev
```

# API Reference

För att enklare testa endpointsen så kan man importera "Project Management API.postman_collection.json" filen till postman

## Användarhantering

### Registrera användare

```http
POST http://localhost:3000/api/signup
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
}
```

### Logga in användare

```http
POST http://localhost:3000/api/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

### Logga ut användare

```http
POST http://localhost:3000/api/logout
```

### Hämta alla användare

```http
GET http://localhost:3000/api/users
```

### Uppdatera användare

```http
PATCH http://localhost:3000/api/users/${userId}
Content-Type: application/json

{
    "email": "nyemail@example.com"
}
```

### Ta bort användare

```http
DELETE http://localhost:3000/api/users/${userId}
```

## Projekthantering

### Skapa projekt

```http
POST http://localhost:3000/api/projects
Content-Type: application/json

{
    "name": "Mitt Projekt"
}
```

### Hämta alla projekt

```http
GET http://localhost:3000/api/projects
```

### Hämta specifikt projekt

```http
GET http://localhost:3000/api/projects/${projectId}
```

### Uppdatera projekt

```http
PATCH http://localhost:3000/api/projects/${projectId}
Content-Type: application/json

{
    "name": "Uppdaterat Projektnamn"
}
```

### Ta bort projekt

```http
DELETE http://localhost:3000/api/projects/${projectId}
```

## Uppgiftshantering

### Skapa uppgift

```http
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
    "title": "Min Uppgift",
    "description": "Uppgiftsbeskrivning",
    "projectId": "projektId",
    "finishedBy": "2024-12-31"
}
```

### Hämta alla uppgifter

```http
GET http://localhost:3000/api/tasks
```

### Tilldela uppgift

```http
PATCH http://localhost:3000/api/tasks/${taskId}/assign/${userId}
```

### Uppdatera uppgift

```http
PATCH http://localhost:3000/api/tasks/${taskId}
Content-Type: application/json

{
    "status": "in progress"
}
```

### Ta bort uppgift

```http
DELETE http://localhost:3000/api/tasks/${taskId}
```
