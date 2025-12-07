import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`
  );
  return data;
};

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(COURSES_API, course);
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};

export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return data;
};

export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  const response = await axios.delete(
    `${COURSES_API}/${courseId}/modules/${moduleId}`
  );
  return response.data;
};

export const updateModule = async (courseId: string, module: any) => {
 const { data } = await axios.put(
   `${COURSES_API}/${courseId}/modules/${module._id}`,
   module
 );
 return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return data;
};

export const createAssignmentForCourse = async (courseId: string, doc: any) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/assignments`,
    doc
  );
  return data;
};

export const updateAssignment = async (assignment: any) => {
  const { data } = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
  return data;
};
export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};

export const getMyEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/enrollments`
  );
  return data;
};
export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(
    `${USERS_API}/${userId}/courses/${courseId}`
  );
  return response.data;
};
export const findAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};
export const findUsersForCourse = async (courseId: string) => {
 const response = await axios.get(`${COURSES_API}/${courseId}/users`);
 return response.data;
};

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return data;
};

export const createQuizForCourse = async (courseId: string, quiz: any = {}) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quiz
  );
  return data;
};

export const findQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return data;
};

export const updateQuiz = async (quiz: any) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz._id}`,
    quiz
  );
  return data;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}`
  );
  return data;
};


export const createQuizAttempt = async (
  quizId: string,
  answers: any[]
) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    { answers }
  );
  return data;
};

export const findMyQuizAttempts = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts/me`
  );
  return data;
};

export const currentUser = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${USERS_API}/current`);

    if (data && typeof data === "object") {
      if ("currentUser" in data && (data as any).currentUser) {
        return (data as any).currentUser;
      }
      return data;
    }

    return null;
  } catch (e) {
    console.error("Failed to load current user in client.currentUser()", e);
    return null;
  }
};
