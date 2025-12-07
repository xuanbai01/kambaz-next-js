"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  ListGroupItem,
  Spinner,
  Alert,
} from "react-bootstrap";
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
  points: number;
  published: boolean;
  questions: Question[];

  // Metadata fields from spec
  quizType?:
    | "GRADED_QUIZ"
    | "PRACTICE_QUIZ"
    | "GRADED_SURVEY"
    | "UNGRADED_SURVEY";
  assignmentGroup?: "Quizzes" | "Exams" | "Assignments" | "Project";
  shuffleAnswers?: boolean;
  timeLimit?: number | null;
  multipleAttempts?: boolean;
  maxAttempts?: number;
  showCorrectAnswers?: "NEVER" | "IMMEDIATELY" | "AFTER_DUE";
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  dueDate?: string | null;
  availableDate?: string | null;
  untilDate?: string | null;
};

type ActiveTab = "DETAILS" | "QUESTIONS";

type User = {
  _id: string;
  role?: string;
};

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;

const toLocalInputValue = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

const fromLocalInputValue = (value: string): string | null => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("DETAILS");

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

  const loadQuiz = async () => {
    if (!qid) return;
    const data = await client.findQuizById(qid as string);

    setQuiz({
      points: 0,
      published: false,
      questions: [],
      quizType: "GRADED_QUIZ",
      assignmentGroup: "Quizzes",
      shuffleAnswers: true,
      timeLimit: 20,
      multipleAttempts: false,
      maxAttempts: 1,
      showCorrectAnswers: "NEVER",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      availableDate: null,
      untilDate: null,
      dueDate: null,
      ...(data as any),
    });
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!isStudent) {
      loadQuiz();
    } else {
      setQuiz(null);
    }
  }, [qid, isStudent]);

  const updateField = (field: keyof Quiz, value: any) => {
    if (!quiz) return;
    setQuiz({ ...quiz, [field]: value });
  };

  const updateQuestion = (index: number, patch: Partial<Question>) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    questions[index] = { ...questions[index], ...patch };
    setQuiz({ ...quiz, questions });
  };

  const updateChoice = (qIndex: number, choiceIndex: number, value: string) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const q = { ...questions[qIndex] };
    const choices = [...(q.choices || [])];
    choices[choiceIndex] = value;
    q.choices = choices;
    questions[qIndex] = q;
    setQuiz({ ...quiz, questions });
  };

  const addChoice = (qIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const q = { ...questions[qIndex] };
    const choices = [...(q.choices || [])];
    choices.push("");
    q.choices = choices;
    if (typeof q.correctChoice !== "number") {
      q.correctChoice = 0;
    }
    questions[qIndex] = q;
    setQuiz({ ...quiz, questions });
  };

  const deleteChoice = (qIndex: number, choiceIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const q = { ...questions[qIndex] };
    const choices = [...(q.choices || [])];
    if (choices.length <= 1) {
      // keep at least one choice to avoid empty array weirdness
      return;
    }
    choices.splice(choiceIndex, 1);
    let correct = q.correctChoice ?? 0;
    if (correct === choiceIndex) {
      correct = 0;
    } else if (choiceIndex < correct) {
      correct = correct - 1;
    }
    q.choices = choices;
    q.correctChoice = correct;
    questions[qIndex] = q;
    setQuiz({ ...quiz, questions });
  };

  const addFillBlankAnswer = (qIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const q = { ...questions[qIndex] };
    const answers = [...(q.correctAnswers || [])];
    answers.push("");
    q.correctAnswers = answers;
    questions[qIndex] = q;
    setQuiz({ ...quiz, questions });
  };

  const updateFillBlankAnswer = (
    qIndex: number,
    answerIndex: number,
    value: string
  ) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const q = { ...questions[qIndex] };
    const answers = [...(q.correctAnswers || [])];
    answers[answerIndex] = value;
    q.correctAnswers = answers;
    questions[qIndex] = q;
    setQuiz({ ...quiz, questions });
  };

  const deleteFillBlankAnswer = (qIndex: number, answerIndex: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    const q = { ...questions[qIndex] };
    const answers = [...(q.correctAnswers || [])];
    if (answers.length <= 1) return;
    answers.splice(answerIndex, 1);
    q.correctAnswers = answers;
    questions[qIndex] = q;
    setQuiz({ ...quiz, questions });
  };

  const addQuestion = () => {
    if (!quiz) return;
    const newQuestion: Question = {
      title: "New Question",
      type: "MULTIPLE_CHOICE",
      points: 1,
      choices: ["Possible Answer", "Possible Answer"],
      correctChoice: 0,
      correctAnswers: [],
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const deleteQuestion = (index: number) => {
    if (!quiz) return;
    const questions = [...quiz.questions];
    questions.splice(index, 1);
    setQuiz({ ...quiz, questions });
  };

  const onSave = async () => {
    if (!quiz) return;
    setSaving(true);
    try {
      await client.updateQuiz(quiz);
      if (cid && qid) {
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      } else {
        router.back();
      }
    } finally {
      setSaving(false);
    }
  };

  const onSaveAndPublish = async () => {
    if (!quiz) return;
    setSaving(true);
    try {
      const updated: Quiz = { ...quiz, published: true };
      await client.updateQuiz(updated);
      if (cid) {
        router.push(`/Courses/${cid}/Quizzes`);
      } else {
        router.back();
      }
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    router.back();
  };

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
        <Alert variant="danger" className="mb-3">
          You do not have permission to edit quizzes.
        </Alert>
        <Button
          variant="outline-secondary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
        >
          Back to Quiz Details
        </Button>
      </div>
    );
  }

  if (!quiz) {
    return <div className="p-3">Loading quiz.</div>;
  }

  const totalPointsFromQuestions = quiz.questions.reduce(
    (sum, q) => sum + (typeof q.points === "number" ? q.points : 0),
    0
  );

  const renderFooterButtons = () => (
    <div className="mt-3 d-flex gap-2">
      <Button variant="secondary" onClick={onCancel} disabled={saving}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onSave} disabled={saving}>
        Save
      </Button>
      <Button variant="success" onClick={onSaveAndPublish} disabled={saving}>
        Save &amp; Publish
      </Button>
    </div>
  );

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h3 className="mb-1">Edit Quiz</h3>
          <div className="text-muted small">{quiz.title || "Unnamed Quiz"}</div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "DETAILS" ? "active" : ""}`}
            onClick={() => setActiveTab("DETAILS")}
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "QUESTIONS" ? "active" : ""}`}
            onClick={() => setActiveTab("QUESTIONS")}
          >
            Questions
          </button>
        </li>
      </ul>

      <Row>
        <Col md={8}>
          {activeTab === "DETAILS" && (
            <>
              <Card className="mb-3">
                <Card.Body>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Quiz Title</Form.Label>
                    <Form.Control
                      value={quiz.title}
                      onChange={(e) => updateField("title", e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={quiz.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Quiz Type
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        value={quiz.quizType || "GRADED_QUIZ"}
                        onChange={(e) =>
                          updateField(
                            "quizType",
                            e.target.value as Quiz["quizType"]
                          )
                        }
                      >
                        <option value="GRADED_QUIZ">Graded Quiz</option>
                        <option value="PRACTICE_QUIZ">Practice Quiz</option>
                        <option value="GRADED_SURVEY">Graded Survey</option>
                        <option value="UNGRADED_SURVEY">Ungraded Survey</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Assignment Group
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        value={quiz.assignmentGroup || "Quizzes"}
                        onChange={(e) =>
                          updateField(
                            "assignmentGroup",
                            e.target.value as Quiz["assignmentGroup"]
                          )
                        }
                      >
                        <option value="Quizzes">Quizzes</option>
                        <option value="Exams">Exams</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Project">Project</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Points
                    </Form.Label>
                    <Col sm={3}>
                      <Form.Control
                        type="number"
                        value={quiz.points ?? 0}
                        onChange={(e) =>
                          updateField("points", Number(e.target.value) || 0)
                        }
                      />
                    </Col>
                    <Col sm={6} className="d-flex align-items-center">
                      <span className="text-muted small">
                        Total from questions: {totalPointsFromQuestions}
                      </span>
                    </Col>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="quiz-published"
                      label="Published"
                      checked={!!quiz.published}
                      onChange={(e) =>
                        updateField("published", e.target.checked)
                      }
                    />
                  </Form.Group>

                  <hr />

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                      Shuffle Answers
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Check
                        type="switch"
                        checked={!!quiz.shuffleAnswers}
                        onChange={(e) =>
                          updateField("shuffleAnswers", e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                      Time Limit (minutes)
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="number"
                        value={quiz.timeLimit ?? ""}
                        onChange={(e) =>
                          updateField(
                            "timeLimit",
                            e.target.value === ""
                              ? null
                              : Number(e.target.value) || 0
                          )
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                      Multiple Attempts
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Check
                        type="switch"
                        checked={!!quiz.multipleAttempts}
                        onChange={(e) =>
                          updateField("multipleAttempts", e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>

                  {quiz.multipleAttempts && (
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm={6}>
                        How Many Attempts
                      </Form.Label>
                      <Col sm={6}>
                        <Form.Control
                          type="number"
                          min={1}
                          value={quiz.maxAttempts ?? 1}
                          onChange={(e) =>
                            updateField(
                              "maxAttempts",
                              Number(e.target.value) || 1
                            )
                          }
                        />
                      </Col>
                    </Form.Group>
                  )}

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                      Show Correct Answers
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Select
                        value={quiz.showCorrectAnswers || "NEVER"}
                        onChange={(e) =>
                          updateField(
                            "showCorrectAnswers",
                            e.target.value as Quiz["showCorrectAnswers"]
                          )
                        }
                      >
                        <option value="NEVER">Never</option>
                        <option value="IMMEDIATELY">Immediately</option>
                        <option value="AFTER_DUE">After Due Date</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                      Access Code
                    </Form.Label>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        value={quiz.accessCode || ""}
                        onChange={(e) =>
                          updateField("accessCode", e.target.value)
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                      One Question at a Time
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Check
                        type="switch"
                        checked={!!quiz.oneQuestionAtATime}
                        onChange={(e) =>
                          updateField("oneQuestionAtATime", e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                      Webcam Required
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Check
                        type="switch"
                        checked={!!quiz.webcamRequired}
                        onChange={(e) =>
                          updateField("webcamRequired", e.target.checked)
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={6}>
                      Lock Questions After Answering
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Check
                        type="switch"
                        checked={!!quiz.lockQuestionsAfterAnswering}
                        onChange={(e) =>
                          updateField(
                            "lockQuestionsAfterAnswering",
                            e.target.checked
                          )
                        }
                      />
                    </Col>
                  </Form.Group>

                  <hr />

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Due
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="datetime-local"
                        value={toLocalInputValue(quiz.dueDate)}
                        onChange={(e) =>
                          updateField(
                            "dueDate",
                            fromLocalInputValue(e.target.value)
                          )
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                      Available From
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="datetime-local"
                        value={toLocalInputValue(quiz.availableDate)}
                        onChange={(e) =>
                          updateField(
                            "availableDate",
                            fromLocalInputValue(e.target.value)
                          )
                        }
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-0">
                    <Form.Label column sm={3}>
                      Until
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="datetime-local"
                        value={toLocalInputValue(quiz.untilDate)}
                        onChange={(e) =>
                          updateField(
                            "untilDate",
                            fromLocalInputValue(e.target.value)
                          )
                        }
                      />
                    </Col>
                  </Form.Group>
                </Card.Body>
              </Card>

              {renderFooterButtons()}
            </>
          )}

          {activeTab === "QUESTIONS" && (
            <>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Questions</span>
                  <Button size="sm" onClick={addQuestion}>
                    + New
                  </Button>
                </Card.Header>
                <ListGroup variant="flush">
                  {quiz.questions.map((q, idx) => {
                    const choices =
                      q.type === "MULTIPLE_CHOICE"
                        ? q.choices && q.choices.length > 0
                          ? q.choices
                          : [""]
                        : q.choices || [];

                    const answers =
                      q.type === "FILL_IN_BLANK"
                        ? q.correctAnswers && q.correctAnswers.length > 0
                          ? q.correctAnswers
                          : [""]
                        : q.correctAnswers || [];

                    return (
                      <ListGroupItem key={q._id ?? idx}>
                        <Row className="align-items-center mb-3">
                          <Col sm={6}>
                            <Form.Group className="mb-0 d-flex align-items-center gap-2">
                              <Form.Label className="mb-0">
                                Question:
                              </Form.Label>
                              <Form.Control
                                value={q.title}
                                onChange={(e) =>
                                  updateQuestion(idx, {
                                    title: e.target.value,
                                  })
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={4}>
                            <Form.Group className="mb-0">
                              <Form.Select
                                value={q.type}
                                onChange={(e) =>
                                  updateQuestion(idx, {
                                    type: e.target.value as QuestionType,
                                  })
                                }
                              >
                                <option value="MULTIPLE_CHOICE">
                                  Multiple Choice
                                </option>
                                <option value="TRUE_FALSE">True / False</option>
                                <option value="FILL_IN_BLANK">
                                  Fill in the Blank
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col sm={2} className="text-end">
                            <Form.Group className="mb-0 d-flex align-items-center justify-content-end gap-1">
                              <span className="text-muted small">pts:</span>
                              <Form.Control
                                style={{ width: "70px" }}
                                type="number"
                                value={q.points}
                                onChange={(e) =>
                                  updateQuestion(idx, {
                                    points: Number(e.target.value) || 0,
                                  })
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Question Text</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={q.title}
                            onChange={(e) =>
                              updateQuestion(idx, { title: e.target.value })
                            }
                          />
                        </Form.Group>

                        <h6 className="mb-2">Answers:</h6>

                        {q.type === "MULTIPLE_CHOICE" && (
                          <>
                            {choices.map((choice, cIdx) => (
                              <Row
                                className="align-items-center mb-2"
                                key={cIdx}
                              >
                                <Col sm={1} className="text-center">
                                  <Form.Check
                                    type="radio"
                                    name={`mc-correct-${idx}`}
                                    checked={q.correctChoice === cIdx}
                                    onChange={() =>
                                      updateQuestion(idx, {
                                        correctChoice: cIdx,
                                      })
                                    }
                                  />
                                </Col>
                                <Col sm={10}>
                                  <Form.Control
                                    value={choice}
                                    placeholder={
                                      q.correctChoice === cIdx
                                        ? "Correct Answer"
                                        : "Possible Answer"
                                    }
                                    onChange={(e) =>
                                      updateChoice(idx, cIdx, e.target.value)
                                    }
                                  />
                                </Col>
                                <Col sm={1} className="text-end">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => deleteChoice(idx, cIdx)}
                                  >
                                    <FaRegTrashAlt />
                                  </Button>
                                </Col>
                              </Row>
                            ))}
                            <Button
                              variant="link"
                              size="sm"
                              className="mt-1 p-0"
                              onClick={() => addChoice(idx)}
                            >
                              + Add Another Answer
                            </Button>
                          </>
                        )}

                        {q.type === "TRUE_FALSE" && (
                          <Form.Group className="mb-2">
                            <Form.Check
                              type="radio"
                              id={`tf-${idx}-true`}
                              name={`tf-${idx}`}
                              label="True"
                              checked={q.correctChoice === 1}
                              onChange={() =>
                                updateQuestion(idx, { correctChoice: 1 })
                              }
                              className="mb-1"
                            />
                            <Form.Check
                              type="radio"
                              id={`tf-${idx}-false`}
                              name={`tf-${idx}`}
                              label="False"
                              checked={q.correctChoice !== 1}
                              onChange={() =>
                                updateQuestion(idx, { correctChoice: 0 })
                              }
                            />
                          </Form.Group>
                        )}

                        {q.type === "FILL_IN_BLANK" && (
                          <>
                            {(q.correctAnswers && q.correctAnswers.length > 0
                              ? q.correctAnswers
                              : [""]
                            ).map((ans, aIdx) => (
                              <Row
                                key={aIdx}
                                className="align-items-center mb-2"
                              >
                                <Col sm={3} className="text-end">
                                  <Form.Label className="mb-0 small text-muted">
                                    Possible Answer:
                                  </Form.Label>
                                </Col>
                                <Col sm={8}>
                                  <Form.Control
                                    value={ans}
                                    placeholder="e.g. 2"
                                    onChange={(e) =>
                                      updateFillBlankAnswer(
                                        idx,
                                        aIdx,
                                        e.target.value
                                      )
                                    }
                                  />
                                </Col>
                                <Col sm={1} className="text-end">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() =>
                                      deleteFillBlankAnswer(idx, aIdx)
                                    }
                                  >
                                    🗑
                                  </Button>
                                </Col>
                              </Row>
                            ))}

                            <Button
                              variant="link"
                              size="sm"
                              className="mt-1 p-0"
                              onClick={() => addFillBlankAnswer(idx)}
                            >
                              + Add Another Answer
                            </Button>
                          </>
                        )}

                        <div className="d-flex justify-content-end mt-3">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteQuestion(idx)}
                          >
                            Delete
                          </Button>
                        </div>
                      </ListGroupItem>
                    );
                  })}
                  {quiz.questions.length === 0 && (
                    <ListGroupItem className="text-muted">
                      No questions yet. Click &quot;New Question&quot; to get
                      started.
                    </ListGroupItem>
                  )}
                </ListGroup>
              </Card>

              {renderFooterButtons()}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
