require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const { Octokit, App, Action } = require("octokit");

const octokit = new Octokit({ auth: `${process.env["GH_ACCESS_TOKEN"]}` });

interface RestIssueRObject {
  url: string;
  owner: string;
  repo: string;
}

const getRESTIssues = async (
  queryParams: string
): Promise<RestIssueRObject[]> => {
  const response = await octokit.request(`GET /search/issues?q=${queryParams}`);
  const repositoriesUrls: RestIssueRObject[] = [];
  response.data.items.forEach((repo: any) => {
    const splittedRepoUrl = repo.repository_url.split("/");
    repositoriesUrls.push({
      url: repo.repository_url,
      owner: splittedRepoUrl[4],
      repo: splittedRepoUrl[5],
    });
  });
  return repositoriesUrls;
};

interface Language {
  name: string;
  percentage: number;
  color: string;
}

interface RepoInfo {
  url: string;
  owner: string;
  name: string;
  languages: Language[];
  totalSize: number;
}

const calcPercent = (size: number, totalSize: number): number => {
  return parseFloat((size / totalSize).toFixed(2));
};

const getRepoDetailsGQL = async (
  repos: RestIssueRObject[]
): Promise<RepoInfo[]> => {
  const output = [];
  for (let i = 0; i < repos.length; i++) {
    let { repository } = await octokit.graphql(
      `
    query lookAtRepos ($owner: String!, $name: String!) {
      repository(owner:$owner, name:$name){
        url
        languages(first:5){
          totalSize
          edges{
            size
            node{
              name
              color
            }
          }
        }
      }
    }
    `,
      {
        owner: repos[i].owner,
        name: repos[i].repo,
      }
    );
    //calculer la size/totalSize
    //avoir le nom
    //colour

    let repInfo = {
      url: repository.url,
      owner: repos[i].owner,
      name: repos[i].repo,
      totalSize: repository.languages?.totalSize,
      languages: extractLanguagesInfo(
        repository.languages.edges,
        repository.languages?.totalSize
      ),
    };

    console.log(repInfo);
    console.log(repInfo.languages);
    output.push(repInfo);
  }
  return output;
};

const extractLanguagesInfo = (
  languages: any[],
  totalSize: number
): Language[] => {
  let languagesInfo: Language[] = [];
  languages.forEach((language) => {
    languagesInfo.push({
      name: language.node.name,
      percentage: calcPercent(language.size, totalSize),
      color: language.node.color,
    });
  });
  return languagesInfo;
};

// (async () => {
// await getRepoDetailsGQL(await getRESTIssues("q=is:open"));
// })();

const typeDefs = gql`
  type Language {
    name: String
    percentage: Float
    color: String
  }
  type RepoInfo {
    url: String
    owner: String
    name: String
    languages: [Language]
    totalSize: Int
  }
  type Query {
    getIssues(input: String): [RepoInfo]
  }
  type Mutation {
    saveIssue: String
  }
`;

const resolvers = {
  Query: {
    getIssues: async (_parent: any, { input }: { input: string }) => {
      return await getRepoDetailsGQL(await getRESTIssues(input));
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }: { url: string }) => {
  console.log(`Server ready at ${url}`);
  return;
});
