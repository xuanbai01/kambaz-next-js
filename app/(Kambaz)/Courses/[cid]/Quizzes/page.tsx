"use client";

import { useEffect, useState, MouseEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineAssignment } from "react-icons/md";
import axios from "axios";
import { FcOk, FcCancel } from "react-icons/fc";
import * as client from "../../client";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;

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

type Quiz = {
  _id?: string;
  course: string;
  title: string;
  description?: string;
  published?: boolean;
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

type QuizWithLastAttempt = Quiz & {
  lastAttempt?: Attempt;
};

type AvailabilityStatus = "NOT_SET" | "NOT_YET" | "AVAILABLE" | "CLOSED";

type User = {
  _id: string;
  username?: string;
  role?: string;
};

type SortKey = "NONE" | "NAME" | "DUE" | "AVAILABLE";

export default function QuizzesPage() {
  const { cid } = useParams();
  const router = useRouter();

  const [quizzes, setQuizzes] = useState<QuizWithLastAttempt[]>([]);
  const [attemptsByQuizId, setAttemptsByQuizId] = useState<
    Record<string, Attempt | undefined>
  >({});
  const [loadingScores, setLoadingScores] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [openMenuQuizId, setOpenMenuQuizId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("NONE");

  const isStudent = currentUser?.role === "STUDENT";
  const isFacultyLike = !!currentUser && currentUser.role !== "STUDENT";

  const computeAvailability = (quiz: Quiz): AvailabilityStatus => {
    const now = new Date();
    const available = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const until = quiz.untilDate ? new Date(quiz.untilDate) : null;

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

  const availabilityText = (quiz: Quiz): string => {
    const status = computeAvailability(quiz);
    const fmt = (d?: string) =>
      d
        ? new Date(d).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
          })
        : "";

    switch (status) {
      case "NOT_YET":
        return `Not available until ${fmt(quiz.availableDate)}`;
      case "CLOSED":
        return "Closed";
      case "AVAILABLE":
        return "Available";
      case "NOT_SET":
      default:
        return "No availability dates";
    }
  };

  const formatDue = (d?: string): string =>
    d
      ? `Due ${new Date(d).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "No due date";

  const totalPointsForQuiz = (quiz: Quiz): number => {
    const fromQuestions =
      quiz.questions?.reduce(
        (sum, q) => sum + (typeof q.points === "number" ? q.points : 0),
        0
      ) ?? 0;
    return fromQuestions > 0 ? fromQuestions : quiz.points ?? 0;
  };

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
    }
  };

  const loadQuizzes = async () => {
    if (!cid) return;

    const list = await client.findQuizzesForCourse(cid as string);
    const arr: QuizWithLastAttempt[] = Array.isArray(list) ? list : [];
    setQuizzes(arr);

    if (!isStudent || arr.length === 0) {
      setAttemptsByQuizId({});
      return;
    }

    setAttemptsByQuizId({});
    setLoadingScores(true);
    try {
      const attemptsMap: Record<string, Attempt | undefined> = {};

      await Promise.all(
        arr.map(async (q) => {
          if (!q._id) return;
          try {
            const attempts: Attempt[] = await client.findMyQuizAttempts(q._id);
            if (Array.isArray(attempts) && attempts.length > 0) {
              attemptsMap[q._id] = attempts[attempts.length - 1];
            }
          } catch (e) {
            console.error("Failed to load attempts for quiz", q._id, e);
          }
        })
      );

      setAttemptsByQuizId(attemptsMap);
      setQuizzes((prev) =>
        prev.map((q) => ({
          ...q,
          lastAttempt: q._id ? attemptsMap[q._id] : undefined,
        }))
      );
    } finally {
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [cid, currentUser?.role]);

  const onAddQuiz = async () => {
    if (!cid) return;
    const created = await client.createQuizForCourse(cid as string, {});
    setQuizzes((prev) => [...prev, created]);
    router.push(`/Courses/${cid}/Quizzes/${created._id}`);
  };

  const onDeleteQuiz = async (quizId: string) => {
    await client.deleteQuiz(quizId);
    setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    setAttemptsByQuizId((prev) => {
      const copy = { ...prev };
      delete copy[quizId];
      return copy;
    });
    if (openMenuQuizId === quizId) {
      setOpenMenuQuizId(null);
    }
  };

  const onTogglePublish = async (quiz: QuizWithLastAttempt) => {
    if (!quiz._id) return;
    await client.updateQuiz({
      ...quiz,
      published: !quiz.published,
    });
    setQuizzes((prev) =>
      prev.map((q) =>
        q._id === quiz._id ? { ...q, published: !quiz.published } : q
      )
    );
  };

  const onCopyQuiz = async (quiz: QuizWithLastAttempt) => {
    if (!cid) return;

    const { _id, lastAttempt, ...rest } = quiz;
    const payload: Partial<Quiz> = {
      ...rest,
      course: cid as string,
      title: quiz.title ? `${quiz.title} (Copy)` : "Untitled Quiz (Copy)",
      published: false,
    };

    const created = await client.createQuizForCourse(cid as string, payload);
    setQuizzes((prev) => [...prev, created]);
    setOpenMenuQuizId(null);
  };

  const handleMenuToggle = (
    e: MouseEvent<HTMLButtonElement>,
    quizId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuQuizId((prev) => (prev === quizId ? null : quizId));
  };

  const handleMenuAction = (e: MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const getAvailabilityLabel = (quiz: any) => {
    const now = new Date();
    const available = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const until = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (available && now < available) {
      return `Not available until ${available.toLocaleString()}`;
    }
    if (until && now > until) {
      return "Closed";
    }
    return "Available";
  };

  const sortedQuizzes: QuizWithLastAttempt[] = (() => {
    if (sortKey === "NONE") return quizzes;

    const list = [...quizzes];

    const getTimeOrMax = (d?: string) =>
      d ? new Date(d).getTime() : Number.MAX_SAFE_INTEGER;

    list.sort((a, b) => {
      switch (sortKey) {
        case "NAME": {
          const an = (a.title || "").toLowerCase();
          const bn = (b.title || "").toLowerCase();
          if (an < bn) return -1;
          if (an > bn) return 1;
          return 0;
        }
        case "DUE": {
          return getTimeOrMax(a.dueDate) - getTimeOrMax(b.dueDate);
        }
        case "AVAILABLE": {
          return getTimeOrMax(a.availableDate) - getTimeOrMax(b.availableDate);
        }
        default:
          return 0;
      }
    });

    return list;
  })();

  return (
    <div id="wd-quizzes" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quizzes</h3>
        {isFacultyLike && (
          <Button variant="danger" onClick={onAddQuiz}>
            + Quiz
          </Button>
        )}
      </div>

      <ListGroup className="rounded-0" id="wd-quiz-list">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            QUIZZES
            <div className="ms-auto d-flex align-items-center gap-2">
              <span className="border border-dark rounded-pill px-2 py-1">
                20% of Total
              </span>

              <div className="btn-group btn-group-sm" role="group">
                <button
                  type="button"
                  className={`btn btn-outline-light ${
                    sortKey === "NONE" ? "active" : ""
                  }`}
                  onClick={() => setSortKey("NONE")}
                >
                  Default
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-light ${
                    sortKey === "NAME" ? "active" : ""
                  }`}
                  onClick={() => setSortKey("NAME")}
                >
                  Name
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-light ${
                    sortKey === "DUE" ? "active" : ""
                  }`}
                  onClick={() => setSortKey("DUE")}
                >
                  Due
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-light ${
                    sortKey === "AVAILABLE" ? "active" : ""
                  }`}
                  onClick={() => setSortKey("AVAILABLE")}
                >
                  Available
                </button>
              </div>
            </div>
          </div>

          <ListGroup className="rounded-0">
            {sortedQuizzes.map((q) => {
              const id = q._id as string;
              const lastAttempt = q.lastAttempt ?? attemptsByQuizId[id];
              const totalPoints = totalPointsForQuiz(q);
              const numQuestions = q.questions?.length ?? 0;

              return (
                <ListGroupItem
                  key={id}
                  className="wd-quiz-list-item p-3 ps-1 d-flex align-items-start position-relative"
                >
                  <BsGripVertical className="me-2 fs-3 mt-1" />
                  <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <Link
                        href={`/Courses/${cid}/Quizzes/${id}`}
                        className="text-dark text-decoration-none fw-bold me-2"
                      >
                        {q.title || "Untitled Quiz"}
                      </Link>
                    </div>

                    <div className="text-muted small">
                      {q.description || "No description"}
                    </div>

                    <div className="text-muted small mt-1">
                      {availabilityText(q)} {" • "}
                      {formatDue(q.dueDate)} {" • "}
                      {totalPoints} pts {" • "}
                      {numQuestions} question
                      {numQuestions === 1 ? "" : "s"}
                    </div>

                    {isStudent &&
                      (lastAttempt ? (
                        <div className="text-muted small mt-1">
                          Score:{" "}
                          <strong>
                            {lastAttempt.score} / {lastAttempt.possibleScore}
                          </strong>{" "}
                          (Attempt {lastAttempt.attemptNumber})
                        </div>
                      ) : (
                        !loadingScores && (
                          <div className="text-muted small mt-1">
                            Score: &mdash;
                          </div>
                        )
                      ))}
                  </div>

                  {isFacultyLike && (
                    <div className="ms-2 d-flex flex-column align-items-center">
                      <button
                        type="button"
                        className="btn btn-link p-0 mb-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onTogglePublish(q);
                        }}
                        title={q.published ? "Unpublish quiz" : "Publish quiz"}
                      >
                        {q.published ? (
                          <FcOk className="fs-3" />
                        ) : (
                          <FcCancel className="fs-3" />
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-link text-muted p-0"
                        onClick={(e) => handleMenuToggle(e, id)}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {openMenuQuizId === id && (
                        <div
                          className="border rounded bg-white shadow-sm mt-1 p-2 d-flex flex-column gap-1"
                          style={{ minWidth: "160px", zIndex: 10 }}
                        >
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={(e) =>
                              handleMenuAction(e, () =>
                                router.push(`/Courses/${cid}/Quizzes/${id}`)
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={(e) =>
                              handleMenuAction(e, () => onTogglePublish(q))
                            }
                          >
                            {q.published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={(e) =>
                              handleMenuAction(e, () => onCopyQuiz(q))
                            }
                          >
                            Copy
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={(e) =>
                              handleMenuAction(e, () => onDeleteQuiz(id))
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
