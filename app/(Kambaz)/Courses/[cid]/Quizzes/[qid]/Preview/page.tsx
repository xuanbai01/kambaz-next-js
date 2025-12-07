"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import * as client from "../../../../client";

type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";

type Question = {
  _id?: string;
  title: string;
  type: QuestionType;
  points: number;
  choices?: string[];
  correctChoice?: number;
  correctAnswers?: string[];
};

type Quiz = {
  _id?: string;
  course: string;
  title: string;
  description?: string;
  published: boolean;
  points?: number;
  questions: Question[];
  quizType?: string;
  assignmentGroup?: string;
  shuffleAnswers?: boolean;
  timeLimit?: number | null;
  multipleAttempts?: boolean;
  maxAttempts?: number;
  showCorrectAnswers?: string;
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  dueDate?: string | null;
  availableDate?: string | null;
  untilDate?: string | null;
};

type User = {
  _id: string;
  role?: string;
};

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;

export default function PreviewQuizPage() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const isStudent = currentUser?.role === "STUDENT";

  const loadCurrentUser = async () => {
    try {
      const { data } = await axiosWithCredentials.post(
        `${USERS_API}/profile`
      );
      setCurrentUser(data);
    } catch (e: any) {
      if (e.response?.status === 401) {
        setCurrentUser(null);
      } else {
        console.error("Failed to load current user", e);
        setCurrentUser(null);
      }
    } finally {
      setLoadingUser(false);
    }
  };

  const loadQuiz = async () => {
    if (!qid) return;
    setLoading(true);
    setError(null);
    try {
      const data: Quiz = await client.findQuizById(qid as string);
      setQuiz(data);
      setCurrentQuestionIndex(0);
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data || "Failed to load quiz for preview."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!isStudent && qid) {
      loadQuiz();
    } else {
      setQuiz(null);
    }
  }, [qid, isStudent]);

  useEffect(() => {
    if (!loadingUser && isStudent && cid && qid) {
      router.replace(`/Courses/${cid}/Quizzes/${qid}/Take`);
    }
  }, [loadingUser, isStudent, cid, qid, router]);

  if (loadingUser) {
    return (
      <div className="p-3">
        <Spinner animation="border" size="sm" /> Loading...
      </div>
    );
  }

  if (isStudent) {
    return (
      <div className="p-3">
        <Spinner animation="border" size="sm" /> Redirecting to quiz…
      </div>
    );
  }

  if (loading || !quiz) {
    return (
      <div className="p-3">
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          "Loading quiz…"
        )}
      </div>
    );
  }

  const totalPoints =
    quiz.questions?.reduce(
      (sum, q) => sum + (typeof q.points === "number" ? q.points : 0),
      0
    ) ?? quiz.points ?? 0;

  const renderQuestion = (q: Question, index: number) => {
    const type: QuestionType = q.type || "MULTIPLE_CHOICE";

    return (
      <Card key={q._id ?? index} className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Card.Title className="mb-1">
                Q{index + 1}. {q.title}
              </Card.Title>
              <div className="text-muted small">
                {q.points} point{q.points === 1 ? "" : "s"}
              </div>
            </div>
            <span className="text-muted small">Preview</span>
          </div>

          <hr />

          {type === "MULTIPLE_CHOICE" && (
            <Form.Group>
              {(q.choices || []).map((choice, idx) => (
                <Form.Check
                  key={idx}
                  type="radio"
                  name={`q-${index}`}
                  label={choice}
                  disabled
                  className="mb-1"
                />
              ))}
            </Form.Group>
          )}

          {type === "TRUE_FALSE" && (
            <Form.Group>
              <Form.Check
                type="radio"
                name={`q-${index}`}
                label="True"
                disabled
                className="mb-1"
              />
              <Form.Check
                type="radio"
                name={`q-${index}`}
                label="False"
                disabled
              />
            </Form.Group>
          )}

          {type === "FILL_IN_BLANK" && (
            <Form.Group>
              <Form.Label className="text-muted">
                Student answer (preview only)
              </Form.Label>
              <Form.Control
                type="text"
                disabled
                placeholder="Student answer goes here"
              />
            </Form.Group>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-1">
            {quiz.title} <span className="fs-6 text-muted">(Preview)</span>
          </h3>
          <div className="text-muted">
            {quiz.description || "No description"}
          </div>
          <div className="small mt-1">
            Total: {totalPoints} point
            {totalPoints === 1 ? "" : "s"} ({quiz.questions.length} question
            {quiz.questions.length === 1 ? "" : "s"})
          </div>
        </div>
        <div className="d-flex flex-column align-items-end gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}`)
            }
          >
            Keep Editing This Quiz
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Alert variant="secondary" className="mb-3">
        This is a <strong>faculty preview</strong>. No scores or attempts
        are recorded in this mode.
      </Alert>

      <Form>
        <div className="row">
          <div className={quiz.oneQuestionAtATime ? "col-lg-10 col-md-9" : "col-12"}>
            {quiz.oneQuestionAtATime
              ? renderQuestion(
                  quiz.questions[currentQuestionIndex],
                  currentQuestionIndex
                )
              : quiz.questions.map((q, idx) => renderQuestion(q, idx))}

            {quiz.oneQuestionAtATime && quiz.questions.length > 0 && (
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-secondary"
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() =>
                    setCurrentQuestionIndex((i) => Math.max(0, i - 1))
                  }
                >
                  Previous
                </Button>

                <div className="small text-muted">
                  Question {currentQuestionIndex + 1} of{" "}
                  {quiz.questions.length}
                </div>

                <Button
                  variant="outline-secondary"
                  type="button"
                  disabled={
                    currentQuestionIndex === quiz.questions.length - 1
                  }
                  onClick={() =>
                    setCurrentQuestionIndex((i) =>
                      Math.min(quiz.questions.length - 1, i + 1)
                    )
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {quiz.oneQuestionAtATime && (
            <div className="col-lg-1 col-md-3 mt-3 mt-md-0">
              <Card>
                <Card.Body className="py-2 px-2">
                  <div className="fw-bold small mb-1">Questions</div>
                  <div className="d-flex flex-column gap-1 align-items-end">
                    {quiz.questions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`btn btn-link p-0 small ${
                          idx === currentQuestionIndex
                            ? "text-danger fw-bold"
                            : ""
                        }`}
                        onClick={() => setCurrentQuestionIndex(idx)}
                      >
                        <span className="me-1"></span> Question {idx + 1}
                      </button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}`)
            }
          >
            Close Preview
          </Button>
        </div>
      </Form>
    </div>
  );
}
