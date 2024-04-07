<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { reactive } from 'vue'

const auth = useAuthStore()
const loginInput = reactive({
	username: '',
	password: '',
})

auth.isLoggedIn()

const login = async () => {
	try {
		await auth.login(loginInput)
	} catch (error) {}
}
</script>

<template>
	<div>
		<h1>Đăng nhập</h1>
		<form @submit.prevent="login">
			<label for="username">Email/Username</label>
			<input
				type="text"
				id="username"
				v-model="loginInput.username"
				placeholder="Nhập email hoặc tên đăng nhập"
				required
				:disabled="auth.isLoading"
			/>
			<label for="password">Password</label>
			<input
				type="password"
				id="password"
				v-model="loginInput.password"
				placeholder="Nhập mật khẩu"
				required
				:disabled="auth.isLoading"
			/>
			<button type="submit" :disabled="auth.isLoading">Đăng nhập</button>
		</form>
	</div>
</template>

<style scoped>
label {
	display: block;
	font-size: 0.8rem;
	text-align: left;
	font-weight: bold;
	margin: 0 5px;
}
h1 {
	text-align: center;
}
form {
	display: flex;
	flex-direction: column;
	border: 1px solid #ccc;
	padding: 20px;
}
input {
	padding: 10px;
	margin: 0 5px 10px 5px;
	width: 300px;
	border: 1px solid #ccc;
	border-radius: 5px;
}
button {
	width: 200px;
	margin: 10px auto;
	border: 1px solid #ccc;
	border-radius: 5px;
	background-color: #007bff;
	color: white;
	cursor: pointer;
}
button:hover {
	background-color: #0056b3;
}

@media (max-width: 768px) {
	input {
		width: 100%;
	}
	button {
		width: 100%;
	}
}
</style>
