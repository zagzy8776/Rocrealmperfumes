const prisma = require('./prisma');

let ensurePromise = null;

/**
 * Production DBs created before the Review model was added can miss the table.
 * Create it once (idempotent) so product reviews work without a manual migration.
 */
async function ensureReviewTable() {
  if (ensurePromise) return ensurePromise;

  ensurePromise = (async () => {
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Review" LIMIT 1`;
      return true;
    } catch (error) {
      const missing =
        error?.code === 'P2021' ||
        /does not exist|relation .*review/i.test(String(error?.message || ''));
      if (!missing) throw error;

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Review" (
          "id" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "rating" INTEGER NOT NULL DEFAULT 5,
          "comment" TEXT NOT NULL,
          "isApproved" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
        );
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "Review_productId_isApproved_idx"
        ON "Review"("productId", "isApproved");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "Review_createdAt_idx"
        ON "Review"("createdAt");
      `);
      // FK may already exist if partially created; ignore failures
      try {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "Review"
          ADD CONSTRAINT "Review_productId_fkey"
          FOREIGN KEY ("productId") REFERENCES "Product"("id")
          ON DELETE CASCADE ON UPDATE CASCADE;
        `);
      } catch {
        // constraint already present
      }
      return true;
    }
  })().catch((err) => {
    ensurePromise = null;
    throw err;
  });

  return ensurePromise;
}

module.exports = { ensureReviewTable };
