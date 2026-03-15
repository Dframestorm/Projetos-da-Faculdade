const mongoose = require('mongoose');

// Função para conectar ao MongoDB
const connectDB = async () => {
    try {
        // Conectando ao MongoDB usando a URL do ambiente
        const conn = await mongoose.connect(process.env.MONGO_URI,);
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
        // Encerrando o processo em caso de erro
        // O process.exit(1) é usado para indiciar que o processo terminou com um erro
        process.exit(1);
    }
};

module.exports = connectDB;