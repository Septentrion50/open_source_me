require("dotenv").config();
const { Octokit, App, Action } = require("octokit");

const octokit = new Octokit({ auth: `${process.env["GH_ACCESS_TOKEN"]}` });

let repo = [];

const api_response = async () => {
	const res = await octokit.request("GET /search/issues?q=is:open");
	const repoUrl = res.data.items[0].repository_url;
	repo = repoUrl.split("/");
	const repoOwner = repo[4];
	const repoName = repo[5];
	console.log(repoOwner, repoName);
	const data =
		await octokit.graphql(`
		query lookAtRepos ($owner: String!, $name: String!) { 
			repository(owner:$owner, name:$name){
				url
				name
				description
				descriptionHTML
    			shortDescriptionHTML
				owner{
					id
					login
					avatarUrl
				}
				languages(first:3){
					totalSize
				edges{
					size
				  node{
						 name
						 color
					  }
					}
				nodes{
				  name
				  color
				}
			  }
			}
		  }`, {
			owner: `${repoOwner}`,
			name: `${repoName}`,
		});
	console.log(data);
	console.log(data.repository.languages.edges);
	console.log(data.repository.languages.nodes);
};
api_response();
