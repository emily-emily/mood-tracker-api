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
```npm run typeorm migration:generate -- -n <migration_name>```
Note that this compares the current entities (path specified in `ormconfig.json` as `"entities"`) to the state of the current database.

## Misc. TILs
- For typescript type errors that would otherwise work in javascript, ignore them using `// @ts-ignore` in the line immediately preceding the line with the error.
- In Javascript, `Date.getTime` returns the unix timestamp in milliseconds, and Postgres `TO_TIMESTAMP` takes unix timestamp in seconds.
- Express middleware: calling `next()` takes you to the next item, `next('route')` to the next route, and `next` with anything but `'route'` takes you to the first error handler (skipping other middleware). For `routing-controllers`, we can include our custom error handler as a middleware, but we must disable the default error handler (since that runs first) in `createExpressServer` or `useExpressServer` (still unclear of the difference between those). Set `defaultErrorHandler: false` in options.
