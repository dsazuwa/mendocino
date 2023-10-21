CREATE OR REPLACE FUNCTION menu.enforce_selection_constraint()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.allow_multiple_selections IS TRUE THEN
    IF NEW.min_selection IS NULL OR NEW.max_selection IS NULL OR NEW.max_free_selection IS NULL THEN
      RAISE EXCEPTION 'When allow_multiple_selections is TRUE, min_selection, max_selection, and max_free_selection must not be NULL';
    END IF;
  ELSE
    IF NEW.min_selection IS NOT NULL OR NEW.max_selection IS NOT NULL OR NEW.max_free_selection IS NOT NULL THEN
      RAISE EXCEPTION 'When allow_multiple_selections is FALSE, min_selection, max_selection, and max_free_selection must be NULL';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER modifier_group_check
BEFORE INSERT OR UPDATE
ON menu.modifier_groups
FOR EACH ROW
EXECUTE FUNCTION menu.enforce_selection_constraint();
