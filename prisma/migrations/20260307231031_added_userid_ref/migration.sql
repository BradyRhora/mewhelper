/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL DEFAULT '0',
    "name" TEXT,
    "gender" TEXT,
    "sexuality" TEXT,
    "retired" BOOLEAN NOT NULL DEFAULT false,
    "parent1Id" TEXT,
    "parent2Id" TEXT,
    "str" INTEGER NOT NULL DEFAULT 5,
    "dex" INTEGER NOT NULL DEFAULT 5,
    "con" INTEGER NOT NULL DEFAULT 5,
    "int" INTEGER NOT NULL DEFAULT 5,
    "spd" INTEGER NOT NULL DEFAULT 5,
    "cha" INTEGER NOT NULL DEFAULT 5,
    "luk" INTEGER NOT NULL DEFAULT 5,
    CONSTRAINT "Cat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cat_parent1Id_fkey" FOREIGN KEY ("parent1Id") REFERENCES "Cat" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cat_parent2Id_fkey" FOREIGN KEY ("parent2Id") REFERENCES "Cat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cat" ("cha", "con", "dex", "gender", "id", "int", "luk", "name", "parent1Id", "parent2Id", "retired", "sexuality", "spd", "str") SELECT "cha", "con", "dex", "gender", "id", "int", "luk", "name", "parent1Id", "parent2Id", "retired", "sexuality", "spd", "str" FROM "Cat";
DROP TABLE "Cat";
ALTER TABLE "new_Cat" RENAME TO "Cat";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "id") SELECT "createdAt", "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
