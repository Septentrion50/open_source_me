import { gql } from 'apollo-server'


export const typeDefs = gql`
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
`