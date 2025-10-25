-- CreateTable
CREATE TABLE "PostBody" (
    "id" TEXT NOT NULL,
    "body" VARCHAR(500) NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostBody_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostBody_postId_idx" ON "PostBody"("postId");

-- CreateIndex
CREATE INDEX "PostBody_createdAt_idx" ON "PostBody"("createdAt");

-- AddForeignKey
ALTER TABLE "PostBody" ADD CONSTRAINT "PostBody_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
