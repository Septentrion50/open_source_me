require('dotenv').config();
const { Octokit, App, Action } = require("octokit");

const octokit = new Octokit({ auth: `${process.env['GH_ACCESS_TOKEN']}` });

const api_response = async() => {
				const res = await octokit.request('GET /search/issues?q=is:open');
	console.log(res.data.items[0]);
};
api_response();
