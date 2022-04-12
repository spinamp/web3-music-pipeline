import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import context from './context';

import 'dotenv/config'
const PORT = process.env.APOLLO_PORT;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
});

server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
