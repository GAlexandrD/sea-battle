-- CreateTable
CREATE TABLE "decks" (
    "id" SERIAL NOT NULL,
    "x" INTEGER,
    "y" INTEGER,
    "isDamaged" BOOLEAN,
    "shipId" INTEGER,
    "ShipModelId" INTEGER,

    CONSTRAINT "decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" SERIAL NOT NULL,
    "height" INTEGER,
    "width" INTEGER,
    "playerId" INTEGER,
    "PlayerModelId" INTEGER,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" VARCHAR(255) NOT NULL,
    "movingSide" BOOLEAN,
    "player1" INTEGER,
    "PlayerModelId" INTEGER,
    "player2" INTEGER,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ships" (
    "id" SERIAL NOT NULL,
    "x" INTEGER,
    "y" INTEGER,
    "isDestroyed" BOOLEAN,
    "fieldId" INTEGER,
    "FieldModelId" INTEGER,

    CONSTRAINT "ships_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_ShipModelId_fkey" FOREIGN KEY ("ShipModelId") REFERENCES "ships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "ships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_PlayerModelId_fkey" FOREIGN KEY ("PlayerModelId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_PlayerModelId_fkey" FOREIGN KEY ("PlayerModelId") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_player1_fkey" FOREIGN KEY ("player1") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_player2_fkey" FOREIGN KEY ("player2") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ships" ADD CONSTRAINT "ships_FieldModelId_fkey" FOREIGN KEY ("FieldModelId") REFERENCES "fields"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ships" ADD CONSTRAINT "ships_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
