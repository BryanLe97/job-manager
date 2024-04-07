<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

if (auth.isLoginExpired) {
	auth.logout()
}
</script>

<template>
	<router-view />
</template>

<style scoped></style>
