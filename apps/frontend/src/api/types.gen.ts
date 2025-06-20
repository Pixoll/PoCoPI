// This file is auto-generated by @hey-api/openapi-ts

export type UserSummary = {
  /**
   * The ID of the user.
   */
  id: string;
  /**
   * The real name of the user. "Anonymous" if it's an anon. user.
   */
  name: string;
  /**
   * The email of the user. Only present if it's not an anon. user.
   */
  email?: string;
  /**
   * The age of the user. Only present if it's not an anon. user.
   */
  age?: number;
  /**
   * The test group that was assigned to this user.
   */
  group: string;
  /**
   * Timestamp at which the user started the test.
   */
  timestamp: number;
  /**
   * Total time taken (in milliseconds) by the user to complete the test.
   */
  timeTaken: number;
  /**
   * Number of correctly answered questions.
   */
  correctQuestions: number;
  /**
   * Total number of questions answered.
   */
  questionsAnswered: number;
  /**
   * Accuracy of the user's answers.
   */
  accuracy: number;
};

export type Summary = {
  /**
   * The average accuracy of the users' answers.
   */
  averageAccuracy: number;
  /**
   * The average time taken (in milliseconds) to complete the tese.
   */
  averageTimeTaken: number;
  /**
   * Total number of questions that have been answered.
   */
  totalQuestionsAnswered: number;
  /**
   * Summary for each user that has answered the test.
   */
  users: Array<UserSummary>;
};

export type TimelogEventDto = {
  /**
   * The type of the event.
   */
  type: "deselect" | "hover" | "select";
  /**
   * The ID of the option (with respect to the question ID) this event corresponds to.
   */
  optionId: number;
  /**
   * The timestamp at which this event was triggered.
   */
  timestamp: number;
};

export type TimelogDto = {
  /**
   * The ID of the user.
   */
  userId: string;
  /**
   * The ID of the test phase.
   */
  phaseId: number;
  /**
   * The ID of the test question with respect to the phase ID.
   */
  questionId: number;
  /**
   * Timestamp at which the timelog began recording.
   */
  startTimestamp: number;
  /**
   * Timestamp at which the timelog stopped recording.
   */
  endTimestamp: number;
  /**
   * Whether the user responded correctly.
   */
  correct: boolean;
  /**
   * Whether the question was skipped.
   */
  skipped: boolean;
  /**
   * How many times the user changed the selected option before sending/skipping.
   */
  totalOptionChanges: number;
  /**
   * How many options the user hovered the mouse on.
   */
  totalOptionHovers: number;
  /**
   * List of events recorded.
   */
  events: Array<TimelogEventDto>;
};

export type HttpException = {
  /**
   * Short description of the HTTP error
   */
  message: string;
  /**
   * The HTTP status code
   */
  statusCode: number;
  /**
   * Name of the HTTP status code
   */
  error?: string;
};

export type TimelogEvent = {
  /**
   * The type of the event.
   */
  type: "deselect" | "hover" | "select";
  /**
   * The ID of the option (with respect to the question ID) this event corresponds to.
   */
  optionId: number;
  /**
   * The timestamp at which this event was triggered.
   */
  timestamp: number;
};

export type Timelog = {
  /**
   * The ID of the user.
   */
  userId: string;
  /**
   * The ID of the test phase.
   */
  phaseId: number;
  /**
   * The ID of the test question with respect to the phase ID.
   */
  questionId: number;
  /**
   * Timestamp at which the timelog began recording.
   */
  startTimestamp: number;
  /**
   * Timestamp at which the timelog stopped recording.
   */
  endTimestamp: number;
  /**
   * Whether the user responded correctly.
   */
  correct: boolean;
  /**
   * Whether the question was skipped.
   */
  skipped: boolean;
  /**
   * How many times the user changed the selected option before sending/skipping.
   */
  totalOptionChanges: number;
  /**
   * How many options the user hovered the mouse on.
   */
  totalOptionHovers: number;
  /**
   * List of events recorded.
   */
  events: Array<TimelogEvent>;
};

export type UserDto = {
  /**
   * Whether the user is anonymous or not.
   */
  anonymous: boolean;
  /**
   * The ID of the user.
   */
  id: string;
  /**
   * The test group that was assigned to this user.
   */
  group: string;
  /**
   * The real name of the user. Required if not an anon. user.
   */
  name?: string;
  /**
   * The email of the user. Required if not an anon. user.
   */
  email?: string;
  /**
   * The age of the user. Required if not an anon. user.
   */
  age?: number;
};

export type User = {
  /**
   * Whether the user is anonymous or not.
   */
  anonymous: boolean;
  /**
   * The ID of the user.
   */
  id: string;
  /**
   * The test group that was assigned to this user.
   */
  group: string;
  /**
   * The real name of the user. Required if not an anon. user.
   */
  name?: string;
  /**
   * The email of the user. Required if not an anon. user.
   */
  email?: string;
  /**
   * The age of the user. Required if not an anon. user.
   */
  age?: number;
};

export type GetSummaryData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/dashboard";
};

export type GetSummaryResponses = {
  /**
   * Successfully obtained user data and timelogs summary.
   */
  200: Summary;
};

export type GetSummaryResponse = GetSummaryResponses[keyof GetSummaryResponses];

export type GetAllTimelogsData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/timelogs";
};

export type GetAllTimelogsResponses = {
  /**
   * Successfully retrieved the list of timelogs.
   */
  200: Array<Timelog>;
};

export type GetAllTimelogsResponse = GetAllTimelogsResponses[keyof GetAllTimelogsResponses];

export type SaveTimelogData = {
  body: TimelogDto;
  path?: never;
  query?: never;
  url: "/timelogs";
};

export type SaveTimelogErrors = {
  /**
   * Validation errors (body).
   */
  400: HttpException;
};

export type SaveTimelogError = SaveTimelogErrors[keyof SaveTimelogErrors];

export type SaveTimelogResponses = {
  /**
   * Successfully saved the timelog.
   */
  201: unknown;
};

export type GetUsersData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/users";
};

export type GetUsersResponses = {
  /**
   * Successfully retried the list of all users.
   */
  200: Array<User>;
};

export type GetUsersResponse = GetUsersResponses[keyof GetUsersResponses];

export type SaveUserData = {
  body: UserDto;
  path?: never;
  query?: never;
  url: "/users";
};

export type SaveUserErrors = {
  /**
   * Validation errors (body).
   */
  400: HttpException;
  /**
   * User already exists.
   */
  409: HttpException;
};

export type SaveUserError = SaveUserErrors[keyof SaveUserErrors];

export type SaveUserResponses = {
  /**
   * Successfully registered user.
   */
  201: unknown;
};

export type GetUserTimelogsData = {
  body?: never;
  path: {
    id: string;
  };
  query?: never;
  url: "/users/{id}/timelogs";
};

export type GetUserTimelogsErrors = {
  /**
   * User does not exist.
   */
  404: HttpException;
};

export type GetUserTimelogsError = GetUserTimelogsErrors[keyof GetUserTimelogsErrors];

export type GetUserTimelogsResponses = {
  /**
   * Successfully retried the list of timelogs.
   */
  200: Array<Timelog>;
};

export type GetUserTimelogsResponse = GetUserTimelogsResponses[keyof GetUserTimelogsResponses];

export type PingData = {
  body?: never;
  path?: never;
  query?: never;
  url: "/ping";
};

export type PingResponses = {
  200: unknown;
};

export type ClientOptions = {
  baseUrl: `${string}://api` | (string & {});
};
