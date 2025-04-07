import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GamePage.css"; 

const GamePage = () => {
  const [gameState, setGameState] = useState({
    selectedCircle: null,
    selectedAction: null,
    happinessScores: [0, 0, 0],
    gameStarted: false,
    timeRemaining: 10, // 60 seconds countdown
    currentRound: 1,
    gameOver: false, // Track game over state
  });

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  const [totalHappiness, setTotalHappiness] = useState(0); // Track total happiness


  const [characters, setCharacters] = useState([]);
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/characters")
      .then((response) => {
        console.log("Fetched characters:", response.data);
        const formattedCharacters = response.data.map(char => ({
          ...char,
          likes:
            typeof char.likes === "string"
              ? char.likes.split(",").map(item => item.trim())
              : char.likes,
          dislikes:
            typeof char.dislikes === "string"
              ? char.dislikes.split(",").map(item => item.trim())
              : char.dislikes,
        }));
        setCharacters(formattedCharacters);
        if (formattedCharacters.length > 0) {
          const shuffled = [...formattedCharacters].sort(() => Math.random() - 0.5);
          const groupSize = 3;
          const newCircles = [];
          for (let i = 0; i < shuffled.length; i += groupSize) {
            newCircles.push(shuffled.slice(i, i + groupSize));
          }
          console.log("Grouped circles:", newCircles);
          setCircles(newCircles);
        }
      })
      .catch((error) => {
        console.error("Error fetching characters:", error);
      });
  }, []);

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
    setGameState((prevState) => ({ ...prevState, currentRound: prevState.currentRound + 1 }));
    if (characters.length > 0) {
      const shuffled = [...characters].sort(() => Math.random() - 0.5);
      const groupSize = 3;
      const newCircles = [];
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newCircles.push(shuffled.slice(i, i + groupSize));
      }
      setCircles(newCircles);
    }
  };

    //
    
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:3000/reviews");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);
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

    if (gameState.timeRemaining === 0 && !gameState.gameOver) {
      setGameState((prevState) => ({
        ...prevState,
        gameOver: true,
      }));
      savePlayerScore(totalHappiness); // Ensure score is saved only once
    }
  }, [gameState.gameStarted, gameState.timeRemaining]);

  const savePlayerScore = async (score) => {
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) return;

      const userId = JSON.parse(atob(token.split('.')[1])).id;
      if (!userId) {
        alert("You must be logged in to submit a review.");
        return;
      }
      await axios.post(
        "http://localhost:3000/save-score",
        {
          user_id: userId,
          round_number: gameState.currentRound,
          action: gameState.selectedAction || 'none',
          circle_selected: gameState.selectedCircle + 1,
          happiness_score: score,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving player score:", error);
    }
  };
  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    if (!userId) {
      alert("You must be logged in to submit a review.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/review",
        {
          user_id: userId,
          rating: newReview.rating,
          comment: newReview.comment,
          timestamp: new Date().toISOString(), // Add timestamp
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setReviews((prevReviews) => [...prevReviews, response.data]);
      setNewReview({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting review:",  error.response || error);
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

      {/* Review Section */}
      <section className="reviews-section">
        <h3>Reviews</h3>
        <ul>
        {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <p><strong>{review.username}</strong></p> {/* Display the username */}
                <p>Rating: {review.rating}</p>
                <p>{review.comment}</p>
                <p><em>{new Date(review.timestamp).toLocaleString()}</em></p> {/* Display timestamp */}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}       
        </ul>

        <form onSubmit={handleReviewSubmit}>
          <input
            type="number"
            name="rating"
            value={newReview.rating}
            onChange={handleReviewChange}
            placeholder="Rating (1-5)"
            min="0"
            max="5"
          />
          <textarea
            name="comment"
            value={newReview.comment}
            onChange={handleReviewChange}
            placeholder="Your Comment"
          ></textarea>
          <button type="submit">Submit Review</button>
        </form>
      </section>
    </div>
  );
};

export default GamePage;