import test from "node:test";
import assert from "node:assert/strict";
import { seedDB, reviewMistakes, reviewPlan, compareAttempts, lessonNotes, followUpQuestions } from "./data.ts";

const question = { id: "q1", lessonId: "l1", text: "2 + 2", type: "mcq", options: ["3", "4"], correct: 1 };
const attempt = (id, selected) => ({ id, userId: "s1", lessonId: "l1", score: selected === 1 ? 1 : 0, total: 1, date: "2026-09-21", timeTakenSec: 5, answers: [{ question, selected }] });

test("wrong and unanswered responses are reviewable; legacy attempts stay compatible", () => {
  assert.equal(reviewMistakes(attempt("a", 0)).length, 1);
  assert.equal(reviewMistakes(attempt("b", null)).length, 1);
  assert.equal(reviewMistakes(attempt("c", 1)).length, 0);
  assert.deepEqual(reviewMistakes({ score: 0 }), []);
});

test("review plan uses the latest attempt per lesson and isolates students", () => {
  const db = { ...seedDB(), lessons: [{ id: "l1" }], attempts: [attempt("a", 0), attempt("b", 1)] };
  assert.equal(reviewPlan(db, "s1").length, 0);
  db.attempts.push(attempt("c", null));
  assert.equal(reviewPlan(db, "s1")[0].id, "c");
  assert.equal(reviewPlan(db, "s2").length, 0);
  db.lessons = [];
  assert.equal(reviewPlan(db, "s1").length, 0);
});

test("comparison reports percentage points only for equivalent assessments", () => {
  assert.equal(compareAttempts(attempt("b", 1), attempt("a", 0)), 100);
  assert.equal(compareAttempts(attempt("a", 0), attempt("b", 1)), -100);
  assert.equal(compareAttempts(attempt("a", 0), attempt("a", 0)), 0);
  assert.equal(compareAttempts(attempt("b", 1), undefined), null);
  const changed = attempt("c", 1);
  changed.answers = [{ question: { ...question, correct: 0 }, selected: 1 }];
  assert.equal(compareAttempts(changed, attempt("a", 0)), null);
  assert.equal(compareAttempts({ ...attempt("b", 1), answers: undefined }, attempt("a", 0)), null);
});

test("curated equations provide relevant notes and genuinely different follow-up questions", () => {
  const db = seedDB();
  const lesson = db.lessons.find(l => l.title === "المعادلات الخطية");
  const questions = db.questions.filter(q => q.lessonId === lesson.id);
  assert.equal(lessonNotes(lesson).length, 3);
  assert.ok(lessonNotes(lesson)[0].body.includes("3س"));
  const followUps = followUpQuestions(lesson, questions);
  assert.equal(followUps.length, questions.length);
  assert.ok(followUps.every((q, i) => q.text !== questions[i].text && q.options[q.correct]));
  assert.equal(followUpQuestions(lesson, [{ ...questions[0], text: "edited question" }]).length, 0);
  assert.deepEqual(followUpQuestions({ ...lesson, title: "درس آخر" }, questions), []);
});
