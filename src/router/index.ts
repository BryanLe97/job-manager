// create router login, list, create, update vue 3
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import List from '@/views/jobs-manager/List.vue'
import Detail from '@/views/jobs-manager/component/Detail.vue'


const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/list',
        name: 'List',
        component: List,
    },
    {
        path: '/Create',
        name: 'Create',
        component: Detail
    },
    {
        path: '/update/:id',
        name: 'Update',
        component: Detail
    }
]

export const  router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

