
import {getRESTIssues, getRepoDetailsGQL } from './apiCalls';

export const resolvers = {
    Query: {
      getIssues: async (_parent: any, { input }: { input: string }) => {
        return await getRESTIssues(input)
      },
      getRepoInfo: async (_parent: any, { repository_url }: { repository_url: string }) => {
      return await getRepoDetailsGQL(repository_url);
      },
    },
  };
  