<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import { useRoute } from 'vue-router'

const initCreateForm = {
	title: '',
	description: '',
	deadline: '',
}

const createForm = ref({ ...initCreateForm })

const route = useRoute()
const id = +route.params.id
const jobsStore = useJobsStore()

onMounted(async () => {
	if (!id) return
	await jobsStore.getJobDetail(id)
	createForm.value = jobsStore.jobs.filter((job) => job.id === id)[0]
})

const handleSubmit = async () => {
	try {
		if (!id) {
			await jobsStore.createNewJob(createForm.value)
		} else {
			await jobsStore.updateJobById(id, createForm.value)
		}
	} catch (error) {
		alert('Có lỗi xảy ra')
	} finally {
		if (!id) createForm.value = initCreateForm
		alert(`${id ? 'Lưu' : 'Thêm'} công việc mới thành công`)
	}
}
</script>

<template>
	<div class="form-container">
		<h1>Thêm công việc mới</h1>
		<form @submit.prevent="handleSubmit">
			<div class="form-group d-flex justify-content-between">
				<label for="title">Tiêu đề:</label>
				<input
					id="title"
					v-model="createForm.title"
					type="text"
					required
					:disabled="jobsStore.isLoading"
				/>
			</div>
			<div class="form-group d-flex justify-content-between">
				<label for="description">Mô tả:</label>
				<input
					id="description"
					v-model="createForm.description"
					type="textarea"
					required
					:disabled="jobsStore.isLoading"
				/>
			</div>
			<div class="form-group d-flex justify-content-between">
				<label for="deadline">Deadline:</label>
				<input
					id="deadline"
					v-model="createForm.deadline"
					type="text"
					required
					:disabled="jobsStore.isLoading"
				/>
			</div>
			<button
				type="submit"
				class="submit-button"
				:disabled="jobsStore.isLoading"
			>
				{{ id ? 'Lưu' : 'Thêm mới' }}
			</button>
		</form>
	</div>
</template>

<style scoped>
.form-container {
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
}

.form-group {
	margin-bottom: 20px;
}

.submit-button {
	background-color: #4caf50; /* Green */
	border: none;
	color: white;
	padding: 15px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 16px;
	margin: 4px 2px;
	cursor: pointer;
}
</style>
