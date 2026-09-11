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
}

export enum GameProgressAction {
  AnswerQuestion = 1,
  SwapQuestion = 2,
}

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
};

export type GameTeam = {
  id: number;
  name: string;
  players: string[];
  score: number;
  hasUsedSwap: boolean;
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
