// src/router/index.ts

import {createRouter, createWebHashHistory} from 'vue-router';
import NewJourney from '@/views/NewJourneyView.vue';
import Main from '@/views/MainView.vue';
import Login from '@/views/LoginView.vue';
import Settings from '@/views/SettingsView.vue'
import SignUp from '@/views/SignUpView.vue';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignUp
        },
        {
            path: '/newjourney',
            name: 'newjourney',
            component: NewJourney,
            meta: {requiresAuth: true}
        },
        {
            path: '/main',
            name: 'main',
            component: Main,
            meta: {requiresAuth: true}
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings,
            meta: {requiresAuth: true}
        }
    ]
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('UUID');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({name: 'login'});
    } else {
        next();
    }
});

export default router;
