"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import * as client from "../../../client";

type Quiz = {
  _id?: string;
  course: string;
  title: string;
  description?: string;
  published: boolean;
  quizType?: string;
  points?: number;
  assignmentGroup?: string;
  shuffleAnswers?: boolean;
  timeLimit?: number;
  multipleAttempts?: boolean;
  maxAttempts?: number;
  showCorrectAnswers?: string;
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  questions?: { points?: number }[];
};

type Attempt = {
  _id: string;
  quiz: string;
  course: string;
  student: string;
  attemptNumber: number;
  score: number;
  possibleScore: number;
  submittedAt: string;
};

type User = {
  _id: string;
  role?: string;
};

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;

export default function QuizDetailsPage() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [lastAttempt, setLastAttempt] = useState<Attempt | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const normalizedRole = (currentUser?.role || "").toString().toUpperCase();
  const isStudent = normalizedRole === "STUDENT";

  const loadCurrentUser = async () => {
  try {
    const { data } = await axiosWithCredentials.post(`${USERS_API}/profile`);
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


  const loadQuizAndAttempts = async () => {
    if (!qid) return;
    setLoadingQuiz(true);
    try {
      const quizData = await client.findQuizById(qid as string);
      setQuiz(quizData as Quiz);

      if (isStudent) {
        try {
          const attempts: Attempt[] = await client.findMyQuizAttempts(
            qid as string
          );
          if (Array.isArray(attempts) && attempts.length > 0) {
            setLastAttempt(attempts[attempts.length - 1]);
          } else {
            setLastAttempt(null);
          }
        } catch (e) {
          console.error("Failed to load attempts for quiz details", e);
          setLastAttempt(null);
        }
      } else {
        setLastAttempt(null);
      }
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (loadingUser) return;
    loadQuizAndAttempts();
  }, [qid, loadingUser, isStudent]);

  if (loadingUser || loadingQuiz || !quiz) {
    return (
      <div className="p-3">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading quiz...
      </div>
    );
  }

  const totalPointsFromQuestions =
    quiz.questions?.reduce(
      (sum, q) => sum + (typeof q.points === "number" ? q.points : 0),
      0
    ) ?? 0;

  const totalPoints =
    totalPointsFromQuestions > 0 ? totalPointsFromQuestions : quiz.points ?? 0;

  const numQuestions = quiz.questions?.length ?? 0;

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleString() : "Not set";

  const renderHeaderButtons = () => {
    if (isStudent) {
      return (
        <>
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
          >
            Back to Quizzes
          </Button>
          <Button
            variant="success"
            onClick={() =>
              router.push(`/Courses/${cid}/Quizzes/${qid}/Take`)
            }
          >
            Take Quiz
          </Button>
        </>
      );
    }

    // FACULTY / OTHER ROLES: Back + Preview + Edit
    return (
      <>
        <Button
          variant="outline-secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
        >
          Back to Quizzes
        </Button>
        <Button
          variant="outline-primary"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)
          }
        >
          Preview
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/Editor`)
          }
        >
          Edit
        </Button>
      </>
    );
  };

  return (
    <div className="p-3">
      <Row className="mb-3">
        <Col>
          <h3 className="mb-1">{quiz.title}</h3>
          <div className="text-muted">
            {quiz.description || "No description"}
          </div>
          <div className="mt-2">
            {quiz.published ? (
              <span className="badge bg-success me-2">Published</span>
            ) : (
              <span className="badge bg-secondary me-2">Unpublished</span>
            )}
            <span className="badge bg-info text-dark">
              {quiz.quizType || "GRADED_QUIZ"}
            </span>
          </div>

          {isStudent && lastAttempt && (
            <div className="mt-2 small">
              Last score:{" "}
              <strong>
                {lastAttempt.score} / {lastAttempt.possibleScore}
              </strong>{" "}
              (Attempt {lastAttempt.attemptNumber} on{" "}
              {new Date(lastAttempt.submittedAt).toLocaleString()})
            </div>
          )}
        </Col>

        <Col className="d-flex justify-content-end align-items-start gap-2">
          {renderHeaderButtons()}
        </Col>
      </Row>

      <Card>
        <Card.Header>Quiz Settings</Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col sm={4}>
              <strong>Quiz Type</strong>
            </Col>
            <Col sm={8}>{quiz.quizType || "GRADED_QUIZ"}</Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Points</strong>
            </Col>
            <Col sm={8}>
              {totalPoints} point{totalPoints === 1 ? "" : "s"} (
              {numQuestions} question{numQuestions === 1 ? "" : "s"})
            </Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Assignment Group</strong>
            </Col>
            <Col sm={8}>{quiz.assignmentGroup || "Quizzes"}</Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Shuffle Answers</strong>
            </Col>
            <Col sm={8}>{quiz.shuffleAnswers ? "Yes" : "No"}</Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Time Limit</strong>
            </Col>
            <Col sm={8}>
              {quiz.timeLimit != null ? `${quiz.timeLimit} minutes` : "No limit"}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Multiple Attempts</strong>
            </Col>
            <Col sm={8}>
              {quiz.multipleAttempts
                ? `Yes (max ${quiz.maxAttempts ?? 1} attempt${
                    (quiz.maxAttempts ?? 1) === 1 ? "" : "s"
                  })`
                : "No"}
            </Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Show Correct Answers</strong>
            </Col>
            <Col sm={8}>{quiz.showCorrectAnswers || "AFTER_DUE"}</Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Access Code</strong>
            </Col>
            <Col sm={8}>{quiz.accessCode || "None"}</Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>One Question at a Time</strong>
            </Col>
            <Col sm={8}>{quiz.oneQuestionAtATime ? "Yes" : "No"}</Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Webcam Required</strong>
            </Col>
            <Col sm={8}>{quiz.webcamRequired ? "Yes" : "No"}</Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Lock Questions After Answering</strong>
            </Col>
            <Col sm={8}>
              {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
            </Col>
          </Row>

          <hr />

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Due</strong>
            </Col>
            <Col sm={8}>{formatDate(quiz.dueDate)}</Col>
          </Row>

          <Row className="mb-2">
            <Col sm={4}>
              <strong>Available From</strong>
            </Col>
            <Col sm={8}>{formatDate(quiz.availableDate)}</Col>
          </Row>

          <Row className="mb-0">
            <Col sm={4}>
              <strong>Available Until</strong>
            </Col>
            <Col sm={8}>{formatDate(quiz.untilDate)}</Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
