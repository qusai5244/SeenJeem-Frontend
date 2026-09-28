import type {
  Category,
  GameDetails,
  CreateGameInput,
  AddQuestionInput,
  CreateGameOutput,
  AddQuestionOutput,
  CompleteGameOutput,
  UpdateGameProgressInput,
} from 'src/types/game';

import { endpoints, ApiRequestType, apiFetcher } from 'src/lib/axios';

// ----------------------------------------------------------------------

export const getCategories = () =>
  apiFetcher<Category[]>(endpoints.game.categories, ApiRequestType.Get);

export const createGame = (input: CreateGameInput) =>
  apiFetcher<CreateGameOutput>(endpoints.game.create, ApiRequestType.Post, undefined, input);

export const getGameDetails = (gameCode: string) =>
  apiFetcher<GameDetails>(endpoints.game.details(gameCode), ApiRequestType.Get);

export const updateGameProgress = (gameCode: string, input: UpdateGameProgressInput) =>
  apiFetcher<GameDetails>(
    endpoints.game.progress(gameCode),
    ApiRequestType.Patch,
    undefined,
    input
  );

export const completeGame = (gameCode: string) =>
  apiFetcher<CompleteGameOutput>(endpoints.game.complete(gameCode), ApiRequestType.Post);

export const addQuestion = (input: AddQuestionInput) =>
  apiFetcher<AddQuestionOutput>(endpoints.game.addQuestion, ApiRequestType.Post, undefined, input);
