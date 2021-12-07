import express, { NextFunction, Response } from 'express';
import { AuthorizationError } from '../Errors/AuthorizationError';
import ICourse from '../Models/ICourse';
const router = express.Router();
import CourseService from '../Services/courseService';
import { AuthRequest } from '../Util/Types';

const authIsTeacher = (req: AuthRequest, res: Response, next: NextFunction) => {
	if (!req.token?.isTeacher) {
		const err = new AuthorizationError('Unauthorized (2)', 403);
		return next(err);
	} else {
		next();
	}
};

router.post('/add', authIsTeacher, async (req, res, next) => {
	try {
		let newCourse = req.body;
		const status = await CourseService.addCourse(newCourse);
		res.json({ status });
	} catch (err) {
		next(err);
	}
});

router.get('/all', authIsTeacher, async function (req: any, res, next) {
	try {
		const courses = await CourseService.getAllCourses();
		res.json(courses);
	} catch (err) {
		next(err);
	}
});

router.get('/:courseID', async (req: any, res, next) => {
	try {
		const courseID = req.params.courseID;
		const course: ICourse = await CourseService.getCourse(courseID);

		//Check if course belongs to user
		if (!req.token?.isTeacher) {
			const userExists = course.students.find((student) => student.userID === req.token?.userID);
			if (!userExists) {
				const err = new AuthorizationError('Unauthorized (2.5)', 403);
				return next(err);
			}
		}
		res.json(course);
	} catch (err) {
		next(err);
	}
});

router.delete('/remove/:courseID', authIsTeacher, async (req: any, res, next) => {
	try {
		const courseID = req.params.courseID;
		const course = await CourseService.deleteCourse(courseID);
		res.json(course);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
