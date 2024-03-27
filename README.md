# GTI619-Lab5

## Git Commands:

### Clone project: 
```git clone https://github.com/LawrenceLiang02/GTI619-Lab5.git ```

 ### Commit Project:
 Ajouter les fichiers: 
 ```git add .```

 Commit avec un commentaire:
 ``` git commit -m " [COMMENTAIRE] "```

 Push: 
 ``` git push ```


### Merge Conflict:

Fetch files from main:
``` git fetch origin main```

Rebase Code:
``` git rebase origin/main```

Rebase merge conflicts:
``` git add .```
``` git rebase --continue```

Force Push (only after using rebase):
``` git push -f```


## Run Project
Frontend: ```cd dans React_Frontend``` et  ```npm run start```

Backend and Database with Docker: ```docker-compose up --build```