<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJobsStore, Job, status, by } from '@/stores/jobs'
import { router } from '@/router'

const jobsStore = useJobsStore()
const jobs = ref<Job[]>([])
const perPage = 6
const currentPage = ref(1)
const params = {
	by: by.created,
	keyword: '',
	status: status.all,
}

const totalPages = computed(() => Math.ceil(jobs.value.length / perPage))
const paginatedJobs = computed(() => {
	const start = (currentPage.value - 1) * perPage
	const end = start + perPage
	return jobs.value.slice(start, end)
})

onMounted(async () => {
	await fetchList()
})

const getStatus = (status: number) => {
	switch (status) {
		case 0:
			return 'Chưa Hoàn Thành'
		case 1:
			return 'Hoàn Thành'
		default:
			return 'Không xác định'
	}
}

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++
	}
}

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--
	}
}

const goToPage = (page: number) => {
	currentPage.value = page
}

const fetchList = async () => {
	try {
		const response = ref<Job[]>([])
		await jobsStore.fetchJobs(params)
		if (params.keyword.length > 0) {
			response.value = jobsStore.jobs.filter((job: Job) => {
				job.title.includes(params.keyword)
			})
		} else if (params.status != -1) {
			response.value = jobsStore.jobs.filter(
				(job: Job) => job.status == params.status
			)
		} else {
			response.value = jobsStore.jobs
		}
		jobs.value = response.value.sort((a: Job, b: Job) => {
			if (params.by == 1) {
				return (
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				)
			} else {
				return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
			}
		})
	} catch (error) {
		console.error('Failed to fetch jobs:', error)
	}
}

const handleDelete = (id: number, index: number) => {
	try {
		jobsStore.deleteJobById(id)
		jobs.value.splice(index, 1)
	} catch (error) {
		console.error('Failed to delete job:', error)
	}
}
</script>

<template>
	<div class="list-jobs" v-if="!jobsStore.isLoading">
		<h1 class="list-jobs__tittle">Danh sách công việc</h1>
		<div class="list-jobs__filter d-flex justify-content-between">
			<div class="list-jobs__filter-input">
				<input
					class="mr-8"
					type="text"
					placeholder="Tìm Kiếm"
					v-model="params.keyword"
					@change="fetchList"
				/>
				<select class="mr-8" v-model="params.status" @change="fetchList">
					<option value="-1">All</option>
					<option value="0">Chưa Hoàn Thành</option>
					<option value="1">Hoàn Thành</option>
				</select>
				<select v-model="params.by" @change="fetchList">
					<option value="0">Sort by Created</option>
					<option value="1">Sort by Deadline</option>
				</select>
			</div>
			<button
				class="list-jobs__filter-button"
				@click="router.push({ name: 'Create' })"
			>
				+ Thêm mới
			</button>
		</div>
		<div class="list-jobs__table">
			<div
				class="list-jobs__table-content"
				v-for="(job, jobIndex) in paginatedJobs"
				:key="job.id"
			>
				<div class="list-jobs__table-content-item">
					<div
						class="list-jobs__table-content-item-title d-flex justify-content-between"
					>
						<p>{{ job.title }}</p>
						<div class="list-jobs__table-content-item-title--underline d-flex">
							<div
								class="mr-8"
								@click="router.push({ name: 'Update', params: { id: job.id } })"
							>
								Sửa
							</div>
							<div
								class="list-jobs__table-content-item-title--red"
								@click="handleDelete(job.id, jobIndex)"
							>
								Xoá
							</div>
						</div>
					</div>
					<div class="list-jobs__table-content-item-description">
						{{ job.description }}
					</div>
					<div class="list-jobs__table-content-item-status">
						Trạng thái : {{ getStatus(job.status) }}
					</div>
					<div
						class="list-jobs__table-content-item-created_at d-flex justify-content-between"
					>
						<div>Ngày Tạo: {{ job.created_at }}</div>
						<div>Deadline: {{ job.deadline }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="list-jobs__pagination">
			<span class="mr-8" @click="prevPage" :disabled="currentPage === 1">
				<
			</span>
			<span
				v-for="page in totalPages"
				class="mr-8"
				:key="page"
				@click="goToPage(page)"
				:class="{ active: currentPage === page }"
				>{{ page }}</span
			>
			<span
				class="mr-8"
				@click="nextPage"
				:disabled="currentPage === totalPages"
			>
				>
			</span>
		</div>
	</div>
	<div v-else class="loading-screen">Loading...</div>
</template>

<style lang="scss" scoped>
.list-jobs {
	&__tittle {
		font-size: 24px;
		font-weight: bold;
	}
	&__filter {
		margin-top: 20px;
	}
	&__filter-input {
		select,
		input {
			padding: 5px;
		}
	}
	&__table {
		margin: 20px 0;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 10px;
	}
	&__table-content {
		display: block;
		text-align: left;
	}

	&__table-content-item {
		border: 1px solid #000;
		padding: 10px;
	}
	&__table-content-item-title {
		font-weight: bold;
		&--underline {
			text-decoration: underline;
		}
		&--red {
			color: red;
		}
	}
	&__pagination {
		span {
			border: 1px solid #000;
			padding: 10px;
		}
	}
	@media (max-width: 768px) {
		.list-jobs {
			&__filter {
				flex-direction: column;
				align-items: flex-start;
			}
			&__filter-button {
				margin-top: 10px;
			}
			&__table {
				grid-template-columns: 1fr;
			}
		}
	}
	@media (max-width: 585px) {
		.list-jobs {
			&__filter {
				display: flex !important;
				flex-direction: unset !important;
				align-items: center;
			}
			&__filter-input {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				grid-gap: 10px;
			}
			&__filter-button {
				margin-top: 0px;
				padding: 18px;
			}
		}
	}
}
.mr-8 {
	margin-right: 8px;
}
.active {
	color: red;
}
</style>
