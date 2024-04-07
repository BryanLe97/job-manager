// create router login, list, create, update vue 3
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import List from '@/views/jobs-manager/List.vue'

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
        children: [
            {
                path: '/create',
                name: 'Create',
                redirect: '/list'
            },
            {
                path: '/update/:id',
                name: 'Update',
                redirect: '/list'
            }
        ]
    },
]

export const  router = createRouter({
    history: createWebHistory(),
    routes
})

