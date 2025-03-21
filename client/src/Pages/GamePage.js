import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GamePage.css"; 

const GamePage = () => {
  const [gameState, setGameState] = useState({
    selectedCircle: null,
    selectedAction: null,
    happinessScores: [0, 0, 0],
    gameStarted: false,
    timeRemaining: 60, // 60 seconds countdown
    currentRound: 1,
    gameOver: false, // Track game over state
  });

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  const [totalHappiness, setTotalHappiness] = useState(0); // Track total happiness

  const [circles, setCircles] = useState([
    [{ name: "Sam", likes: ["compliment"], dislikes: ["help"] }],
    [{ name: "Alex", likes: ["help"], dislikes: ["compliment"] }],
    [{ name: "Jordan", likes: ["invite to event"], dislikes: [] }],
  ]);

  const characters = [
    { name: "Sam", likes: ["compliment"], dislikes: ["help"] },
    { name: "Alex", likes: ["help"], dislikes: ["compliment"] },
    { name: "Jordan", likes: ["invite to event"], dislikes: [] },
    { name: "Jamie", likes: ["compliment"], dislikes: ["invite to event"] },
    { name: "Taylor", likes: ["help"], dislikes: ["compliment"] },
    { name: "Morgan", likes: ["invite to event"], dislikes: ["help"] },
    { name: "Pat", likes: ["compliment"], dislikes: ["help"] },
    { name: "Chris", likes: ["offer help"], dislikes: ["compliment"] },
    { name: "Jordan", likes: ["invite to event"], dislikes: ["compliment"] },
  ];

  const calculateHappiness = (action, character) => {
    let happinessChange = 0;
    switch (action) {
      case "compliment":
        happinessChange = character.likes.includes("compliment")
          ? 2
          : character.dislikes.includes("compliment")
          ? -1
          : 0;
        break;
      case "offer help":
        happinessChange = character.likes.includes("offer help")
          ? 1
          : character.dislikes.includes("offer help")
          ? -2
          : 0;
        break;
      case "invite to event":
        happinessChange = character.likes.includes("invite to event")
          ? 3
          : character.dislikes.includes("invite to event")
          ? -3
          : 0;
        break;
      default:
        break;
    }
    return happinessChange;
  };

  const handleActionSelection = (circleIndex, action) => {
    if (!gameState.gameStarted || gameState.gameOver) return; // Don't allow action if the game is over

    const newHappinessScores = [...gameState.happinessScores];
    let happinessChangeInRound = 0;
    circles[circleIndex].forEach((character) => {
      const happinessChange = calculateHappiness(action, character);
      newHappinessScores[circleIndex] += happinessChange;
      happinessChangeInRound += happinessChange;
    });

    // Update total happiness
    setTotalHappiness((prevTotal) => prevTotal + happinessChangeInRound);

    setGameState({
      ...gameState,
      selectedCircle: circleIndex,
      selectedAction: action,
      happinessScores: newHappinessScores,
    });

    // Start the next round with randomized groups
    nextRound();
  };

  const startGame = () => {
    setGameState({ ...gameState, gameStarted: true });
  };

  const nextRound = () => {
    setGameState({
      ...gameState,
      currentRound: gameState.currentRound + 1,
    });

    // Randomize groups
    const shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
    setCircles([
      shuffledCharacters.slice(0, 3),
      shuffledCharacters.slice(3, 6),
      shuffledCharacters.slice(6, 9),
    ]);
  };

  useEffect(() => {
    if (gameState.gameStarted && gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setGameState((prevState) => ({
          ...prevState,
          timeRemaining: prevState.timeRemaining - 1,
        }));
      }, 1000);
      return () => clearInterval(timer);
    }

    if (gameState.timeRemaining === 0) {
      // When the timer runs out, end the game
      setGameState((prevState) => ({
        ...prevState,
        gameOver: true,
      }));
      // Store the total happiness score as the player's score
      savePlayerScore(totalHappiness);
    }
  }, [gameState.gameStarted, gameState.timeRemaining]);

  const savePlayerScore = (score) => {
    // Call API to save the score to the backend or save it to the local storage for leaderboard usage
    console.log("Player score saved:", score);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    try {
      const response = await axios.post(
        "http://localhost:3000/review",
        {
          user_id: userId,
          rating: newReview.rating,
          comment: newReview.comment,
        }
      );
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="game-page">
      <h1>Game Page</h1>

      <div className="total-happiness">
        <h3>Total Happiness: {totalHappiness}</h3>
      </div>

      {!gameState.gameStarted && !gameState.gameOver && (
        <button onClick={startGame}>Start Game</button>
      )}

      {gameState.gameStarted && gameState.timeRemaining > 0 && (
        <div className="timer">
          <p>Time Remaining: {gameState.timeRemaining}s</p>
        </div>
      )}

      {gameState.gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your total happiness score is {totalHappiness}</p>
        </div>
      )}

      <div className="game-circles">
        <h3>Select a Circle and Action</h3>
        {circles.map((circle, index) => (
          <div key={index} className="circle">
            <h4>{`Circle ${index + 1}`}</h4>
            <ul>
              {circle.map((character, idx) => (
                <li key={idx}>
                  <strong>{character.name}</strong>
                  <p>Likes: {character.likes.join(", ")}</p>
                  <p>Dislikes: {character.dislikes.join(", ")}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleActionSelection(index, "compliment")}
              disabled={!gameState.gameStarted || gameState.gameOver}
            >
              Compliment
            </button>
            <button
              onClick={() => handleActionSelection(index, "offer help")}
              disabled={!gameState.gameStarted || gameState.gameOver}
            >
              Offer Help
            </button>
            <button
              onClick={() => handleActionSelection(index, "invite to event")}
              disabled={!gameState.gameStarted || gameState.gameOver}
            >
              Invite to Event
            </button>
            <p>Happiness Score: {gameState.happinessScores[index]}</p>
          </div>
        ))}
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <strong>Rating:</strong> {review.rating} <br />
                <strong>Comment:</strong> {review.comment} <br />
                <strong>Time:</strong> {review.timestamp}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}

        <h3>Write a Review</h3>
        <form onSubmit={handleReviewSubmit}>
          <label>
            Rating (0-5):
            <input
              type="number"
              name="rating"
              value={newReview.rating}
              onChange={handleReviewChange}
              min="0"
              max="5"
            />
          </label>
          <label>
            Comment:
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleReviewChange}
            />
          </label>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default GamePage;
