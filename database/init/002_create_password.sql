CREATE TABLE "Password" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hashed_password VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE
);
