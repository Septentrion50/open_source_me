
import {getRESTIssues, getRepoDetailsGQL } from './apiCalls';

export const resolvers = {
    Query: {
      getIssues: async (_parent: any, { input }: { input: string }) => {
        return await getRepoDetailsGQL(await getRESTIssues(input));
      },
    },
  };
  