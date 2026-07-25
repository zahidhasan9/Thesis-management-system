# MongoDB Backup

Install MongoDB Database Tools so `mongodump` and `mongorestore` are available.

Create a timestamped compressed backup:

```powershell
npm run backup
```

Restore into a separate database first:

```powershell
mongorestore --uri="$env:MONGO_URI" --archive="path\to\backup.archive.gz" --gzip
```

Store backups outside the application server and protect them like the primary
database. Schedule `npm run backup` with Windows Task Scheduler for regular
automatic backups.
