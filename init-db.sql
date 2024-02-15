DROP EXTENSION IF EXISTS "uuid-ossp";
CREATE EXTENSION "uuid-ossp";

-- DROP TABLE IF EXISTS tweets;
-- DROP TABLE IF EXISTS users;

-- DROP TABLE IF EXISTS likes;
-- DROP TABLE IF EXISTS followers;

--Create Tables

CREATE TABLE users(
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(200) NOT NULL UNIQUE,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phonenumber CHAR(8) UNIQUE,
    isSignedup BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);


CREATE TABLE tweets (
	tweet_id UUID DEFAULT uuid_generate_v4(),
	user_id UUID DEFAULT uuid_generate_v4(),
	tweet_text VARCHAR(200),
	num_likes INTEGER DEFAULT 0,
	num_retweets INTEGER DEFAULT 0,
	num_comments INTEGER DEFAULT 0,
	image VARCHAR(50),
	video VARCHAR(50),
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	PRIMARY KEY (tweet_id) 
);


CREATE TABLE likes (
    user_id UUID NOT NULL,
    tweet_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);

CREATE TABLE bookmarks (
    user_id UUID NOT NULL,
    tweet_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY, 
    user_id UUID NOT NULL,
    tweet_id UUID NOT NULL,
    comment VARCHAR(100) NOT NULL, 
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (user_id, tweet_id, comment_id), 
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
);

CREATE TABLE followers(
	follower_id UUID DEFAULT uuid_generate_v4(),
	following_id UUID DEFAULT uuid_generate_v4(),
	FOREIGN KEY(follower_id) REFERENCES users(user_id),
	FOREIGN KEY(following_id) REFERENCES users(user_id),
	PRIMARY KEY (follower_id, following_id)
);
ALTER TABLE followers
ADD CONSTRAINT check_follower_id
CHECK (follower_id <> following_id);

CREATE TABLE notifications (
    noti_id SERIAL PRIMARY KEY,
    receiver UUID REFERENCES users(user_id),
    type VARCHAR(20),
    tweet_id UUID REFERENCES tweets(tweet_id),
    is_read BOOLEAN DEFAULT FALSE
);

--Create Functions

CREATE OR REPLACE FUNCTION increment_tweet_likes() RETURNS TRIGGER AS $$
BEGIN
    UPDATE tweets SET num_likes = num_likes +  1 WHERE tweet_id = NEW.tweet_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tweet_likes
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION increment_tweet_likes();



CREATE OR REPLACE FUNCTION increment_tweet_bookmarks() RETURNS TRIGGER AS $$
BEGIN
    UPDATE tweets SET num_retweets = num_retweets +  1 WHERE tweet_id = NEW.tweet_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tweet_bookmarks
AFTER INSERT ON bookmarks
FOR EACH ROW
EXECUTE FUNCTION increment_tweet_bookmarks();


CREATE OR REPLACE FUNCTION increment_tweet_comments() RETURNS TRIGGER AS $$
BEGIN
    UPDATE tweets SET num_comments =  num_comments +  1 WHERE tweet_id = NEW.tweet_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tweet_comments
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION increment_tweet_comments();



INSERT INTO users (user_handle , email_address , first_name,last_name , phonenumber) 
VALUES
('manuxdev', 'manuxdev1010@gmail.com', 'Manuel', 'Pantoja','54559131'),
('ramiro', 'ramiro1234@gmail.com', 'Ramiro', 'Ramirez','53559112'),
('jesus', 'jesussuto@gmail.com', 'Jesus', 'Ramos','53559132'),
('flores', 'flores@gmail.com', 'Flores', 'Perez','53559122'),
('julito', 'manuelpo@gmail.com', 'Julito', 'Perez','53529122');


INSERT INTO users (user_handle , email_address , first_name,last_name , phonenumber) 
VALUES
('manuxdev', 'manuxdev1010@gmail.com', 'Manuel', 'Pantoja','54559131'),
('ramiro', 'ramiro1234@gmail.com', 'Ramiro', 'Ramirez','53559112'),
('jesus', 'jesussuto@gmail.com', 'Jesus', 'Ramos','53559132'),
('flores', 'flores@gmail.com', 'Flores', 'Perez','53559122'),
('julito', 'manuelpo@gmail.com', 'Julito', 'Perez','53529122');


INSERT INTO followers (follower_id , following_id)
VALUES
('dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5','37e16e4c-36c7-4ecd-9c66-06f724930c62'),
('dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5','37e16e4c-36c7-4ecd-9c66-06f724930c62'),
('37e16e4c-36c7-4ecd-9c66-06f724930c62','dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5');

INSERT INTO tweets (user_id, tweet_text)
VALUES

('dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5', 'Tweet1✋'),
('dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5', 'Tweet2✋'),
('dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5', 'Tweet3✋');

INSERT INTO likes (user_id , tweet_id)
VALUES

('f34ab9e7-51e7-432f-80fc-de526bb300db','1c9bc65c-51b6-4c0f-a653-4e21e60b8d62');


INSERT INTO comments (user_id, tweet_id, comment)
VALUES 
('dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5', 'da731190-9d8f-4cd4-bb7b-47d3ab2d3eaa','Comentario en tweet 3 de manuxdev');


INSERT INTO bookmarks (user_id , tweet_id)
VALUES
('dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5','1c9bc65c-51b6-4c0f-a653-4e21e60b8d62');


INSERT INTO notifications (receiver, type, tweetid )
VALUES
('dc4a86d6-31a2-47aa-82d8-b3b5d9aa72d5', 'follow', '697c9876-adc3-4296-9ca5-ddec2d81748c');