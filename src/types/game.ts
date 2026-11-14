// ----------------------------------------------------------------------
// Mirrors the backend contracts in backend/Dtos/Public/Game and
// backend/Dtos/Public/Category. Keep in sync with the API.
// ----------------------------------------------------------------------

export enum GameStatus {
  Pending = 1,
  Confirmed = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum QuestionType {
  MultipleChoice = 1,
  TrueFalse = 2,
  Text = 3,
  // Option answer is an absolute http(s) image URL.
  ImageChoice = 4,
  // Option answer is a #RRGGBB hex colour.
  ColorChoice = 5,
}

export const isVisualQuestionType = (type: QuestionType) =>
  type === QuestionType.ImageChoice || type === QuestionType.ColorChoice;

export enum GameProgressAction {
  AnswerQuestion = 1,
  SwapQuestion = 2,
  RemoveTwoOptions = 3,
}

// Mirrors backend Constants.MinOptionsForRemoveTwo.
export const MIN_OPTIONS_FOR_REMOVE_TWO = 4;

// ----------------------------------------------------------------------
// GET /public/Category/GetCategories
// ----------------------------------------------------------------------

export type SubCategory = {
  id: number;
  name: string;
  isAvailable: boolean;
};

export type Category = {
  id: number;
  name: string;
  subCategories: SubCategory[];
};

// ----------------------------------------------------------------------
// POST /public/Game/CreateGame
// ----------------------------------------------------------------------

export type TeamSetupInput = {
  name: string;
  players: string[];
};

export type CreateGameInput = {
  teamInput: { teams: TeamSetupInput[] };
  categoryId: number;
  subCategoryIds: number[];
};

export type CreateGameOutput = {
  id: number;
  code: string;
};

// ----------------------------------------------------------------------
// GET /public/Game/GetGameDetails/{gameCode}
// PATCH /public/Game/UpdateGameProgress/{gameCode}
// ----------------------------------------------------------------------

export type GameAnswerOption = {
  id: number;
  answerText: string;
  // Hidden by the API until the cell is answered.
  isCorrect: boolean | null;
};

export type GameQuestion = {
  id: number;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  subCategoryId: number;
  subCategoryName: string;
  answers: GameAnswerOption[];
  solvedByTeamId: number | null;
  selectedAnswerId: number | null;
  // Wrong options hidden by this cell's "remove two"; empty if not used.
  removedAnswerIds: number[];
};

export type GameTeam = {
  id: number;
  name: string;
  players: string[];
  score: number;
  hasUsedSwap: boolean;
  hasUsedRemoveTwo: boolean;
};

export type GameDetails = {
  teams: GameTeam[];
  questions: GameQuestion[];
  gameStatus: GameStatus;
  currentTurnTeamId: number | null;
};

export type UpdateGameProgressInput = {
  action: GameProgressAction;
  teamId: number;
  questionId: number;
  selectedQuestionOptionId?: number | null;
};

// ----------------------------------------------------------------------
// POST /public/Game/CompleteGame/{gameCode}
// ----------------------------------------------------------------------

export type CompleteGameTeam = {
  id: number;
  name: string;
  score: number;
};

export type CompleteGameOutput = {
  gameStatus: GameStatus;
  teams: CompleteGameTeam[];
  winnerTeamId: number | null;
  isTie: boolean;
};

// ----------------------------------------------------------------------
// POST /public/Question/AddQuestion
// ----------------------------------------------------------------------

export type AddQuestionOptionInput = {
  answer: string;
  isCorrect: boolean;
};

export type AddQuestionInput = {
  title: string;
  hint?: string;
  mark: number;
  type: QuestionType;
  questionSubCategoryId: number;
  options: AddQuestionOptionInput[];
};

export type AddQuestionOutput = {
  id: number;
};
