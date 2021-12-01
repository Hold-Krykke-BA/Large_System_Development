import { fetchApi } from '.';
import IAttendanceCheck from '../Models/IAttendanceCheck';
import IUser from '../Models/IUser';

const _URLPREFIX = '/rolecall';

export type TAttendanceDTO = {
	teacher: IUser;
	attendanceCheck: IAttendanceCheck;
	seconds: number;
};

/**
 * Requests to the backend attendance service
 * @returns React hook for the available API calls
 */
export const useBackendAttendance = () => {
	const URL = _URLPREFIX + '/attendance';

	/**
	 * POST request to add attendance. Requirements: isTeacher
	 * @param dto
	 * @returns attendanceCheck ID if succesful
	 */
	const AddAttendance = async (dto: TAttendanceDTO) => {
		return new Promise((resolve, reject) => {
			if (!dto.teacher.isTeacher) reject('The requested feature is not available.');

			fetchApi<string>(URL + '/add', 'POST', JSON.stringify(dto)) //returns attendanceCheckId if succesful
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	/**
	 * GET request to get all attendance checks.
	 * @returns an array of attendanceChecks
	 */
	const getAllAttendanceChecks = async () => {
		return new Promise((resolve, reject) => {
			fetchApi<IAttendanceCheck[]>(URL + '/all')
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	/**
	 * GET request to get an attendance check by code.
	 * @param code the code of the attendance check
	 * @returns the attendanceCheck if succesful
	 */
	const getAttendanceCheck = async (code: number) => {
		return new Promise((resolve, reject) => {
			fetchApi<IAttendanceCheck>(URL + `/${code}`)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	/**
	 * DELETE request to delete an attendance check by its ID.
	 * @param attendanceCheckId the ID of the attendance check to delete
	 * @returns string status in the form of "Course was deleted"
	 */
	const deleteAttendanceCheck = async (attendanceCheckId: number) => {
		return new Promise((resolve, reject) => {
			fetchApi<string>(URL + `/delete/${attendanceCheckId}`, 'DELETE') //returns status in the form of string "Course was deleted"
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	/**
	 * PUT request to add an existing student to an existing attendanceCheck
	 * @param code code of the attendance check
	 * @param studentId
	 * @returns The attendance check if succesful
	 */
	const addStudentToAttendanceCheck = async (code: number, studentID: number) => {
		return new Promise((resolve, reject) => {
			fetchApi<IAttendanceCheck>(URL + `/addstudent`, 'PUT', JSON.stringify({ code, studentID }))
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	};

	return { AddAttendance, getAllAttendanceChecks, getAttendanceCheck, deleteAttendanceCheck, addStudentToAttendanceCheck };
};

export const useBackendCourses = () => {
	const URL = _URLPREFIX + '/courses';
	const getApiOne = () => {};
	const getApiTwo = () => {};

	return { getApiOne, getApiTwo };
};

export const useBackendUsers = () => {
	const URL = _URLPREFIX + '/users';
	const getApiOne = () => {};
	const getApiTwo = () => {};

	return { getApiOne, getApiTwo };
};

export const useBackendWhitelist = () => {
	const URL = _URLPREFIX + '/whitelist';
	const getApiOne = () => {};

	const getApiTwo = () => {};

	return { getApiOne, getApiTwo };
};
