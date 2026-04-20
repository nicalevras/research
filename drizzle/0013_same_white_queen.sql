ALTER TABLE "compounds" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;

UPDATE "compounds"
SET "featured" = true
WHERE "id" IN (
  'bpc-157',
  'tb-500',
  'semaglutide',
  'tirzepatide',
  'retatrutide',
  'cjc-1295-ipamorelin'
);
