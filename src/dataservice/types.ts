export class Many<T> {
    constructor(readonly status: number, readonly data: T[]) {
    }
}

export class Just<T> {
    constructor(readonly code: number, readonly data: T) {
    }
}

export class AppSummary {
    constructor(readonly name: string, readonly total: number) {
    }
}

export class Migration {
    constructor(readonly app: string, readonly script_id: number, readonly script_name: string,
                readonly batch_no: string, readonly executed: string, readonly status: string,
                readonly team: string, readonly version: string) {
    }
}

export class Run {

    constructor(readonly app: string, readonly batch_no: string, readonly executed: string,
                readonly status: string, readonly files: number, readonly statements: number) {
    }
}

export class Status {
    constructor(readonly status: string, readonly message: string) {
    }
}