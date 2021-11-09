
| apres 
Issue(Rest)
    issue_url -> url de l'issue | url
    repository_url ->  url du repo | repository_url
    created_at -> la date de creation | created_at(Date)
    updated_at -> la date d'update | updated_at (Date)
    labels -> details sur les labels | labels([])
    assignees -> details sur les assignee | assignees([])
    owner -> repository owner
    repository_name -> name of the repository

    
Repo(GraphQL)
    repository_url -> url du repo
    languages -> details sur les languages | ([])
    frameworks -> si PR on regarde l'arbre else on cheche le fichier raw selon les
                  languages que l'on parsera 