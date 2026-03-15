import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importa o arquivo index.js do diretório router

const app = createApp(App)

app.use(router) // Registra o roteador na aplicação Vue
app.mount('#app')