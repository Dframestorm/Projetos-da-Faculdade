const mongoose = require ('mongoose');

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum:['admin', 'doctor', 'patient'],
        default: 'patient'
    },
    address: {
        cep: { type: String},
        street: { type: String},
        neighborhood: { type: String},
        city: { type: String},
        state: { type: String},
        
    }
}, {
    timestamps: true // Adicioona campos de createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('User', userSchema);