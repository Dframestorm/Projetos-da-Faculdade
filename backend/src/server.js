require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 1. Importar as rotas
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// 2. INICIALIZAR o app
const app = express();

// 3. Conectar ao Banco de Dados
connectDB();

// 4. Middlewares Globais
app.use(cors());
app.use(express.json());

// 5. Configurar as Rotas
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Rota de teste
app.get('/api', (req, res) => {
  res.json({ message: 'API da Clínica Médica rodando com sucesso!' });
});

// 6. Iniciar o Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});