ALTER TABLE errands
  ADD COLUMN description TEXT NULL;

-- ge seed-errands
UPDATE errands SET description = 'Installerade server och verifierade drift.' WHERE errand_id = 1;
UPDATE errands SET description = 'Uppdaterade brandväggsregler och testade åtkomst.' WHERE errand_id = 2;

ALTER TABLE errands
  MODIFY description TEXT NOT NULL;