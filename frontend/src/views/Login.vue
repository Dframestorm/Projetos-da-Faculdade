verifi<template>
  <div class="login-container">
    <form @submit.prevent="loginUser" class="login-form">
      <h2>Iniciar Sessão</h2>
      
      <div v-if="errorMessage" class="error-msg">
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label>E-mail</label>
        <input v-model="form.email" type="email" required placeholder="seu-email@email.com" />
      </div>

      <div class="form-group">
        <label>Palavra-passe</label>
        <input v-model="form.password" type="password" required placeholder="Insira sua senha" />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Verificando...' : 'Entrar' }}
      </button>

      <p class="register-link">
        Ainda não tem conta? <router-link to="/register">Faça o seu registo</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const isLoading = ref(false);
const errorMessage = ref('');

// Estado reativo para os dados de login
const form = reactive({
  email: '',
  password: ''
});

// Função para enviar as credenciais para o backend
const loginUser = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    // Faz o POST para a rota de login Node.js
    const response = await api.post('/auth/login', form);
    
    // O backend deve retornar um token JWT e os dados do utilizador
    const { token, user } = response.data;
    
    // Guarda o token e os dados do utilizador no localStorage para manter a sessão
    localStorage.setItem('clinica_token', token);
    localStorage.setItem('clinica_user', JSON.stringify(user));
    
    // Redireciona o utilizador para o painel principal
    router.push('/dashboard');
    
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao iniciar sessão. Verifique as suas credenciais.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 0.9em;
  color: #555;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

button:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.error-msg {
  background-color: #ffdddd;
  color: #d8000c;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9em;
}

.register-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: bold;
}
</style>