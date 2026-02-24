import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Features {
    pointsPlayer1: Points;
    pointsPlayer2: Points;
    gameField: GameField;
    gameId: GameId;
    charactersPlayer1: Character;
    charactersPlayer2: Character;
    pointsDiffPlayer1: PointsDiff;
    pointsDiffPlayer2: PointsDiff;
}
export type Points = bigint;
export type Character = string;
export type GameId = bigint;
export type PointsDiff = bigint;
export type GameField = Array<Character>;
export interface backendInterface {
    updateGameState(gameField: GameField, isPlayer1: boolean): Promise<Features>;
}
