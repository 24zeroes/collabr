
CREATE TABLE IF NOT EXISTS Users(
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  passwordHash VARCHAR
);

-- We can create our user table
CREATE TABLE IF NOT EXISTS Documents(
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  contentId VARCHAR,
  userId INTEGER REFERENCES Users(id)
);


CREATE TABLE IF NOT EXISTS UserDocuments(
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES Users(id),
  documentId INTEGER REFERENCES Documents(id)
)