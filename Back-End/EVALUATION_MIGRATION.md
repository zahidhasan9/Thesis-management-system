# Evaluation Workflow Migration

The schema additions use safe defaults, so new records work without a manual
migration. Existing records that use `evaluatorMarks` or `thirdEvaluatorMark`
can be copied into `evaluatorAssignments` with the idempotent migration:

```powershell
npm run migrate:evaluation
```

Before running it:

1. Back up the MongoDB database.
2. Configure `MONGO_URI` in `Back-End/.env`.
3. Set `THIRD_EVALUATOR_THRESHOLD` if the institution does not use `10`.
4. Stop application writes until the command completes.

The script does not delete legacy fields or overwrite an existing
`evaluatorAssignments` array. Running it again will not duplicate assignments.
