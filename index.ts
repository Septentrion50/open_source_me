require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const { Octokit, App, Action } = require("octokit");

const octokit = new Octokit({ auth: `${process.env["GH_ACCESS_TOKEN"]}` });


interface Label{
  name:string;
  color:string;
}
interface Assignees{
  login:string;
  avatar_url:string;
}

interface RestIssueRObject {
  issue_url: string;
  issue_number: number;
  repository_url: string;
  created_at: string;
  updated_at: string;
  labels: Label[];
  assignees: Assignees[];
  repository_owner: string;
  repository_name: string;
}

const getRESTIssues = async (
  queryParams: string
): Promise<RestIssueRObject[]> => {
  const response = await octokit.request(`GET /search/issues?q=${queryParams}`);
  const issueData: RestIssueRObject[] = [];
  response.data.items.forEach((issue: any) => {
    const splittedRepoUrl = issue.repository_url.split("/");
    issueData.push({
      issue_url:issue.url,
      issue_number:issue.number,
      repository_url: issue.repository_url,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      labels: issue.labels,
      assignees: issue.assignees,
      repository_owner: splittedRepoUrl[4],
      repository_name: splittedRepoUrl[5],
    });
  });
  return issueData;
};

interface Language {
  name: string;
  percentage: number;
  color: string;
}

interface RepoInfo extends RestIssueRObject  {
  languages: Language[];
  totalSize: number;
}

const calcPercent = (size: number, totalSize: number): number => {
  return parseFloat((size / totalSize).toFixed(2));
};

const getRepoDetailsGQL = async (
  issuesInfo: RestIssueRObject[]
): Promise<RepoInfo[]> => {
  const output = [];
  for (let i = 0; i < issuesInfo.length; i++) {
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
        owner: issuesInfo[i].repository_owner,
        name: issuesInfo[i].repository_name,
      }
    );
    //calculer la size/totalSize
    //avoir le nom
    //colour

    let repInfo = {
      issue_url:issuesInfo[i].issue_url,
      issue_number:issuesInfo[i].issue_number,
      repository_url: issuesInfo[i].repository_url,
      created_at: issuesInfo[i].created_at,
      updated_at: issuesInfo[i].updated_at,
      labels: issuesInfo[i].labels,
      assignees: issuesInfo[i].assignees,
      repository_owner: issuesInfo[i].repository_owner,
      repository_name: issuesInfo[i].repository_name,
      totalSize: repository.languages?.totalSize,
      languages: extractLanguagesInfo(
        repository.languages.edges,
        repository.languages?.totalSize
      ),
    };
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



const typeDefs = gql`
  type Label{
    name:String
    color:String
  }
  type Assignees{
    login:String
    avatar_url:String
  }
  type Language {
    name: String
    percentage: Float
    color: String
  }
  type RepoInfo {
    issue_url:String,
    repository_url:String,
    created_at:String,
    updated_at:String,
    labels:[Label],
    assignees:[Assignees],
    issue_number:Int,
    languages: [Language]
    repository_owner: String
    repository_name: String
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
