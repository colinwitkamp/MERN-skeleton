import Question from '../models/question';

/**
 * Get all questions
 * @param req
 * @param res
 * @returns void
 */
export function getQuestions(req, res) {
  Question.find().sort('-dateAdded').exec((err, questions) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ questions });
  });
}

/**
 * Save a question
 * @param req
 * @param res
 * @returns void
 */
export function addQuestion(req, res) {
  if (!req.body.question.question || !Array.isArray(req.body.question.categories) || (typeof req.body.question.answers !== 'object')) {
    res.status(403).end({
      message: 'Invalid question object!'
    });
  }

  const newQuestion = new Question(req.body.question);

  newQuestion.save((err, saved) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ question: saved });
  });
}

/**
 * Get a single question
 * @param req
 * @param res
 * @returns void
 */
export function getQuestion(req, res) {
  Question.findById(req.params.id).exec((err, question) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ question });
  });
}

/**
 * Delete a question
 * @param req
 * @param res
 * @returns void
 */
export function deleteQuestion(req, res) {
  Question.findById(req.params.id).remove((err, question) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ question });
  });
}
