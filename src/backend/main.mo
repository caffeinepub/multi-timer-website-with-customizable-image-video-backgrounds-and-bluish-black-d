import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";

actor {
  // Game types
  type TileIndex = Nat; // index of the tile
  type Character = Text; // emoticon type
  type Points = Nat;
  type Move = { tile : TileIndex; character : Character };
  type PointsDiff = Int;
  type GameId = Nat;

  type GameField = [Character];
  type Features = {
    gameField : GameField;
    charactersPlayer1 : Character;
    charactersPlayer2 : Character;
    pointsPlayer1 : Points;
    pointsPlayer2 : Points;
    pointsDiffPlayer1 : PointsDiff;
    pointsDiffPlayer2 : PointsDiff;
    gameId : GameId;
  };

  // Original field types mapped to backend types
  let gameStartCharacters = ["x", "0"];
  let fieldSize = 9;
  let winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // For the core logic we only need an empty array as a persistent field
  let persistentState : [GameField] = [];

  // Helper functions
  func isGameWon(gameField : GameField, character : Character) : Bool {
    winCombinations.any(
      func(combination) {
        combination.all(
          func(index) {
            gameField[index] == character;
          }
        );
      }
    );
  };

  func isTie(gameField : GameField) : Bool {
    gameField.all(
      func(cell) {
        cell != "";
      }
    );
  };

  func countSymbol(gameField : GameField, symbol : Character) : Nat {
    var counter = 0;
    for (cell in gameField.values()) {
      if (cell == symbol) {
        counter += 1;
      };
    };
    counter;
  };

  func updateGameField(gameField : GameField, tile : Nat, character : Character) : GameField {
    Array.tabulate<Character>(gameField.size(), func(i) { if (i == tile) { character } else { gameField[i] } });
  };

  public func updateGameState(gameField : GameField, isPlayer1 : Bool) : async Features {
    let (character1, character2) = (gameStartCharacters[0], gameStartCharacters[1]);
    let (winsPlayer1, winsPlayer2) = (isGameWon(gameField, character1), isGameWon(gameField, character2));
    let (pointsPlayer1, pointsPlayer2) = (
      countSymbol(gameField, character1),
      countSymbol(gameField, character2),
    );
    let pointsDiff = Int.abs(pointsPlayer1.toInt() - pointsPlayer2);

    {
      gameField;
      charactersPlayer1 = character1;
      charactersPlayer2 = character2;
      pointsPlayer1;
      pointsPlayer2;
      pointsDiffPlayer1 = pointsDiff;
      pointsDiffPlayer2 = pointsDiff - 3;
      gameId = 0;
    };
  };
};
