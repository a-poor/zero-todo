CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

\c zstart;

CREATE TABLE "task" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT UNIQUE,
  "text" TEXT,
  "completed" BOOLEAN
);

