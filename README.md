
# Introduction

Bizzon CMS Application

## Requirements

- Nodejs 6.0 and above
- MongoDB
- Redis
- Elastic Search
- Nodemon: `npm install -g nodemon`

## Install

```bash
cd web          # Change directory to web 
npm install     # Install nodejs dependency
```
- Import/Export MongoDB Database

```bash
cd misc/seeds  # Change directory to misc/seeds
node import    # Run this command to import default cms data
node export    # Run this command to export your cms data and share to team members

```
- Default CMS Account
```bash

admin@gmail.com/123123

```

## How to run:

```bash
yarn start           # In the web folder
```

## List Connections:
- API Server: [http://localhost:9071/](http://localhost:9071/documentation)
- CMS: [http://localhost:9070/](http://localhost:9070/admin)
- Web:  [http://localhost:9076/](http://localhost:9076/)