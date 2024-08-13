// src/router/index.ts

import {createRouter, createWebHistory} from 'vue-router';
import NewJourney from '@/views/NewJourney.vue';
import Main from '@/views/Main.vue';
import Login from '@/views/Login.vue';
import Settings from '@/views/Settings.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
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
/*        {
            path: '/signup',
            name: 'signup',
            component: SignUp
        },*/
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
