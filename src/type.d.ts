export interface Label{
    name:string;
    color:string;
}

export interface Assignees{
    login:string;
    avatar_url:string;
}

export interface RestIssueRObject {
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


export interface Language {
    name: string;
    percentage: number;
    color: string;
  }
  
export interface RepoInfo   {
    languages: Language[];
    totalSize: number;
}