import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { userId } = useParams(); // Get user ID from URL if viewing another profile
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect if user is not logged in
      return;
    }

    const fetchUser = async () => {
      try {
        const endpoint = userId ? `/user/${userId}` : "/profile/me";
        const response = await axios.get(`http://localhost:3000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile">
      <h1>{user.username}'s Profile</h1>
      <p>Email: {user.email}</p>

      {/* Navigation Links */}
      <nav>
        <Link to="/leaderboard">View Leaderboard</Link> |{" "}
        <Link to="/profile/me">My Profile</Link> |{" "}
        <Link to="/">Home</Link>
      </nav>

      <h3>Game History</h3>
      <ul>
        {user.gameHistory && user.gameHistory.length > 0 ? (
          user.gameHistory.map((game, index) => (
            <li key={index}>
              Game {game.id}: {game.score} points {" "}
              <Link to={`/game/${game.id}`}>View Game</Link>
            </li>
          ))
        ) : (
          <p>No past games found.</p>
        )}
      </ul>
    </div>
  );
};

export default Profile;
