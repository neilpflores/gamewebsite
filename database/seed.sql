USE gamedb;
-- First, insert users
INSERT INTO `user` (username, email, password, first_name, last_name, user_role) VALUES
('neil', 'neil@example.com', 'hashedpassword123', 'Neil', 'Flores', 'player'),
('john_doe', 'john.doe@example.com', 'hashedpassword', 'John', 'Doe', 'player'),
('jane_smith', 'jane.smith@example.com', 'hashedpassword', 'Jane', 'Smith', 'player');


-- Now insert characters
INSERT INTO `characters` (name, likes, dislikes) VALUES
('Sam','compliment','offer help'),
('Alex','offer help','compliment'),
('Jake','invite to event',''),
('Jamie','compliment','invite to event'),
('Taylor','offer help','compliment'),
('Morgan','invite to event','offer help'),
('Pat','compliment','offer help'),
('Chris','offer help','compliment'),
('Jordan','invite to event','compliment');


-- Insert action_effects
INSERT INTO `action_effect` (character_id, action, happiness_change) VALUES
(1, 'compliment', 2),
(1, 'offer help', -1),
(2, 'invite to event', 3),
(2, 'compliment', -2);
-- leaderboard addins
INSERT INTO game_round (user_id, round_number, action, circle_selected, happiness_score)
VALUES
  ((SELECT id FROM user WHERE username = 'neil'), 1, 'compliment', 1, 200);
-- Insert game rounds (ensure user_id exists first)
INSERT INTO game_round (user_id, round_number, action, circle_selected, happiness_score)
VALUES
  ((SELECT id FROM user WHERE username = 'john_doe'), 1, 'offer help', 2, 5),
  ((SELECT id FROM user WHERE username = 'jane_smith'), 1, 'invite to event', 3, 10);

-- Insert reviews (ensure user_id exists first)
INSERT INTO `review` (user_id, rating, comment) VALUES
(1, 4.5, 'Great game, but needs more variety!'),
(2, 4.0, 'Loved the game, but could use more challenges.');



