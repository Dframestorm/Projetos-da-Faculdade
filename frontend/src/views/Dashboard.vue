<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="logo"><h2>Clínica Médica</h2></div>
      <div class="user-menu">
        <span>Olá, <strong>{{ userName }}</strong></span>
        <button @click="logout" class="logout-btn">Sair</button>
      </div>
    </header>

    <main class="dashboard-content">
      <section class="main-panel">
        <div class="panel-header">
          <h3>Meus Agendamentos</h3>
          <router-link to="/schedule" class="btn-schedule">+ Nova Consulta</router-link>
        </div>

        <div v-if="isLoading" class="loading">Carregando consultas...</div>

        <div v-else-if="appointments.length > 0" class="table-container">
  <table>
    <thead>
      <tr>
        <th>Data e Hora</th>
        <th>Status</th>
        <th>Previsão do Tempo</th>
        <th>Observações</th>
        <th>Ações</th> </tr>
    </thead>
    <tbody>
      <tr v-for="app in appointments" :key="app._id">
        <td>{{ formatDate(app.date) }}</td>
        <td>
          <span :class="['status-badge', app.status.toLowerCase()]">
            {{ formatStatus(app.status) }}
          </span>
        </td>
        <td>
          <span :class="{'weather-alert': app.weatherForecast?.willRain}">
            {{ app.weatherForecast?.condition || 'Sem dados' }}
            {{ app.weatherForecast?.willRain ? '⚠️' : '☀️' }}
          </span>
        </td>
        <td>{{ app.notes || '-' }}</td>
        <td>
          <button
            v-if="app.status === 'scheduled'" 
            @click="cancelAppointment(app._id)" 
            class="btn-cancel-inline"
          >
            Cancelar
          </button>
        </td>
      </tr>
    </tbody>
  </table> </div>

        <div v-else class="placeholder-card">
          <p>Você ainda não possui agendamentos marcados.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const cancelAppointment = async (id) => {
  if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;

  try {
    await api.patch(`/appointments/${id}/cancel`);
    // Atualiza a lista localmente para refletir a mudança sem recarregar a página
    const index = appointments.value.findIndex(a => a._id === id);
    if (index !== -1) {
      appointments.value[index].status = 'cancelled';
    }
    alert('Consulta cancelada com sucesso.');
  } catch (error) {
    alert('Erro ao cancelar consulta.');
  }
};

const formatStatus = (status) => {
  const statusMap = {
    'scheduled': 'Agendado',
    'completed': 'Concluído',
    'cancelled': 'Cancelado'
  };
  return statusMap[status.toLowerCase()] || status;
};

const router = useRouter();
const userName = ref('');
const appointments = ref([]);
const isLoading = ref(true);

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const fetchAppointments = async () => {
  try {
    const response = await api.get('/appointments');
    appointments.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const userString = localStorage.getItem('clinica_user');
  if (!userString) {
    router.push('/login');
    return;
  }
  userName.value = JSON.parse(userString).name;
  fetchAppointments();
});

const logout = () => {
  localStorage.clear();
  router.push('/login');
};
</script>

<style scoped>
/* Layout Geral */
.dashboard-container {
  min-height: 100vh;
  background-color: #f4f7f6; /* Um cinza bem clarinho para o fundo */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Cabeçalho Superior */
.dashboard-header {
  background-color: #ffffff;
  padding: 1rem 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo h2 {
  color: #2c3e50;
  margin: 0;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

/* Conteúdo Principal */
.dashboard-content {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.main-panel {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #f4f7f6;
  padding-bottom: 15px;
}

.panel-header h3 {
  margin: 0;
  color: #34495e;
  font-size: 1.5rem;
}

/* Botão Nova Consulta */
.btn-schedule {
  background-color: #3498db;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-schedule:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

/* Tabela Profissional */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th {
  background-color: #f8f9fa;
  color: #7f8c8d;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
  padding: 15px;
  text-align: left;
}

td {
  padding: 18px 15px;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

tr:hover {
  background-color: #fdfdfd;
}

/* Badges e Clima */
.status-badge {
  background-color: #e8f8f5;
  color: #1abc9c;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
}

.weather-alert {
  color: #d35400;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Loading e Placeholder */
.loading, .placeholder-card {
  text-align: center;
  padding: 50px;
  color: #95a5a6;
}

.btn-cancel-inline {
  background-color: #ff7675;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.3s;
}

.btn-cancel-inline:hover {
  background-color: #d63031;
}

/* Garanta que o status cancelado tenha a cor vermelha no CSS anterior */
.status-badge.cancelled {
  background-color: #fdecea;
  color: #e74c3c;
}
</style>