import { defineStore } from 'pinia';
import {router} from '@/router' 

export const useAuthStore = defineStore({
    id: 'auth',

    state: () => ({
        user: null as any | null,
        expiry: null as any | null,
        isLoading: false as boolean,
    }),

    getters: {
        
        isLoginExpired(): boolean {
            return Date.now() > Number(localStorage.getItem('expiry'));
        }
    },

    actions: {
        async login(user: any) {
            try {
                this.isLoading = true;
                const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.user = data.user;
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('expiry', String(Date.now() + 3600 * 1000));
                    router.push({ name: 'List' });
                } else {
                    console.error('Login failed');
                }
            } catch (error) {
                console.error('Network error');
            } finally {
                this.isLoading = false;
            }
        },

        isLoggedIn() {
            const token = localStorage.getItem('user');
            if (token) {
                router.push('/list')
            }
        },

        logout() {
            this.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('expiry');
            router.push('/')
        },
    },
});