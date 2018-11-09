## Use seperate branch for adding feature and live on admin to merge it to master
## after completing one stage please push master branch with tag of version
## write test cases with *.spec.js file
## use test driven approach
## first write test cases and then when it is perfectly valid proceed with implementations

## Code structure
```js
/*
    Folder Structure
        *=> ComponentS
        *=> Entities
            => Routes
            => Controller
            => Reducer
            => Model(Types for Typescript)
            => Model(For Database)
            => Export File
            => Schema (Graphql)
        *=> Routes
            => All Component routes combine and export
        *=> Config
        *=> Database
            => Database Connection
            => Database Export
        *=> Logging
            => Logging Connection
            => Logging Export
        *=> Utility Function
            => Function 1
            => Function 2
        *=> GraphQLRouter		
        **=> App (In Isolation for testing)
        **==> Index (Boot Up the Server)
*/    
```
