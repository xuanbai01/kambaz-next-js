"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import * as client from "../../../../client";

type Question = {
  _id?: string;
  title: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
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
  quizType?: string;
  points?: number;
  questions: Question[];
  multipleAttempts?: boolean;
  maxAttempts?: number;
  accessCode?: string;
  availableDate?: string;
  untilDate?: string;

  // NEW fields used by take/preview logic
  dueDate?: string;
  showCorrectAnswers?: "NEVER" | "IMMEDIATELY" | "AFTER_DUE";
  oneQuestionAtATime?: boolean;
};

type AttemptAnswer = {
  questionIndex: number;
  value: any;
  isCorrect?: boolean;
};

type Attempt = {
  _id: string;
  quiz: string;
  course: string;
  student: string;
  attemptNumber: number;
  score: number;
  possibleScore: number;
  answers: AttemptAnswer[];
  submittedAt: string;
};

type AvailabilityStatus = "NOT_SET" | "NOT_YET" | "AVAILABLE" | "CLOSED";
type Mode = "taking" | "review";

export default function TakeQuizPage() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availabilityStatus, setAvailabilityStatus] =
    useState<AvailabilityStatus>("NOT_SET");

  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("taking");

  // For one-question-at-a-time
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // “Save” state per question (client-side only)
  const [savedAnswers, setSavedAnswers] = useState<Record<number, boolean>>({});

  const computeAvailability = (q: Quiz): AvailabilityStatus => {
    const now = new Date();
    const available = q.availableDate ? new Date(q.availableDate) : null;
    const until = q.untilDate ? new Date(q.untilDate) : null;

    if (available && now < available) {
      return "NOT_YET";
    }
    if (until && now > until) {
      return "CLOSED";
    }
    if (!available && !until) {
      return "NOT_SET";
    }
    return "AVAILABLE";
  };

  const loadData = async () => {
    if (!qid) return;
    setLoading(true);
    setError(null);
    try {
      const quizData: Quiz = await client.findQuizById(qid as string);
      setQuiz(quizData);
      setAvailabilityStatus(computeAvailability(quizData));
      setCurrentQuestionIndex(0);
      setSavedAnswers({});

      const hasAccessCode =
        !!quizData.accessCode && quizData.accessCode.trim().length > 0;
      setAccessGranted(!hasAccessCode);
      setAccessCodeInput("");
      setAccessError(null);

      let attemptsData: Attempt[] = [];
      try {
        const resp: Attempt[] = await client.findMyQuizAttempts(qid as string);
        attemptsData = Array.isArray(resp) ? resp : [];
      } catch (e) {
        console.error("Failed to load attempts", e);
      }
      setAttempts(attemptsData);

      if (attemptsData.length > 0) {
        setMode("review");
      } else {
        setMode("taking");
      }
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data || "Failed to load quiz. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [qid]);

  if (loading || !quiz) {
    return (
      <div className="p-3">
        {loading ? (
          <Spinner animation="border" role="status" size="sm" />
        ) : (
          "Loading quiz..."
        )}
      </div>
    );
  }

  const lastAttempt = attempts.length
    ? attempts[attempts.length - 1]
    : undefined;

  const multipleAttempts = !!quiz.multipleAttempts;
  const maxAttempts = multipleAttempts ? quiz.maxAttempts || 1 : 1;
  const attemptsUsed = lastAttempt?.attemptNumber ?? 0;
  const attemptsLeft = Math.max(0, maxAttempts - attemptsUsed);
  const hasAttemptsRemaining = attemptsLeft > 0;

  const totalPointsFromQuestions =
    quiz.questions?.reduce(
      (sum, q) => sum + (typeof q.points === "number" ? q.points : 0),
      0
    ) ?? 0;
  const totalPoints =
    totalPointsFromQuestions > 0 ? totalPointsFromQuestions : quiz.points ?? 0;

  const canTakeByTime =
    quiz.published &&
    (availabilityStatus === "AVAILABLE" || availabilityStatus === "NOT_SET");

  const canRetake = hasAttemptsRemaining && canTakeByTime && accessGranted;

  const isTaking =
    mode === "taking" && canTakeByTime && hasAttemptsRemaining && accessGranted;

  const isReview = mode === "review" && !!lastAttempt;

  // --- showCorrectAnswers logic ---
  const showCorrectMode = quiz.showCorrectAnswers || "NEVER";
  let canShowCorrectAnswers = false;
  if (showCorrectMode === "IMMEDIATELY") {
    canShowCorrectAnswers = isReview;
  } else if (showCorrectMode === "AFTER_DUE") {
    if (quiz.dueDate) {
      const due = new Date(quiz.dueDate);
      if (new Date() >= due && isReview) {
        canShowCorrectAnswers = true;
      }
    }
  }
  // NEVER => stays false

  const handleChangeAnswer = (index: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
    setSavedAnswers((prev) => ({ ...prev, [index]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qid) return;
    setSubmitting(true);
    setError(null);
    try {
      const answersArray = quiz.questions.map((_, idx) => answers[idx] ?? null);
      const createdAttempt = await client.createQuizAttempt(
        qid as string,
        answersArray
      );
      setAttempts((prev) => [...prev, createdAttempt]);
      setAnswers({});
      setSavedAnswers({});
      setMode("review");
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data ||
          "Failed to submit attempt. You may have reached the max attempts or the quiz is no longer available."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlock = () => {
    if (!quiz.accessCode || quiz.accessCode.trim() === "") {
      setAccessGranted(true);
      setAccessError(null);
      return;
    }
    if (quiz.accessCode.trim() === accessCodeInput.trim()) {
      setAccessGranted(true);
      setAccessError(null);
    } else {
      setAccessGranted(false);
      setAccessError("Incorrect access code.");
    }
  };

  const handleRetake = () => {
    if (!canRetake) return;
    setMode("taking");
    setAnswers({});
    setSavedAnswers({});
    setCurrentQuestionIndex(0);
  };

  const renderQuestion = (
    q: Question,
    index: number,
    reviewMode: boolean,
    canShowCorrect: boolean
  ) => {
    const type = q.type || "MULTIPLE_CHOICE";

    const lastAnswer = lastAttempt?.answers?.find(
      (a) => a.questionIndex === index
    );
    const answeredValue = lastAnswer?.value;

    // Prefer isCorrect from backend if present
    let isCorrect =
      typeof lastAnswer?.isCorrect === "boolean"
        ? lastAnswer.isCorrect
        : undefined;

    if (reviewMode && typeof isCorrect === "undefined") {
      if (type === "MULTIPLE_CHOICE") {
        isCorrect =
          typeof answeredValue === "number" &&
          answeredValue === q.correctChoice;
      } else if (type === "TRUE_FALSE") {
        isCorrect = answeredValue === q.correctChoice;
      } else if (type === "FILL_IN_BLANK") {
        const acceptable = (
          q.correctAnswers && q.correctAnswers.length ? q.correctAnswers : []
        )
          .map((a) => a.trim().toLowerCase())
          .filter((a) => a !== "");

        const student = (answeredValue ?? "").toString().trim().toLowerCase();

        isCorrect = acceptable.length > 0 && acceptable.includes(student);
      }
    }

    const showCorrectVisuals = reviewMode && canShowCorrect;

    const borderClass = showCorrectVisuals
      ? isCorrect
        ? "border-success"
        : "border-danger"
      : "border-secondary";

    return (
      <Card key={q._id ?? index} className={`mb-3 ${borderClass}`}>
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
            {showCorrectVisuals && (
              <span
                className={
                  isCorrect ? "text-success fw-bold" : "text-danger fw-bold"
                }
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </span>
            )}
          </div>

          <hr />

          {!reviewMode && isTaking && type === "MULTIPLE_CHOICE" && (
            <Form.Group>
              {(q.choices || []).map((choice, idx) => (
                <Form.Check
                  key={idx}
                  type="radio"
                  name={`q-${index}`}
                  label={choice}
                  checked={answers[index] === idx}
                  onChange={() => handleChangeAnswer(index, idx)}
                  className="mb-1"
                />
              ))}
            </Form.Group>
          )}

          {!reviewMode && isTaking && type === "TRUE_FALSE" && (
            <Form.Group>
              <Form.Check
                type="radio"
                name={`q-${index}`}
                label="True"
                checked={answers[index] === 1}
                onChange={() => handleChangeAnswer(index, 1)}
                className="mb-1"
              />
              <Form.Check
                type="radio"
                name={`q-${index}`}
                label="False"
                checked={answers[index] === 0}
                onChange={() => handleChangeAnswer(index, 0)}
              />
            </Form.Group>
          )}

          {!reviewMode && isTaking && type === "FILL_IN_BLANK" && (
            <Form.Group>
              <Form.Label>Your Answer</Form.Label>
              <Form.Control
                type="text"
                value={answers[index] ?? ""}
                onChange={(e) => handleChangeAnswer(index, e.target.value)}
              />
            </Form.Group>
          )}

          {reviewMode && (
            <div className="mt-2">
              <div>
                <strong>Your answer: </strong>
                {type === "MULTIPLE_CHOICE" && typeof answeredValue === "number"
                  ? (q.choices || [])[answeredValue] ?? "(no answer)"
                  : type === "TRUE_FALSE"
                  ? answeredValue === 1
                    ? "True"
                    : answeredValue === 0
                    ? "False"
                    : "(no answer)"
                  : answeredValue || "(no answer)"}
              </div>

              {canShowCorrect &&
                type === "FILL_IN_BLANK" &&
                (q.correctAnswers || []).length > 0 && (
                  <div className="text-muted small">
                    Acceptable answers: {q.correctAnswers?.join(", ")}
                  </div>
                )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const formatAvailabilityMessage = () => {
    switch (availabilityStatus) {
      case "NOT_YET":
        return "This quiz is not available yet.";
      case "CLOSED":
        return "This quiz is closed.";
      case "AVAILABLE":
        return "This quiz is currently available.";
      case "NOT_SET":
      default:
        return "This quiz has no availability dates set.";
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-1">{quiz.title}</h3>
          <div className="text-muted">
            {quiz.description || "No description"}
          </div>
          <div className="small mt-1">
            Total: {totalPoints} point
            {totalPoints === 1 ? "" : "s"} ({quiz.questions.length} question
            {quiz.questions.length === 1 ? "" : "s"})
          </div>
          {isTaking && (
            <div className="small mt-1 text-muted">
              Attempt {attemptsUsed + 1} of {maxAttempts}
            </div>
          )}
        </div>
        <div className="d-flex flex-column align-items-end gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
          >
            Back to Quiz Details
          </Button>
          {lastAttempt && (
            <div className="text-end small">
              <div>
                {hasAttemptsRemaining ? "Last score:" : "Final score:"}{" "}
                <strong>
                  {lastAttempt.score} / {lastAttempt.possibleScore}
                </strong>
              </div>
              <div className="text-muted">
                Attempt {lastAttempt.attemptNumber} on{" "}
                {new Date(lastAttempt.submittedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {!isTaking && !quiz.published && (
        <Alert variant="warning" className="mb-2">
          This quiz is currently unpublished and cannot be taken.
        </Alert>
      )}

      {!isTaking && quiz.published && (
        <Alert
          variant={
            availabilityStatus === "AVAILABLE" ||
            availabilityStatus === "NOT_SET"
              ? "secondary"
              : availabilityStatus === "NOT_YET"
              ? "info"
              : "warning"
          }
          className="mb-2"
        >
          {formatAvailabilityMessage()}
        </Alert>
      )}

      {!isTaking && multipleAttempts && (
        <Alert variant="secondary" className="mb-2">
          Attempts used: {attemptsUsed} / {maxAttempts}
        </Alert>
      )}

      {!isTaking && !multipleAttempts && maxAttempts === 1 && lastAttempt && (
        <Alert variant="secondary" className="mb-2">
          This quiz only allows a single attempt.
        </Alert>
      )}

      {quiz.accessCode &&
        quiz.accessCode.trim().length > 0 &&
        !accessGranted && (
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="fs-6">Access Code Required</Card.Title>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUnlock();
                }}
              >
                <Form.Group className="mb-2">
                  <Form.Label>Enter access code to begin</Form.Label>
                  <Form.Control
                    type="password"
                    value={accessCodeInput}
                    onChange={(e) => setAccessCodeInput(e.target.value)}
                  />
                </Form.Group>
                {accessError && (
                  <div className="text-danger small mb-2">{accessError}</div>
                )}
                <Button type="submit" variant="primary" size="sm">
                  Unlock Quiz
                </Button>
              </Form>
            </Card.Body>
          </Card>
        )}

      {isReview && (
        <>
          <Alert variant="success" className="mb-3">
            Your attempt has been submitted.
          </Alert>
          {canRetake ? (
            <div className="d-flex justify-content-end mb-3">
              <Button variant="primary" onClick={handleRetake}>
                Retake Quiz
              </Button>
            </div>
          ) : (
            <Alert variant="info" className="mb-3">
              {hasAttemptsRemaining
                ? "You cannot retake this quiz right now."
                : "You have used all attempts for this quiz. This is your final score."}
            </Alert>
          )}

          <div className="mt-2">
            {quiz.questions.map((q, idx) =>
              renderQuestion(q, idx, true, canShowCorrectAnswers)
            )}
          </div>
        </>
      )}

      {isTaking && (
        <Form onSubmit={handleSubmit} className="mt-3">
          <div className="row">
            <div
              className={
                quiz.oneQuestionAtATime ? "col-lg-9 col-md-8" : "col-12"
              }
            >
              {quiz.oneQuestionAtATime ? (
                <>
                  {renderQuestion(
                    quiz.questions[currentQuestionIndex],
                    currentQuestionIndex,
                    false,
                    false
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-3">
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

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-success"
                        type="button"
                        onClick={() =>
                          setSavedAnswers((prev) => ({
                            ...prev,
                            [currentQuestionIndex]: true,
                          }))
                        }
                        disabled={
                          answers[currentQuestionIndex] === undefined ||
                          answers[currentQuestionIndex] === null ||
                          answers[currentQuestionIndex] === ""
                        }
                      >
                        Save
                      </Button>
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
                  </div>

                  {savedAnswers[currentQuestionIndex] && (
                    <div className="text-success small mt-2 text-end">
                      Answer saved.
                    </div>
                  )}
                </>
              ) : (
                quiz.questions.map((q, idx) =>
                  renderQuestion(q, idx, false, false)
                )
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

          <div className="d-flex justify-content-end mt-3 gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </Form>
      )}

      {!isTaking && !isReview && (
        <Alert variant="info" className="mt-3">
          This quiz cannot be taken at this time.
        </Alert>
      )}
    </div>
  );
}
