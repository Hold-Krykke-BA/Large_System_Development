import express from "express";
const router = express.Router();
import CourseService from "../Services/courseService"

router.post('/add', async function (req, res, next) {
  try {
    let newCourse = req.body;
    const status = await CourseService.addCourse(newCourse)
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

router.get('/all', async function (req: any, res, next) {
  try {
    const courses = await CourseService.getAllCourses();
    res.json(courses);
  } catch (err) {
    next(err)
  }
});

router.get('/:courseID', async function (req: any, res, next) {
  try {
    const courseID = req.params.courseID;
    const course = await CourseService.getCourse(courseID);
    res.json(course);
  } catch (err) {
    next(err)
  }
});

router.delete('/remove/:courseID', async function (req: any, res, next) {
  try {
    const courseID = req.params.courseID;
    const course = await CourseService.deleteCourse(courseID);
    res.json(course);
  } catch (err) {
    next(err)
  }
});

module.exports = router;