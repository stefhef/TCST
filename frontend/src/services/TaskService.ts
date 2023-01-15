import { IRequestConfig, request } from '../api/api';
import {
	ITask,
	ITasksResponse,
	ITaskCountForStudentResponse,
	ITaskCountForTeacherResponse,
} from '../models';

export default class TaskService {
	static async getTasks(
		group_id: number | string,
		course_id: number | string,
		lesson_id: number | string
	): Promise<ITasksResponse> {
		const requestConfig: IRequestConfig = {
			method: 'get',
			url: '/task/get_all',
			auth: true,
			params: {
				group_id: group_id,
				course_id: course_id,
				lesson_id: lesson_id,
			},
		};
		return request(requestConfig);
	}
	static async getTask(
		group_id: number | string,
		course_id: number | string,
		lesson_id: number | string,
		task_id: number | string
	): Promise<ITask> {
		const requestConfig: IRequestConfig = {
			method: 'get',
			url: '/task/get_one',
			auth: true,
			params: {
				group_id: group_id,
				course_id: course_id,
				lesson_id: lesson_id,
				task_id: task_id,
			},
		};
		return request(requestConfig);
	}
	static async getCountForStudent(
		group_id: number | string,
		course_id: number | string,
		lesson_id: number | string
	): Promise<ITaskCountForStudentResponse> {
		const requestConfig: IRequestConfig = {
			method: 'get',
			url: '/task/get_count_for_student',
			auth: true,
			params: {
				group_id: group_id,
				course_id: course_id,
				lesson_id: lesson_id,
			},
		};
		return request(requestConfig);
	}

	static async getCountForTeacher(
		group_id: number | string,
		course_id: number | string,
		lesson_id: number | string
	): Promise<ITaskCountForTeacherResponse> {
		const requestConfig: IRequestConfig = {
			method: 'get',
			url: '/task/get_count_for_teacher',
			auth: true,
			params: {
				group_id: group_id,
				course_id: course_id,
				lesson_id: lesson_id,
			},
		};
		return request(requestConfig);
	}
}
