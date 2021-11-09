require("dotenv").config();
import { Octokit, App } from "octokit";


const octokit = new Octokit({ auth: `${process.env["GH_ACCESS_TOKEN"]}` });

interface RestIssueRObject {
    url: string;
    owner: string;
    repo: string;
  }
  
  const getRESTIssues = async (
    queryParams: string
  ): Promise<any> => {
    const response = await octokit.request(`GET /search/issues?${queryParams}`);
    // const repositoriesUrls: RestIssueRObject[] = [];
    // response.data.items.forEach((repo: any) => {
    //   const splittedRepoUrl = repo.repository_url.split("/");
    //   repositoriesUrls.push({
    //     url: repo.repository_url,
    //     owner: splittedRepoUrl[4],
    //     repo: splittedRepoUrl[5],
    //   });
    // });
    console.log(response.data[0])
    
  };


const getRESTRepository = async(owner:string, repo:string):Promise<any> => {
        const response1 = await octokit.request(`GET /repos/${owner}/${repo}`)
        const response3 = await octokit.request(`GET /repositories`)

        //console.log(response1.data.topics)
}

(async()=>{
    const repos = await getRESTIssues("q=is:open")
    //getRESTRepository(repos[0].owner, repos[0].repo)
})()
