import { defineStore } from 'pinia';
import jobsArray from './jobsArray';

export interface JobCreate {
    title: string;
    description: string;
    deadline: string;
}
export interface Job extends JobCreate{
    id: number;
    status: number;
    created_at: Date;
}

export const status = {
    'all': -1,
    'done': 0,
    'notDone': 1
}

export const by = {
    'created': 0,
    'deadline': 1
}

export const useJobsStore = defineStore({
    id: 'jobs',
    state: () => ({
        jobs: [] as Job[],
        isLoading: false as boolean,
        job: {} as JobCreate
    }),
    actions: {
        async fetchJobs({ keyword, status, by }: { keyword: string; status: number; by: number }) {
            this.isLoading = true;
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/items?keyword=${keyword}&status=${status}&by=${by}`);
                const jobs = await response.json();
                this.jobs = jobs.concat(jobsArray.jobs)
            } finally {
                this.isLoading = false;
            }
            
        },
        async getJobDetail(id: number) {
            try {
                this.isLoading = true;
                const response = await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`);
                this.job = await response.json();
            } finally {
                this.isLoading = false;
            }
        },
        async createNewJob(job: JobCreate) {
            try {
                this.isLoading = true;
                const response = await fetch(`${import.meta.env.VITE_API_URL}/items`, {
                    method: 'POST',
                    body: JSON.stringify(job),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const createdJob = await response.json();
                this.jobs.push(createdJob);
            } finally {
                this.isLoading = false;
            }
            
        },
        async updateJobById(id: number, updatedJob: JobCreate) {
            try {
                this.isLoading = true;
                const response = await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedJob),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const updatedJobData = await response.json();
                const index = this.jobs.findIndex((job: Job) => job.id === updatedJobData.id);
                if (index !== -1) {
                    this.jobs[index] = updatedJobData;
                }
            } finally {
                this.isLoading = false;
            }
            
        },
        async deleteJobById(id: number) {
            try {
                this.isLoading = true;
                this.isLoading = false;
                await fetch(`${import.meta.env.VITE_API_URL}/items/${id}`, {
                    method: 'DELETE',
                });
            } finally {
            }
        }
    },
});
