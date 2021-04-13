#### typeboot progress-tracker
Shows the apps and audit information like migrations and runs 

### Progres Tracker Configuration
Following env variables can be provided

|Env Variable|Default Value|Description|
|---|---|---|
|DB_USER|postgres|username with access to tables such as jdbc_migrations, jdbc_migrations_runs|
|DB_NAME|postgres|name of the database where migration schema is hosted|
|DB_SCHEMA|executor|name of the schema for migration tables|
|DB_PASSWORD|password|password for postgres user. Can be provided with the prefix "file:", if reading from file|
|DB_HOST|postgres|database host to connect to|
|DB_PORT|5432|database port to connect to|
|DB_CONNECTION_POOL_SIZE|3|database connection pool size|
|PORT|8080|Node application port|


#### Reading username/password from file

```
export DB_PASSWORD=file:./user.txt
npm run dev:serve
```

### Apis
The following REST apis are available

|Api|Description|
|---|---|
|http://0.0.0.0:8080/apps| List apps and number of migrations performed|
|http://0.0.0.0:8080/apps/:app/migrations|List of migrations|
|http://0.0.0.0:8080/apps/:app/runs|Number of times the migrations have run|

### GraphQL Api
schema is located at src/graphql/schema/schema.graphql

List app names
```
query{
    apps{
        name
        total
    }
}
```

List migrations and runs for an app
```
query {
    migrations(appName:"core"){
        app
        batch_no
        status
        team
        executed
    }
    runs(appName:"core"){
        batch_no
        app
        batch_no
        executed
        status
        files
        statements
    }
}
```

### Deploying container
```
docker run -p 8080:8080 -it typeboot/progress-tracker:0.1
```