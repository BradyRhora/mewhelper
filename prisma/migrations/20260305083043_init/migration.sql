-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Cat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
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
    CONSTRAINT "Cat_parent1Id_fkey" FOREIGN KEY ("parent1Id") REFERENCES "Cat" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cat_parent2Id_fkey" FOREIGN KEY ("parent2Id") REFERENCES "Cat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
