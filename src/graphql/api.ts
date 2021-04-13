import {gql} from "apollo-server-express";
import {IResolvers, makeExecutableSchema} from "graphql-tools";
import {GraphQLSchema} from "graphql";
import appService from "../dataservice";

const typeDefs = gql`
    type Query {
        status: String!
        apps: [App]!
        migrations(appName: ID!): [Migration]!
        runs(appName: ID!): [Run]!
    }

    type App {
        name: String!
        total: String
    }

    type Migration {
        app: String!
        script_id: Int
        script_name: String
        batch_no: String
        executed: String
        status: String
        team: String
    }
    type Run {
        app: String!
        batch_no: String
        executed: String
        status: String
        files: Int
        statements: Int
    }
`;

const resolvers: IResolvers = {
    Query: {
        status: () => "Ok",
        apps: () => {
            return appService.getApps().then(m => m.data)
        },
        migrations: (parent, args) => {
            return appService.getMigrations(args.appName).then(m => m.data)
        },
        runs: (parent, args) => {
            return appService.getRuns(args.appName).then(m => m.data)
        }
    },
};
const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default schema;