DROP EXTENSION IF EXISTS "uuid-ossp";
CREATE EXTENSION "uuid-ossp";

DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS followers;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS tweets;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tweet_media;



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
    avatar VARCHAR(200),
    portada VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    description VARCHAR(200)
);


CREATE TABLE tweets (
	tweet_id UUID DEFAULT uuid_generate_v4(),
	user_id UUID DEFAULT uuid_generate_v4(),
	tweet_text VARCHAR(200),
	num_likes INTEGER DEFAULT 0,
	num_retweets INTEGER DEFAULT 0,
	num_comments INTEGER DEFAULT 0,
    reply_cnt INTEGER DEFAULT 0,
	isreply BOOLEAN DEFAULT FALSE,
	replyingto TEXT[],
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	PRIMARY KEY (tweet_id) 
);
ALTER TABLE tweets
ADD COLUMN retweet_id UUID,
ADD FOREIGN KEY (retweet_id) REFERENCES tweets(tweet_id);


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


CREATE TABLE tags (
    id SERIAL PRIMARY KEY, 
    hashtag VARCHAR(20) NOT NULL UNIQUE, 
    tweet_cnt INTEGER DEFAULT 1
);

CREATE TABLE tweet_media (
    media_id UUID DEFAULT uuid_generate_v4(),
    tweet_id UUID,
    image_path VARCHAR(255),
    video_path VARCHAR(255),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id),
    PRIMARY KEY (media_id)
);

CREATE TYPE notification_type AS ENUM ('mention', 'like', 'follow');

CREATE TABLE notifications (
    noti_id BIGSERIAL PRIMARY KEY,
    receiver UUID NOT NULL,
    type notification_type NOT NULL,
    tweetId UUID NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (receiver) REFERENCES users(user_id),
    FOREIGN KEY (tweetId) REFERENCES tweets(tweet_id)
);

--Create Functions

--Funcion Incrementa los likes del tweet automaticamente
CREATE OR REPLACE FUNCTION increment_tweet_likes() RETURNS TRIGGER AS $$
BEGIN
    UPDATE tweets SET num_likes = num_likes +  1 WHERE tweet_id = NEW.tweet_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--Trigger Incrementa los likes del tweet automaticamente
CREATE TRIGGER update_tweet_likes
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION increment_tweet_likes();

--Funcion Decrementa los likes del tweet automaticamente
CREATE OR REPLACE FUNCTION decrement_tweet_likes() RETURNS TRIGGER AS $$
BEGIN
    UPDATE tweets SET num_likes = num_likes -  1 WHERE tweet_id = NEW.tweet_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


--Funcion Incrementa los bookmarks del tweet automaticamente
CREATE OR REPLACE FUNCTION increment_tweet_bookmarks() RETURNS TRIGGER AS $$
BEGIN
    UPDATE tweets SET num_retweets = num_retweets +  1 WHERE tweet_id = NEW.tweet_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--Trigger Incrementa los bookmarks del tweet automaticamente
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


DROP TRIGGER IF EXISTS increment_tag_tweet_cnt_trigger ON tags;
DROP FUNCTION IF EXISTS increment_tag_tweet_cnt();

CREATE OR REPLACE FUNCTION increment_tag_tweet_cnt()
RETURNS TRIGGER AS $$
BEGIN
    -- Intenta encontrar el hashtag en la tabla tags
    UPDATE tags
    SET tweet_cnt = tweet_cnt +  1
    WHERE hashtag = NEW.hashtag;

    -- Si no se encontró el hashtag, inserta uno nuevo con tweet_cnt =  1
    IF NOT FOUND THEN
        INSERT INTO tags (hashtag, tweet_cnt)
        VALUES (NEW.hashtag,  1);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_tag_tweet_cnt_trigger
AFTER INSERT ON tags
FOR EACH ROW
EXECUTE FUNCTION increment_tag_tweet_cnt();