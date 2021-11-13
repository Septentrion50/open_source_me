import { Octokit } from "octokit";
import { RestIssueRObject, RepoInfo  } from "./type";
import {extractLanguagesInfo} from './utils'

const octokit = new Octokit({ auth: `${process.env["GH_ACCESS_TOKEN"]}` });

export const getRESTIssues = async (
    queryParams: string
  ): Promise<RestIssueRObject[]> => {
    const query = encodeURIComponent(`q=is:open ${queryParams}`)
    const response = await octokit.request(`GET /search/issues?q=${query}`);
    console.log("response",response)
    const issueData: RestIssueRObject[] = [];
    response.data.items.forEach((issue: any) => {
      const splittedRepoUrl = issue.repository_url.split("/");
      issueData.push({
        issue_url: issue.url,
        issue_number: issue.number,
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

export const getRepoDetailsGQL = async (
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
  
      let repInfo = {
        issue_url: issuesInfo[i].issue_url,
        issue_number: issuesInfo[i].issue_number,
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