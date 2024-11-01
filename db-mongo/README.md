# Introduction

An example that demonstrates how to setup a **io.Manager** instance to use MongoDB

# Prerequisites

### Database

This example requires you to have a MongoDB database to connect to.

You will need to either have a local instance or setup a remote database.

For more information visit our Documentation page on the subject: https://docs.interop.io/manager/databases/mongo/index.html

### interop.io Artifactory

Before you begin you need to add _.npmrc_ file with the following content into this directory (placeholders can be filled in after setting up JFrog account)

```sh
@interopio:registry=https://glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/
//glue42.jfrog.io/artifactory/api/npm/:_auth=<COPY_FROM_JFROG_SETUP>
//glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/:username=<COPY_FROM_JFROG_SETUP>
//glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/:email=<COPY_FROM_JFROG_SETUP>
//glue42.jfrog.io/artifactory/api/npm/default-npm-virtual/:always-auth=true
```

# How to run

- Restore npm packages

```sh

npm install

```

- Start the server

```sh

npm run start

```