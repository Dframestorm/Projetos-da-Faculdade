# Sistema de Agendamento - Clínica Médica

Sistema full-stack  para gestão de consulta médicas com integração de previsão de tempo em tempo real.

## Tecnologias Utilizadas

### Backend
* **Node.js** com **Express**
* **MongoDB** (Banco de dados no SQL)
* **Mongoose** (Modelagem de dados)
* **JWT** (Autenticação Segura)
* **Bcryptjs** (Criptografia de Senhas)
* **Aixos** (Integração com API OpenWeather)

### Frontend
* **Vue.js 3** (Composition API)
* **Vite** (Build tool rápida)
* **Vue Router** (Navegação SPA)
* **Aixos** (Consumo da API interna)

## Como Rodar o Projeto Localmente

### Pré-Requisitos
* Node.js instalado
* MongoDB rodando localmente (ou MongoDB Atlas)
* Chave de API da [OpenWeatherMap](https://openweathermap.org/)

### Passo 1: Configurar o Backend
1. Entre na pasta `backend`: `cd backend`
2. Instale as dependencias: `npm install` 
3. Crie um arquivo `.env` e preencha com:
    ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/clinica
   JWT_SECRET=sua_chave_secreta_aqui
   WEATHER_API_KEY=sua_chave_da_openweather
4. Inicie o Servidor: npm run dev

### Passo 2: Configurar o frontend
1. Entre na pasta frontend: cd frontend
2. Instale as dependências: npm install
3. Inicie o projeto: npm run dev
4. Acesse o navegador: http://localhost:5173

