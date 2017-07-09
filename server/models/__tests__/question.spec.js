import test from 'ava';
import request from 'supertest';
import app from '../../server';
import Question from '../question';
import { connectDB, dropDB } from '../../util/test-helpers';

// Initial Questions added into test db
const questions = [
  new Question({ name: 'Prashant', title: 'Hello Mern', slug: 'hello-mern', cuid: 'f34gb2bh24b24b2', content: "All cats meow 'mern!'" }),
  new Question({ name: 'Mayank', title: 'Hi Mern', slug: 'hi-mern', cuid: 'f34gb2bh24b24b3', content: "All dogs bark 'mern!'" }),
];

test.beforeEach('connect and add two question entries', t => {
  connectDB(t, () => {
    Question.create(questions, err => {
      if (err) t.fail('Unable to create questions');
    });
  });
});

test.afterEach.always(t => {
  dropDB(t);
});

test.serial('Should correctly give number of Questions', async t => {
  t.plan(2);

  const res = await request(app)
    .get('/api/questions')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.deepEqual(questions.length, res.body.questions.length);
});

test.serial('Should send correct data when queried against a cuid', async t => {
  t.plan(2);

  const question = new Question({ name: 'Foo', title: 'bar', slug: 'bar', cuid: 'f34gb2bh24b24b2', content: 'Hello Mern says Foo' });
  question.save();

  const res = await request(app)
    .get('/api/questions/f34gb2bh24b24b2')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.is(res.body.question.name, question.name);
});

test.serial('Should correctly add a Question', async t => {
  t.plan(2);

  const res = await request(app)
    .post('/api/questions')
    .send({ question: { name: 'Foo', title: 'bar', content: 'Hello Mern says Foo' } })
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const savedQuestion = await Question.findOne({ title: 'bar' }).exec();
  t.is(savedQuestion.name, 'Foo');
});

test.serial('Should correctly delete a question', async t => {
  t.plan(2);

  const question = new Question({ name: 'Foo', title: 'bar', slug: 'bar', cuid: 'f34gb2bh24b24b2', content: 'Hello Mern says Foo' });
  question.save();

  const res = await request(app)
    .delete(`/api/questions/${question.cuid}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const queriedQuestion = await Question.findOne({ cuid: question.cuid }).exec();
  t.is(queriedQuestion, null);
});
