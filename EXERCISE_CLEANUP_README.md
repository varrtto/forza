# Custom Exercise Cleanup from Routines

## Overview

This migration automatically removes deleted custom exercises from all routines where they're being used. When a user deletes a custom exercise, the database trigger ensures that the exercise is removed from all routines belonging to that user.

## How It Works

1. **Trigger**: A PostgreSQL trigger fires `AFTER DELETE` on the `user_exercises` table
2. **Function**: The `remove_exercise_from_routines()` function:
   - Gets the deleted exercise name and user ID
   - Finds all routines for that user
   - Iterates through the JSONB structure: `days → muscleGroups → exercises`
   - Removes any exercises with matching names
   - Updates only routines that were modified

## Installation

1. Run the migration script in your Supabase SQL Editor:
   ```sql
   -- Copy and paste the contents of cleanup-exercise-from-routines-migration.sql
   ```

2. Verify the trigger was created:
   ```sql
   SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_remove_exercise_from_routines';
   ```

## What Gets Cleaned Up

When a custom exercise is deleted, it will be automatically removed from:
- All routines belonging to the same user
- All days in those routines
- All muscle groups in those days
- All exercise arrays within those muscle groups

## Example

**Before deletion:**
```json
{
  "days": [
    {
      "muscleGroups": [
        {
          "exercises": [
            { "name": "Custom Push-up", ... },
            { "name": "Bench Press", ... }
          ]
        }
      ]
    }
  ]
}
```

**After deleting "Custom Push-up":**
```json
{
  "days": [
    {
      "muscleGroups": [
        {
          "exercises": [
            { "name": "Bench Press", ... }
          ]
        }
      ]
    }
  ]
}
```

## Reverting

If you need to remove this functionality, run:
```sql
-- Copy and paste the contents of revert-cleanup-exercise-from-routines-migration.sql
```

## Performance Notes

- The trigger only updates routines that actually contain the deleted exercise
- The function uses efficient JSONB operations
- Only routines belonging to the same user are processed
- Updates are batched per routine (one UPDATE per routine that needs changes)

## Important Notes

- **User-scoped**: Only routines belonging to the same user are affected
- **Automatic**: No application code changes needed
- **Idempotent**: Safe to run multiple times
- **Non-destructive**: Only removes exercises, doesn't modify other routine data

