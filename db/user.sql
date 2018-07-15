-- automatic updated_at.
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS trigger AS
$BODY$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
ALTER FUNCTION update_modified_column()
OWNER TO zladuxwzdhrumm;

--User
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       text,
  email      text,
  phone      text,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
)WITHOUT OIDS;

CREATE TRIGGER  users_updated_at
  BEFORE UPDATE
  ON users
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();



