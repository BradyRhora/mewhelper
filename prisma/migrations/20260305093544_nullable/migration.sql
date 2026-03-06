-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cat" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    CONSTRAINT "Cat_parent1Id_fkey" FOREIGN KEY ("parent1Id") REFERENCES "Cat" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cat_parent2Id_fkey" FOREIGN KEY ("parent2Id") REFERENCES "Cat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cat" ("cha", "con", "dex", "gender", "id", "int", "luk", "name", "parent1Id", "parent2Id", "retired", "sexuality", "spd", "str") SELECT "cha", "con", "dex", "gender", "id", "int", "luk", "name", "parent1Id", "parent2Id", "retired", "sexuality", "spd", "str" FROM "Cat";
DROP TABLE "Cat";
ALTER TABLE "new_Cat" RENAME TO "Cat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
