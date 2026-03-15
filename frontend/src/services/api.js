import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Este código roda ANTES de cada requisição sair do seu navegador para o backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clinica_token');
  
  if (token) {
    // Adiciona o token no formato padrão de mercado (Bearer)
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;