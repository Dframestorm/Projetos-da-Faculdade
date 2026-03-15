import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/', // Rota raiz
        redirect: '/login' // Redireciona para a página de login
    },
    {
        path: '/login',
        name: 'Login',
        // Lazy Loading: Carrega o componente apenas quando a rota for acessada
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'    )
    },
    {
        path: '/schedule',
        name: 'Schedule',
        component: () => import('../views/Schedule.vue')
    }

];

const router = createRouter({
    history: createWebHistory(), // Usa o modo de histórico do HTML5
    routes
});

export default router;