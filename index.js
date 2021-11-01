import fetch from 'node-fetch';
import {gql} from 'graphql';

//TODO Authenticate on APIS.

const data = {
				'method': 'get',
				'headers': {
								'Authorization': `${process.env['GH_ACCESS_TOKEN']}`
				}
}

const api_response = fetch(`https://api.github.com`, data)

console.log(api_response)
