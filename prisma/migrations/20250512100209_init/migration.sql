-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);
