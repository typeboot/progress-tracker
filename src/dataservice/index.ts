import dbInterface from "../database";
import {AppSummary, Just, Migration, Many, Run, Status} from "./types";
import config from "../config";

class AppService {
    constructor(readonly schema:string) {
    }

    async getApps(): Promise<Many<AppSummary>> {
        return new Promise<Many<AppSummary>>((resolve, reject) => {
            dbInterface.query(
                `select  app_name, count(*) as total from ${this.schema}.jdbc_migrations_runs where statements > 0 group by app_name`,
                [])
                .then(rs => {
                    resolve(new Many<AppSummary>(
                        200,
                        rs.rows.map(row => {
                            return new AppSummary(row.app_name, row.total);
                        })));
                }).catch(err => {
                // tslint:disable-next-line:no-console
                console.log("apps", err);
                return reject(new Many(500, []));
            });
        });
    }

    async getMigrations(appName: string): Promise<Many<Migration>> {
        return new Promise<Many<Migration>>((resolve, reject) => {
            dbInterface.query(
                `select  app_name, version, script_id, script_name, batch_no, executed, status, team from ${this.schema}.jdbc_migrations where app_name=$1 order by script_id asc, batch_no asc`,
                [appName])
                .then(rs => {
                    resolve(
                        new Many<Migration>(200,
                            rs.rows.map(row => {
                                return new Migration(
                                    row.app_name,
                                    row.script_id,
                                    row.script_name,
                                    row.batch_no,
                                    row.executed,
                                    row.status,
                                    row.team,
                                    row.version);
                            })));
                }).catch(err => {
                // tslint:disable-next-line:no-console
                console.log("app migrations", err);
                reject(new Many<Migration>(500, []));
            });
        });
    }

    async getRuns(appName: string): Promise<Many<Run>> {
        return new Promise<Many<Run>>((resolve, reject) => {
            dbInterface.query(
                `select  app_name, batch_no, executed, status, files, statements from ${this.schema}.jdbc_migrations_runs where app_name=$1 order by batch_no asc`,
                [appName])
                .then(rs => {
                    resolve(new Many<Run>(
                        200,
                        rs.rows.map(row => {
                            return new Run(
                                row.app_name,
                                row.batch_no,
                                row.executed,
                                row.status,
                                row.files,
                                row.statements
                            );
                        })
                    ));
                }).catch(err => {
                // tslint:disable-next-line:no-console
                console.log("app runs", err);
                reject(new Many<Run>(500, []));
            });
        })
    }

    async health(): Promise<Just<Status>> {
        return new Promise<Just<Status>>((resolve, reject) => {
            dbInterface.query('SELECT $1::text as message', ['Ok'])
                .then(rs => {
                    resolve(
                        new Just<Status>(200,
                            new Status("UP", rs.rows[0].message)));
                }).catch(err => {
                reject(
                    new Just<Status>(500,
                        new Status("DOWN", "query failed")));
            });
        });
    }
}


const cleanup = async (typeName: string, code: number) => {
    await dbInterface.end();
    // tslint:disable-next-line:no-console
    console.log("type", typeName, "code ", code);
    process.exit(code);
};

["exit", "SIGINT", "SIGTERM", "SIGUSR1", "SIGUSR2"].forEach(eventName => {
    process.on(eventName, cleanup);
});

const appService = new AppService(config.databaseSchema());
export default appService;