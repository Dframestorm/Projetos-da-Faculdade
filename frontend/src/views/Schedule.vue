<template>
  <div class="schedule-container">
    <form @submit.prevent="handleSchedule" class="schedule-form">
      <h2>Agendar Consulta</h2>
      
      <div v-if="message" :class="['alert', messageType]">
        {{ message }}
      </div>

      <div class="form-group">
        <label>Data e Horário</label>
        <input 
          v-model="appointment.date" 
          type="datetime-local" 
          required 
          :min="minDate"
        />
        <small>Consultas têm duração padrão de 1 hora.</small>
      </div>

      <div class="form-group">
        <label>Observações / Sintomas (Opcional)</label>
        <textarea 
          v-model="appointment.notes" 
          placeholder="Conte resumidamente o motivo da consulta..."
          rows="4"
        ></textarea>
      </div>

      <div class="actions">
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Processando...' : 'Confirmar Agendamento' }}
        </button>
        <router-link to="/dashboard" class="btn-cancel">Voltar</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const isLoading = ref(false);
const message = ref('');
const messageType = ref(''); // 'successo' ou 'erro'
const minDate = ref('');

const appointment = reactive({
  date: '',
  notes: ''
});

// Impede agendamentos no passado
onMounted(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  minDate.value = now.toISOString().slice(0, 16);
});

const handleSchedule = async () => {
  isLoading.value = true;
  message.value = '';

  try {
    const response = await api.post('/appointments', appointment);
    
    messageType.value = 'success';
    // Se o backend retornou alerta de chuva, é mostrado aqui!
    message.value = response.data.alert 
      ? `Sucesso! ${response.data.alert}` 
      : 'Consulta agendada com sucesso!';

    // Limpa o formulário após 2 segundos e volta ao dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Erro ao agendar consulta.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.schedule-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.schedule-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #2c3e50;
}

input, textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

small {
  color: #7f8c8d;
  margin-top: 5px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  background-color: #3498db;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #2980b9;
}

.btn-cancel {
  text-align: center;
  text-decoration: none;
  color: #95a5a6;
  font-size: 0.9rem;
}

.alert {
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>