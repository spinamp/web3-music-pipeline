import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const typesArray = loadFilesSync([
    path.join(__dirname, './query.graphql'),
    path.join(__dirname, './types'),
    path.join(__dirname, './inputs'),
]);

export default mergeTypeDefs(typesArray);
