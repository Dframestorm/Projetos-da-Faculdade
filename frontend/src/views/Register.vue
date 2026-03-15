<template>
  <div class="register-container">
    <form @submit.prevent="registerUser" class="register-form">
      <h2>Cadastro na Clínica</h2>
      
      <div v-if="errorMessage" class="error-msg">
        {{ errorMessage }}
      </div>

      <div class="form-group">
        <label>Nome Completo</label>
        <input v-model="form.name" type="text" required placeholder="Ex: Anna Clara" />
      </div>

      <div class="form-group">
        <label>E-mail</label>
        <input v-model="form.email" type="email" required placeholder="seu-email@email.com" />
      </div>

      <div class="form-group">
        <label>Senha</label>
        <input v-model="form.password" type="password" required placeholder="Crie uma senha forte" />
      </div>

      <div class="form-group">
        <label>Tipo de Usuário</label>
        <select v-model="form.role">
          <option value="patient">Paciente</option>
          <option value="secretary">Secretário(a)</option>
        </select>
      </div>

      <fieldset>
        <legend>Endereço</legend>
        
        <div class="form-group">
          <label>CEP</label>
          <input v-model="form.address.cep" @blur="fetchCep" type="text" placeholder="Apenas números" maxlength="9" />
        </div>

        <div class="form-group">
          <label>Rua/Avenida</label>
          <input v-model="form.address.street" type="text" />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>Bairro</label>
            <input v-model="form.address.neighborhood" type="text" />
          </div>
          
          <div class="form-group half">
            <label>Cidade</label>
            <input v-model="form.address.city" type="text" />
          </div>
          
          <div class="form-group half">
            <label>Estado</label>
            <input v-model="form.address.state" type="text" maxlength="2" />
          </div>
        </div>
      </fieldset>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Cadastrando...' : 'Criar Conta' }}
      </button>

      <p class="login-link">
        Já tem uma conta? <router-link to="/login">Faça Login</router-link>
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

// Objeto reativo para guardar os dados do formulário
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'patient',
  address: {
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: ''
  }
});

// Função para buscar o CEP na API pública ViaCEP
const fetchCep = async () => {
  // Remove tudo que não for número
  const cepStr = form.address.cep.replace(/\D/g, ''); 
  
  if (cepStr.length === 8) {
    try {
      // Fetch nativo para não interferir na configuração do Axios
      const response = await fetch(`https://viacep.com.br/ws/${cepStr}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        // Preenche os campos automaticamente e de forma reativa
        form.address.street = data.logradouro;
        form.address.neighborhood = data.bairro;
        form.address.city = data.localidade;
        form.address.state = data.uf;
      } else {
        alert('CEP não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
    }
  }
};

// Função para enviar os dados para o backend Node.js
const registerUser = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    await api.post('/auth/register', form);
    
    alert('Cadastro realizado com sucesso!');
    router.push('/login'); // Redireciona para a tela de login
  } catch (error) {
    // Pega a mensagem de erro lá no backend
    errorMessage.value = error.response?.data?.message || 'Erro ao tentar cadastrar. Verifique os dados.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.register-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
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

.form-row {
  display: flex;
  gap: 10px;
}

.half {
  flex: 1;
}

fieldset {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
}

legend {
  font-weight: bold;
  color: #555;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 0.9em;
  color: #555;
}

input, select {
  width: 100%;;
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

.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9em;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: bold;
}
</style>