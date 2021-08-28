CREATE TABLE IF NOT EXISTS DocumentContent(
  id SERIAL PRIMARY KEY,
  content JSON,
);

CREATE TABLE IF NOT EXISTS Documents(
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  maskedName VARCHAR,
  contentId VARCHAR REFERENCES DocumentContent(id),
);