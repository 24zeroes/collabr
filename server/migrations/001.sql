CREATE TABLE IF NOT EXISTS DocumentContent(
  id SERIAL PRIMARY KEY,
  content JSON
);

CREATE TABLE IF NOT EXISTS Documents(
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  maskedName VARCHAR,
  contentId SERIAL REFERENCES DocumentContent(id)
);


INSERT INTO documentcontent (content) VALUES ('{}') RETURNING id;

WITH c AS (INSERT INTO documentcontent (content) VALUES ('{}') RETURNING id)
INSERT INTO documents (name, maskedname, contentid) VALUES ('old', 'qdrtyh2454', (SELECT id from c));

DELETE FROM documents WHERE name is null