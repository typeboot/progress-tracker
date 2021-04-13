import fs from "fs";
class ConfigProvider {
    constructor(private resourceRegex: RegExp) {
    }

    port(): number {
        return parseInt(process.env.PORT || "8080", 10);
    }

    databaseHost(): string {
        return process.env.DB_HOST || "postgres";
    }

    databasePort(): number {
        return parseInt(process.env.DB_PORT || "5432", 10);
    }

    databaseName(): string {
        return process.env.DB_NAME || "postgres";
    }

    databaseSchema(): string {
        return process.env.DB_SCHEMA || "executor";
    }

    private readResource(candidate: string) {
        const result = this.resourceRegex.exec(candidate);
        if (result !== null) {
            return fs.readFileSync(result[1], {encoding: "utf-8"}).replace("\n", "");
        } else {
            return candidate;
        }
    }

    databaseUser(): string {
        return this.readResource(process.env.DB_USER || "postgres");
    }

    databasePassword(): string {
        return this.readResource(process.env.DB_PASSWORD || "password");
    }

    databaseConnectionSize(): number {
        return parseInt(process.env.DB_CONNECTION_POOL_SIZE || "3", 10);
    }
}

const fsMatcher = /^file\:(.*)/;
const config = new ConfigProvider(fsMatcher);
export default config;