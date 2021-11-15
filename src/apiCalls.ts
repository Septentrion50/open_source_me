import { Octokit } from "octokit";
import { RestIssueRObject, RepoInfo  } from "./type";
import {extractLanguagesInfo} from './utils'

const octokit = new Octokit({ auth: `${process.env["GH_ACCESS_TOKEN"]}` });

export const getRESTIssues = async (
    queryParams: string
  ): Promise<RestIssueRObject[]> => {
    const queryone = encodeURIComponent(`is:open`);
    const querytwo = encodeURIComponent(`language:typescript`);
    const response = await octokit.request(`GET /search/issues?q=${queryone}+${querytwo}`);
    console.log(response)
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
    repository_url: string
  ): Promise<RepoInfo> => {
    const splittedRepoUrl =  repository_url.split("/")
    console.log("here",repository_url)
    const repository_owner = splittedRepoUrl[splittedRepoUrl.length - 2];
    const repository_name = splittedRepoUrl[splittedRepoUrl.length - 1];
    console.log("repository_owner", repository_owner)
    console.log("repository_name", repository_name)
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
          owner: repository_owner,
          name: repository_name,
        }
      );
  
      let repInfo = {
        totalSize: repository.languages?.totalSize,
        languages: extractLanguagesInfo(
          repository.languages.edges,
          repository.languages?.totalSize
        ),
      };
      console.log("repInfo", repInfo)
      return repInfo;
    }
    