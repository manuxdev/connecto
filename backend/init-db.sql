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




--Insertar usuarios--

INSERT INTO "public"."users" ("user_id", "username", "email", "password", "first_name", "last_name", "phonenumber", "issignedup", "avatar", "portada", "created_at", "description") VALUES
('c1f63cd1-ce4c-472b-ba6e-313541d1d362', 'ernewstico', 'manu2123@gmail.com', '$2b$12$aa4TzFaXRohHUYBKyIH9eOGuEQnt/cxb9uv8omwuXy5BeomJ0jWb.', 'Ernesto', 'Sevilla', '54522147', 't', NULL, NULL, '2024-04-10 21:43:10.716785', NULL);
INSERT INTO "public"."users" ("user_id", "username", "email", "password", "first_name", "last_name", "phonenumber", "issignedup", "avatar", "portada", "created_at", "description") VALUES
('15e30ebb-f8c9-46e6-9e88-c6e98de30c07', 'fdgdfg21312345354', 'asa23234534534dasd@gmail.com', '$2b$12$CbOyp9djLp8II/FQjJNMEep41bjuskwmqdnaBMW61.EpWsUi1R89q', 'asdas', 'asdas', '52415474', 't', NULL, NULL, '2024-04-11 04:07:49.922894', NULL);
INSERT INTO "public"."users" ("user_id", "username", "email", "password", "first_name", "last_name", "phonenumber", "issignedup", "avatar", "portada", "created_at", "description") VALUES
('af8ac4f5-85e4-4925-aba4-e36207bca380', '122312sdsasdas', 'asa23234213125345sd34dasd@gmail.com', '$2b$12$.PW6PFPuhX3clgqMT2OV3eBBjyzDZ5loMX0uesuXqLLmcBCMoR6a6', 'asdasas', 'asdas', '52215274', 't', NULL, NULL, '2024-04-11 04:12:42.539828', NULL);
INSERT INTO "public"."users" ("user_id", "username", "email", "password", "first_name", "last_name", "phonenumber", "issignedup", "avatar", "portada", "created_at", "description") VALUES
('fbb26034-05b6-4db5-a4d6-d3c01ba722cc', '12345678fvvb', 'manuel12312312@gmail.com', '$2b$12$V/EHOvqUpDmY2BMjUToxsedQ37BKeKoxw7GkEV5voTZQZLG7F.uoa', 'xczxzxz', 'xzzxzxc', '52414547', 't', NULL, NULL, '2024-04-11 04:31:19.973242', NULL),
('a1f9cd92-f77e-47de-b5db-a1f99d879a3e', 'benitoa2ntonio', 'roberto1223@gmail.com', '$2b$12$TRmGc/rfN3Vp860Cu5ly5ejNUAgskRN9d0vy53YuBLAb7n7CAB9Ne', 'Roberto', 'Perez', '52414782', 't', NULL, NULL, '2024-04-12 00:55:20.988146', NULL),
('1380d73b-13f9-4c51-83d1-e45d553827e2', 'orlandito', 'orlando@gmail.com', '$2b$12$jnPmgy5jcw1wf6MHjmjI7OfTyZnKeXnFoRx/.d2k.AMb4q3ByWCiO', 'Orlando', 'Ernesto', '54515265', 't', NULL, NULL, '2024-04-12 03:56:04.910093', NULL),
('9df40028-595b-42c7-bb59-4a392ea12999', 'manuelito', 'manuel@gmail.com', '$2b$12$snt8BhsnN5ymP.SiNYLYN.NnL6JNBDyBFu9vVMZdTT3.39n0GgjSy', 'Manuel', 'Pantoja', '54559131', 't', '/avatar/dd45bae9-d2e8-4cd5-8fc9-aad41e7d9ad0.png', '/portada/3caf6f46-fd3a-4fc4-86b4-e6a3e6caaa28.jpeg', '2024-04-19 19:37:43.906227', 'Hola esto es una 
Biografia biografica'),
('1a6f55a5-873f-47c6-b2cc-2d573de43573', 'federico', 'fede@gmail.com', '$2b$12$xHLIdB89LMYmevRxQhMnNOzZ7mLEZ2Im8ZTFMGgiPUNRsh1tJsM0y', 'Federico', 'Gonzalez', '53559131', 't', NULL, NULL, '2024-04-06 22:24:39.141323', NULL),
('a1f2f5d9-1a45-4a04-b06e-24d582fb0321', '879as22da', 'm1angu3el@gmail.com', '$2b$12$LPojoLs6.VrCk7aHWAMR.OL/iSNCjqaR8kZgCT.WYcV1XmtFvUdUK', 'asdasd', 'asdas', '54748485', 't', '/avatar/390232f3-f17a-4713-b03d-3341db9ec6ca.jpg', '/portada/8cc89888-f98d-48ff-856b-3f61fb4230e3.jpg', '2024-04-13 18:22:33.592388', NULL),
('c89cda14-a8c4-40b4-bd74-b56b98c89ec4', 'manux', 'Manuel@gmail.com', '$2b$12$oY45OaD.RrwiqRZiUZ/Lke1OfKjiyA9pC5KVlVwiB8rzKSePwS/Fm', 'Manuel', 'Pantoja', '53559130', 't', NULL, NULL, '2024-04-07 01:15:41.068342', NULL),
('91ab7292-3c1f-4458-a196-a798c30186bc', 'manux3213', 'ramongarcia@gmail.com', '$2b$12$xOe/gx5MCglEkvhxxqOYvukRFDJm/SqYtU/cq44fiuFPJkTqu7lTC', 'Manuel', 'Pantoja', '54784154', 't', NULL, NULL, '2024-04-09 09:16:33.600798', NULL),
('f3188ea3-f78c-4a17-ad27-fd38fb9f11a6', '12312asdas', 'ra21mongarcia@gmail.com', '$2b$12$XRs4ijl9mFtaugpfZsX2EeJVsiookLIdgOKUA/VXMb7A/4FEpCLIi', 'Manuelas', 'Pantojac', '58457414', 't', NULL, NULL, '2024-04-09 09:27:06.570265', NULL),
('8bb30ef8-3686-4a37-b201-980a49382e0d', 'manux1244', 'ra221mongarcia@gmail.com', '$2b$12$50ujk7RWNUpppeWS6wQNTuD7uY/dQXkwLrGOtcAGUk6nkzqf6oeoe', 'Manuel', 'Pantoja', '52147414', 't', NULL, NULL, '2024-04-09 09:31:32.761721', NULL),
('24ac9a67-f7c2-462a-95c2-79250b18be34', 'manux12244', 'ra2221mongarcia@gmail.com', '$2b$12$fZKNTEy4QwOYzLPot2YELukCFl1wgzxQvxZeeM0T1yZuG25gN5H9m', 'Manuel', 'Pantoja', '52447414', 't', NULL, NULL, '2024-04-09 09:33:56.33144', NULL),
('4e07a637-d515-4592-95ad-74019d893b44', 'manux122424', 'ra22221mongarcia@gmail.com', '$2b$12$0pTcu2.cUxtAyY/swDnpSOJPk9PgvZ5Ko/UB1MZzZ6pc1J6.9CBcK', 'Manuel', 'Pantoja', '52467414', 't', NULL, NULL, '2024-04-09 09:34:15.995632', NULL),
('97b96fcf-8f14-402d-aeac-28f74941dbad', 'manux1224242', 'ra222221mongarcia@gmail.com', '$2b$12$y014vqqU9Sa7LfcWgL2M4OH9s/T18GQrhKiXFzI4ocLowW1us1RmG', 'Manuel', 'Pantoja', '52467411', 't', NULL, NULL, '2024-04-09 09:34:33.348872', NULL),
('eb81e0d1-f3c1-4cf6-a49c-f19754b1922a', 'manux1224142', 'ra222231mongarcia@gmail.com', '$2b$12$jw377V5N8yieLrDUJpTG5uKi5TdvrX4bGjzjCi1Pk3FkABWahIePG', 'Manuel', 'Pantoja', '52467511', 't', NULL, NULL, '2024-04-09 09:35:08.835298', NULL),
('13def191-fdda-420e-b805-d32309d395e5', 'manuxdev12456', 'ra111221mongarcia@gmail.com', '$2b$12$bNshJSVwiZBY6025SDhNU.X5K.PLUfuSrHgVwA19D/qnslQxZHiDa', 'Manuel', 'Pantoja', '58457487', 't', NULL, NULL, '2024-04-09 09:53:26.797652', NULL),
('34516b19-406c-4644-a287-c0ffced59183', 'manuxdev1e2456', 'ra1112e21mongarcia@gmail.com', '$2b$12$yS3K/Uxmq2lq/x2Ut2zA5.u5T8i3nuZ/SxdiU6fYxPwdH9OjNzS5S', 'Manuel', 'Pantoja', '52415498', 't', NULL, NULL, '2024-04-09 09:54:01.153374', NULL),
('2682bcaa-6868-49bb-929a-9cf4e9a14688', '12345678manrt', 'ra11122221mongarcia@gmail.com', '$2b$12$gEYyiGvVh7mDAu401bdJN.rNMZk/waC7sW/K4FbZoo5AWCEGNUSr6', 'Manuel', 'Pantoja', '52446296', 't', NULL, NULL, '2024-04-09 09:59:48.170345', NULL),
('fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'newuser2', 'user22@gmail.com', '$2b$12$0HWVTai3QIHFnAhHjMp/.OdbLulxWPk8TnioWdcWVe3lw21S2krgK', 'New2', 'User2', '53559115', 't', '/avatar/3acd3349-a653-4ec4-be7f-8c576a36d207.png', '/portada/80fd396c-3db3-47d0-8ed8-8b5d05fc6153.jpg', '2024-04-08 02:51:19.042824', 'La biografia mia
si'),
('995a3f76-c7de-405a-bb13-80bdca0fc853', 'ordulito', 'ordulio@gmail.com', '$2b$12$LumbceHX2ZIWzwZZ5T3vQehpxyKnVLfYESJD7q/KDr6m5oPwLXpRm', 'Ordu', 'Lio', '54788485', 't', NULL, NULL, '2024-04-14 17:28:38.839071', NULL),
('c4cefce7-daad-4eb0-968f-b85a030eb0e1', 'fdgdfg345354', 'asadasd@gmail.com', '$2b$12$5nOPDamKJ7KFrKSzOAizjeKsSM6tf8/YW98a1DZND5MPEt0f5s1cG', 'asdas', 'asdas', '54578485', 't', NULL, NULL, '2024-04-11 04:05:40.414591', NULL),
('5e647abf-975e-4971-abe3-3694880ff59e', '12312sdsasdas', 'asa232345345sd34dasd@gmail.com', '$2b$12$1sGCBhRUOifdzDs7VTMjquhIJspD1dursZRSYE6zxzJZz.Cin835y', 'asdasas', 'asdas', '52415274', 't', NULL, NULL, '2024-04-11 04:11:32.616608', NULL),
('f062c692-1728-4429-9bbc-1e605d92e560', '122312sdssdasdas', 'asa232342131sadas25345sd34dasd@gmail.com', '$2b$12$q4Bi.iTchk7KTybjkfzY7u83gWineGNor6HH9JN18rYKinqlNrs4S', 'asdasas', 'asdas', '52215224', 't', NULL, NULL, '2024-04-11 04:14:30.630213', NULL),
('011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'olito', 'olito@gmail.com', '$2b$12$XlMrXLszz74RPTLkpNheWOJxFs7/alKvB0BEKzkG75jtdY2Rv8PyK', 'Ramon', 'Pantojas', '53559136', 't', '/avatar/c0934db7-5d7d-474e-9d86-602fe37e27ad.jpg', '/portada/1c0027d7-ec48-48d7-b5d1-93f8019ab20c.jpg', '2024-04-06 17:35:15.989468', 'Hola 123
Esto es un mensaje 
que tal 
-💢'),
('11ea63c0-adc1-401a-a72a-b1edde38cbe6', 'nuevouser2', 'hnuevousuario@gmail.com', '$2b$12$eyJBvjjlysbYaX5dwQYqW.EBsSu/ugKkMHHXinEwZjKRUxhYWpZ.y', 'Usuaru', 'SAbaka', '52848589', 't', '/avatar/c6deb20f-1052-4667-8361-b55810dc2be0.jpg', '/portada/ef729a7c-2188-4e1d-9b89-252c1c3e54fa.png', '2024-04-13 18:29:57.094313', 'Biografia de un se;or'),
('6a958163-0512-4241-8dd8-424dbcb6bac0', 'benitoantonio', 'usuarionuevao@gmail.com', '$2b$12$r1kue5ujm.b6NRQIuEafgeohUnUZaI.9QaqZYjs1ViOe7vyUQCSGC', 'Usuario', 'Nuevo Usuario', '54556235', 't', NULL, NULL, '2024-04-10 06:35:42.159847', NULL),
('a73d8597-a6d1-4233-a0f3-62b78fb14cb6', 'benitoantonioa', 'correousuario@gmail.com', '$2b$12$Tq87B2T2Kv7FMgHgasrLbuEWuhgGe79JxUi5hjj3RwsrDul1vUMsy', 'Manuel', 'Pantoja', '54552174', 't', NULL, NULL, '2024-04-10 06:37:31.701482', NULL),
('b8b1f764-3e50-4feb-a2d0-f04bcd855966', 'benitoantonioas', 'correo2usuario@gmail.com', '$2b$12$r5gC86LcY70Tx./SWNv7..ltfCB2d7dRxERGz.uYxE7rpeA1JeViu', 'Manuel2', 'Pantoja2', '54552176', 't', NULL, NULL, '2024-04-10 06:47:23.831598', NULL),
('56c52325-4421-419b-b7ab-d10ede1909b4', 'userimage', 'user@gmail.com', '$2b$12$cDbrzMAgJr53A/J.BnDUYOpbLz9oSkBGQ4ozbc6ttgq9yC9tJB1Du', 'Imagenes', 'Pedro', '52417423', 't', '2c69cc76-02df-4936-87ce-68712bb6eb24.jpg', 'e87f4ddb-35bf-4b1c-9647-a43076a341e3.webp', '2024-04-07 19:39:24.324', NULL),
('0d30bd1e-f404-440c-8ac4-08e657fb8053', 'beni2toantonioas', 'correo2u2suario@gmail.com', '$2b$12$HLF1YFLh0eomPfAO1Q7sLeqnDo4DTOYJN0N6JJlx1wuOT.3j3A/by', 'Manuel2', 'Pantoja2', '54552171', 't', NULL, NULL, '2024-04-10 06:48:45.022827', NULL),
('8dcae5bc-a06b-4e92-acec-79bfe068866e', 'newuser', 'user2@gmail.com', '$2b$12$e0pqm9C96tWTwgJgXJOW1e5fLcEnNolnIuPSQzxq06zvH8lfstskq', 'New', 'User', '53559135', 't', '4c868b6b-9026-429f-a925-70455e0fb2b9.png', NULL, '2024-04-08 02:34:59.820053', NULL),
('3dd1ced5-d299-416b-aa24-dd4cdebb9a9b', 'beni2t2oantonioas', 'corre2o2u2suario@gmail.com', '$2b$12$ZcDfzNeFvLmXQVO1a0XIbePpLaoF3/c8Bcv46KVTYKlSX.BoWOaQK', 'Manuel22', 'Pantoja22', '54552175', 't', NULL, NULL, '2024-04-10 06:54:50.898314', NULL);



--Insertar tweets--
INSERT INTO "public"."tweets" ("tweet_id", "user_id", "tweet_text", "num_likes", "num_retweets", "num_comments", "image", "video", "isreply", "replyingto", "created_at", "retweet_id", "reply_cnt") VALUES
('a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Hola esto es un tweet donde voy a etiquetar a @jamaiquito @manuxdev1 y tambien a @manuxdev o tambien @si. #elmejortweet ', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 21:11:53.159511', NULL, 0);
INSERT INTO "public"."tweets" ("tweet_id", "user_id", "tweet_text", "num_likes", "num_retweets", "num_comments", "image", "video", "isreply", "replyingto", "created_at", "retweet_id", "reply_cnt") VALUES
('11b01f0f-66ff-475c-9be8-5204c2335cfc', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Hola esto es un tweet donde voy a etiquetar a @jamaiquito @manuxdev1 y tambien a @manuxdev o tambien @si. #elmejortweet ', 5, 4, 0, NULL, NULL, 'f', NULL, '2024-04-06 17:36:15.672806', NULL, 0);
INSERT INTO "public"."tweets" ("tweet_id", "user_id", "tweet_text", "num_likes", "num_retweets", "num_comments", "image", "video", "isreply", "replyingto", "created_at", "retweet_id", "reply_cnt") VALUES
('ef6b9f0b-cbed-440d-8543-8fa7bdaee325', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un reply @federico #tweeteliminar', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-07 03:52:11.82372', NULL, 0);
INSERT INTO "public"."tweets" ("tweet_id", "user_id", "tweet_text", "num_likes", "num_retweets", "num_comments", "image", "video", "isreply", "replyingto", "created_at", "retweet_id", "reply_cnt") VALUES
('9e9468b6-fb69-4d38-b4e6-63426992cc08', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:36:04.868509', NULL, 0),
('402e8fa3-eae2-44bd-b559-1aa4590ce252', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un reply @federico #replytag', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-07 03:54:29.681748', NULL, 0),
('59d808b5-3707-4691-9d12-673fc3b496c8', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:36:58.595036', NULL, 0),
('eed15155-2612-4f8b-bd88-7c578d7359b6', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un reply @federico #replytag', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-07 03:54:39.930405', NULL, 0),
('a8e30403-575c-4f3a-b1e0-a40c40769c08', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:37:49.061752', NULL, 0),
('e5c0070f-080e-4411-8fe3-5a8774391e82', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un reply @federico #replytag', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-07 03:54:58.071504', NULL, 0),
('2c33b1fe-ea1c-4745-8a72-03aadc81c823', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:38:42.349766', NULL, 0),
('d1272dcd-0487-4a6b-aaeb-4174a750d75e', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un reply @federico #replytag', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-07 03:57:27.370066', NULL, 0),
('0969fef6-78ba-41bb-976f-f70ea22715e8', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un retweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:20:32.500471', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('5d7260cb-7965-4bba-b947-a2ecd9ce8a1a', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es otro retweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:22:33.259481', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('7c9eb5e7-840f-4948-a632-fa8cc28c8bf2', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es otro retweet #rewteeteaconmigo @federico', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:25:00.448088', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('f96944b8-d1ac-462b-a4c3-1b0cf564d6e3', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Ahora esto es un tweet donde voy a etiquetar a @federico @olito y tambien a @manuxdev o tambien @si. #siestoesuntweet ', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:26:16.974623', NULL, 0),
('b95be212-89aa-4ec7-92df-d3718314604c', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es otro retweet #rewteeteaconmigo @federico', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:28:39.931791', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('b7575b3f-54de-4ec7-ba28-4f7a97e6ee11', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es otro retweet #rewteeteaconmigo @federico', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:31:56.23035', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('168bc6f2-1a5d-48a1-818c-cb3040a33f37', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es otro retweet #rewteeteaconmigo #rewteeteaconmigo @federico', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:33:23.217508', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('162cb8e7-c21a-4c42-85e0-00f4bb0046e7', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es otro retweet #rewteeteaconmigo @federico', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:33:42.126946', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('e86ac030-a995-4e07-99f0-7e4c46588863', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es otro retweet #rewteeteaconmigo @federico', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 22:34:18.988525', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('dfafc17b-e0b4-4d07-8f7a-fb11ce13e67a', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Este es el tweet a eliminar @federico #tweeteliminar', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-06 23:56:37.600223', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('a1aa837a-f6be-44fe-85e9-8c18c598a43d', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Este es el tweet a eliminar @federico #tweeteliminar', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-07 00:00:28.877795', 'a115f9c6-ba7c-48cb-8306-74eb54ea8dd0', 0),
('11bd9a43-d09e-4045-ae4a-03b88683b319', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:38:49.790076', NULL, 0),
('201ffb07-a110-47db-830c-2348aa5af352', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un reply @federico #replytag', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-07 03:58:44.774611', NULL, 0),
('16155f55-2e8b-4419-b78c-cd13fbaab671', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:39:14.640152', NULL, 0),
('e3e55b0d-c5dc-4664-a5e2-3acec9ae0f63', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un reply @federico #replytag', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-07 04:00:12.093918', NULL, 0),
('0b092fab-07f1-4c84-8121-9018a9d08b6a', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un reply @federico #replytag', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-07 04:00:54.88313', NULL, 0),
('941c43a8-a2c5-424d-971b-b5be7be4fb51', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Hola esto es un tweet donde voy a etiquetar a @jamaiquito @manuxdev1 y tambien a @manuxdev o tambien @si. #elmejortweet ', 0, 4, 0, NULL, NULL, 'f', NULL, '2024-04-06 17:35:40.884583', NULL, 3),
('b6aa35c1-f7df-4244-a43b-83b1d9640335', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb,011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:06:45.482701', NULL, 0),
('442dc2f0-cf92-4d9f-8235-3555ac5b79b2', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:13:10.371117', NULL, 0),
('c6195d3c-1c9a-43c4-8298-c98c192f025f', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:23:24.568829', NULL, 0),
('06a709f2-15a7-49a5-b22b-23e5679ff860', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:25:33.782076', NULL, 0),
('7707bed4-49de-4050-80de-f3b59d82255a', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:39:33.369767', NULL, 0),
('971156cb-2d8f-473d-8053-d20a21ab8d5f', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:26:39.407142', NULL, 0),
('c22432b9-f107-4090-8690-396230e4c2d5', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:29:56.27696', NULL, 0),
('e75949c3-6680-4ba6-a50e-8335273a6f5d', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:34:38.299796', NULL, 0),
('6b414e4f-c640-4cc5-a17a-56334e8f5c37', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:40:19.940164', NULL, 0),
('e0389d78-67cc-4e51-aed5-4d265264ae64', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:40:44.86186', NULL, 0),
('91fd2763-7f80-49e0-bd6f-6614f1064f65', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:41:18.101426', NULL, 0),
('560e7e45-fb12-4a8b-acc0-9c7c7d38ec16', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:42:50.354485', NULL, 0),
('7912301f-9553-4bf0-8a33-316c6bcb372a', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:47:02.119211', NULL, 0),
('52cd122a-5a75-444f-9806-c8ac5ee618ac', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:47:29.898218', NULL, 0),
('0c544f6a-2a23-4d1e-9183-1ac521fe8ea2', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 20:52:29.683802', NULL, 0),
('4634222d-82be-4b06-961e-5246ed770eb0', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:01:53.82224', NULL, 0),
('17cc1090-10ff-4fcd-9e66-44e616853bf4', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:02:10.391658', NULL, 0),
('5ff01ec9-a318-4097-9309-e59583203038', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:03:19.323316', NULL, 0),
('60ca1145-d789-4aa5-bb91-aeed6adbdc54', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:04:04.602712', NULL, 0),
('ccda351d-8cbe-4884-a8bc-12eaccd3fb57', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:05:02.801056', NULL, 0);
INSERT INTO "public"."tweets" ("tweet_id", "user_id", "tweet_text", "num_likes", "num_retweets", "num_comments", "image", "video", "isreply", "replyingto", "created_at", "retweet_id", "reply_cnt") VALUES
('09bb2c72-fbb9-42db-b5d6-e5fed43c4d72', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:06:01.002121', NULL, 0),
('a3ca81ea-89be-4bb5-9480-7aa5a5de914a', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:11:23.553683', NULL, 0),
('5d2954cb-4e1f-49cb-a4e0-5b61e6a01031', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:13:58.731557', NULL, 0),
('648816af-2580-4b45-b2a7-b001190c6f38', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:16:21.668632', NULL, 0),
('58d8b9e6-c4b6-4da4-87d7-6872c6d233f3', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:16:58.658304', NULL, 0),
('886c4101-6ca6-4a31-a9ca-4b9e57645631', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:17:48.177892', NULL, 0),
('52177ae6-4e04-449c-8ec4-093886b9e896', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:19:40.32078', NULL, 0),
('8fb73a01-00fb-4c36-b93a-2195d390be50', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:22:21.397795', NULL, 0),
('c305ba61-43c2-4fbe-9ae2-c588ebec7e8a', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:23:00.718574', NULL, 0),
('9bb090aa-c73d-4229-8701-288f71bdb27c', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:23:30.706521', NULL, 0),
('48dcf0a2-69df-41ee-92f9-d4f9c324fd69', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:23:39.61755', NULL, 0),
('7fbb5fa3-097f-4c2a-b11b-c89e2dea4b02', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 21:27:35.394568', NULL, 0),
('652065dd-95da-487f-8be8-676b8b7a6c59', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 22:19:04.664467', NULL, 0),
('e1d07860-48c2-4dda-a468-0efb9a9bc1bd', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 22:19:21.353914', NULL, 0),
('604c769b-2ddd-4131-bb8a-3b8d3a0512ca', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 22:19:30.485095', NULL, 0),
('d038a944-59a9-408a-bdf5-f916b0ef7a89', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 22:19:42.253885', NULL, 0),
('820b169e-5039-4d21-93ea-7e56fa48bb2b', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 22:20:20.163729', NULL, 0),
('36df2d6d-72eb-4c6f-8ac6-1c042efbba1c', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 22:22:01.524134', NULL, 0),
('59d5901b-a25d-4798-80b3-20e786f86873', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un tweet', 0, 0, 0, NULL, NULL, 't', '{011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb}', '2024-04-08 22:23:19.223976', NULL, 0),
('ad27a2d3-9c0c-46ed-823c-d5ed0a097a9f', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-08 22:25:39.769182', NULL, 0),
('45a36e1b-9696-4c64-b9ed-00eb4f533099', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-08 22:26:10.924786', NULL, 0),
('0165409b-ee72-41d2-93d1-daadfe676349', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un nuevo tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-08 22:27:23.307435', NULL, 0),
('b90d92ef-2f9e-4743-b4a8-66548dff0aa6', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un nuevo tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-08 22:27:52.811788', NULL, 0),
('97989520-5124-426d-b891-eaf7bd4bd1c8', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un nuevo tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-08 22:28:11.321371', NULL, 0),
('0938ea3d-e6f1-418e-9b57-a6217160034d', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un nuevo tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-08 22:28:12.586434', NULL, 0),
('f5674014-6c05-49f1-8ae9-eec4ed5d2a61', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Esto es un nuevo tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-08 22:28:49.928744', NULL, 0),
('e2bb04d6-f99f-449c-ba42-5dd2f0b95edb', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un nuevo tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-13 04:20:15.438559', NULL, 0),
('52fb3b45-242d-48de-8c6b-2a91ea01c332', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Esto es un nuevo tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-13 04:20:26.927966', NULL, 0),
('e8dc6fdb-2d72-4dbd-9eeb-00b606cc84f2', '11ea63c0-adc1-401a-a72a-b1edde38cbe6', 'Esto es un nuevo tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 00:56:31.593882', NULL, 0),
('53e997ff-e74c-49ae-9a67-8ce57371e732', '11ea63c0-adc1-401a-a72a-b1edde38cbe6', 'Esto es un tweet un poco largo pero necesario', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 01:01:25.885314', NULL, 0),
('4f7c7f67-1785-47e0-b382-c202cedea385', '11ea63c0-adc1-401a-a72a-b1edde38cbe6', 'a', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 01:01:55.953871', NULL, 0),
('c7cce2c9-0323-4914-b6a8-8107f7b5f095', '11ea63c0-adc1-401a-a72a-b1edde38cbe6', 'Este es el tweet para ver si todo funciona', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 01:02:42.65703', NULL, 0),
('80aebba9-3035-41a5-b1ac-ff39848659bd', '11ea63c0-adc1-401a-a72a-b1edde38cbe6', 'asdasd', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 01:08:49.55793', NULL, 0),
('11e00238-58c8-414c-bfd4-f7197e772812', '11ea63c0-adc1-401a-a72a-b1edde38cbe6', 'asd', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 01:08:58.058666', NULL, 0),
('660b3542-7cb1-43ca-b37f-baebf68e3791', '11ea63c0-adc1-401a-a72a-b1edde38cbe6', 'Voy a crear un Tweet todo poderoso
este tweet es para probar las habilidades sociales de las leyes de los ni;os.

❤❤❤❤ #corazonSalvaje', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 01:54:07.761274', NULL, 0),
('a7363fa6-3bb3-43de-8e00-62a10a6909ac', 'fa71285e-e6df-4287-bbb0-1ccfba14f7f7', 'Hola esto es un tweet 
para compartir mis experiencias personales en el castigo escolar
#claro que si #todosepuede', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 17:01:42.490262', NULL, 0),
('b1470830-77d5-4de5-a4a3-17855569ab5d', '995a3f76-c7de-405a-bb13-80bdca0fc853', 'Tweet Bonito', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 17:28:54.847463', NULL, 0),
('3d89f859-5302-42f0-bb89-d8bfa3ee8a3c', '995a3f76-c7de-405a-bb13-80bdca0fc853', 'esto es un tweet https://flowbite-react.com/docs/components/popover', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 17:38:46.762897', NULL, 0),
('1e07de01-2b1b-4605-baea-c8be90cd4133', '995a3f76-c7de-405a-bb13-80bdca0fc853', 'Creando nuevo tweet con la cosa esa que dijo ese man https://flowbite-react.com/docs/components/popover y sigo escubiendo,

porque puedo', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 17:43:01.373121', NULL, 0),
('6657e211-1f9d-47da-b7d1-3f885675fdd2', '995a3f76-c7de-405a-bb13-80bdca0fc853', 'Este es un tweet ppar probar el @periquito y el #menganito

y un poco de https://futbollibre.com

#yosoyfiel #tutambien', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-14 17:56:40.546831', NULL, 0),
('e10b9ec8-b6af-4741-b550-a26511c31771', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Este tweet es pa ver si todo funciona bien', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 17:02:17.551678', NULL, 0),
('3481f908-4705-4701-ab7c-17562043903f', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Este es el tweet supremo @esteban', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 17:04:01.282255', NULL, 0),
('38b03bb8-31d6-4bcf-9518-37435a59316c', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'crea el twwet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 17:50:50.680718', NULL, 0),
('1edc86e9-0026-46d5-a529-650718bd8a77', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'esto es el tweet #4', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 17:54:44.440092', NULL, 0),
('6298bc32-b50c-40f0-a6c1-634b89b88021', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'este es otro tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 17:55:40.675925', NULL, 0),
('4fba4aaf-cb08-4351-9f35-360981dbb32d', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'creando tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 17:59:36.348466', NULL, 0),
('75b0df38-aeb5-45b4-a52d-67d8c836bb7a', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'tweet revolucionario', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 18:07:39.626594', NULL, 0),
('b0fc0c72-d780-4350-bf64-f50a7ea1847d', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'nuevo tweet #revolucion @jesus', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 18:08:47.064552', NULL, 0),
('f1567917-1460-47cc-91ea-b09125de97fa', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'sad', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 18:09:30.302507', NULL, 0),
('c125d1ce-abe0-44d5-b551-fbdf68340f18', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', '45445', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-17 21:53:49.013703', NULL, 0),
('41b9f75a-22b0-4d85-a378-3f5c01fdbe7f', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'New Tweet', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-18 17:20:34.424397', NULL, 0),
('1932a2e2-fce7-400d-877d-8fea3f0556f3', '011a3fe7-c1ce-4aab-b8c0-3423a3b7bdeb', 'Hola', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-19 16:13:33.870846', NULL, 0),
('2017ca35-d50f-4506-85f5-8745f86cf24a', '9df40028-595b-42c7-bb59-4a392ea12999', 'Esta es mi primera publicacion, venceremos', 0, 0, 0, NULL, NULL, 'f', NULL, '2024-04-19 19:39:40.390718', NULL, 0);