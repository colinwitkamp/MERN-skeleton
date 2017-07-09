import { Router } from 'express';
import * as QuestionController from '../controllers/question.controller';
const router = new Router();

// Get all Questions
router.route('/questions').get(QuestionController.getQuestions);

// Get one question by cuid
router.route('/questions/:id').get(QuestionController.getQuestion);

// Add a new Question
router.route('/questions').post(QuestionController.addQuestion);

// Delete a post by cuid
router.route('/questions/:id').delete(QuestionController.deleteQuestion);

export default router;
