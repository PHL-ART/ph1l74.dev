-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);
