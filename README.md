# mood-tracker-api
 
An api for mood-tracker.

## Running Postgres in Docker
All of the details of the docker container are in `docker-compose.yml`.

To start the container, run `docker-compose up`.

To stop and remove the container, run `docker-compose down`. Add flag `--volumes` (`-v`) to remove the volumes as well; this may be useful for a hard reset.

## Migrations
Migrations are items a user can run manually to update the database when the schemas are updated. The alternative would be to set `"syncronize": true` in `ormconfig.json`, which update the database every time we connect, but this is not recommended as we could lose data.

Scripts have been included for migrations.

To run migrations:
```npm run typeorm migration:run```

To revert a migration:
```npm run typeorm migration:revert```

To generate a new migration:
```npm run typeorm migration:generate <migration_name>```
Note that this compares the current entities (path specified in `ormconfig.json` as `"entities"`) to the state of the current database.

