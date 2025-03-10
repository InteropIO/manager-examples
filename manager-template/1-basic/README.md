# Basic Deployment 

This directory contains the necessary Kubernetes YAML files to deploy the `io.Manager` application in a basic mode. In this mode you will use the Docker images already published by [interop.io](http://interop.)

## 🌐 Local Kubernetes with minikube

If you want to experiment with the Kubernetes configurations locally, you can use minikube to deploy the application to a local cluster.

### Prerequisites

- Docker
- Minikube
- `kubectl` configured to communicate with your Minikube cluster

Use [this article](https://minikube.sigs.k8s.io/docs/start/) to setup minikube.

### Deployment Steps

1. Start minikube and enable ingress
   ```bash
   minikube start
   minikube addons enable ingress
   ```

2. Apply kubernetes configurations
   ```bash
   cd '.\1. basic'
   kubectl apply -f ./kubernetes
   ```

3. Run the following to tunnel the services to your local machine:
   ```bash
   minikube tunnel
   ```
   
This should make the services available at `http://localhost/server/` and `http://localhost/admin-ui/`.

You should be able to login in `Admin UI` with the default credentials `admin` and `admin`.
## Configurations

In the kubernetes folder you will find the following files:

- `1_environment.yaml`: Contains the environment variables for the application:
  - By default this file comes with basic authentication configured to allow a user admin and password admin. You can change those to match your needs.
  - The UI comes with a PUBLIC_URL set to https://127.0.0.1/admin-ui/
- `2_volumes.yaml`: Defines the persistent storage volumes that the application will use. You might want to change those based on the environment you are deploying to.
- `3_db.yaml`: Sets up the Mongo database deployment and service. If you plan to use any other of the supported databases you need to change this file.
- `4_server.yaml`: Deploys the NodeJS Server application of `io.Manager`.
- `5_admin.yaml`: Deploys the Admin UI of `io.Manager`.
- `6_ingress.yaml`: Configures the ingress rules for accessing the application from outside the Kubernetes cluster
  - the server is accessed on /server
  - the admin UI is accessed on /admin-ui

### Server

| ENV variable                | Description                                                                                                                                     | Default                          | Possible Values                  | 
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------- | :------------------------------- |
| API_PORT                    | Port of the Server API                                                                                                                          | 4345                             |                                  |             
| API_BASE                    | Base of the API - use this to prefix endpoints of the API                                                                                       | ""                               |                                  |
| API_NAME                    | Name of the Server instance - used for logging purposes                                                                                         | local                            |                                  |
| API_STORE_TYPE              | Store type                                                                                                  | mongo                            | mongo, postgresql, mssql         |
| API_STORE_MONGO             | Connection string to the selected store type                                                                                                    | mongodb://localhost:27017/server |                                  |
| API_AUTH_METHOD             | Auth method                                                                                                                                     | none                             | none, basic, auth0               |
| API_AUTH_EXCLUSIVE_USERS    | List of users that can access the server without being part of the GLUE42_SERVER_ADMIN group                                                    | []                               |                                  |
| API_AUTH_AUTH0_AUDIENCE     | [Only if API_AUTH_METHOD=auth0] AUTH0 audience                                                                                                  | ""                               |                                  |
| API_AUTH_AUTH0_ISSUER       | [Only if API_AUTH_METHOD=auth0] AUTH0 issuer                                                                                                    | ""                               |                                  |
| API_AUTH_AUTH0_JWKSURI      | [Only if API_AUTH_METHOD=auth0] AUTH0 JSKSURI                                                                                                   | ""                               |                                  |
| API_AUTH_METHOD_BASIC_USERS | [Only if API_AUTH_METHOD=basic] List of users that can access the server without being part of the GLUE42_SERVER_ADMIN group                    | ""                               |                                  |
| API_APP_LOG_FILE            | Location of the main app log file                                                                                                               | "logs/application.log"           |                                  |
| API_APP_ACCESS_LOG_FILE     | Location of the access log file                                                                                                                 | "logs/access.log"                |                                  |
| API_TOKEN_EXPIRES_IN        | Server token expiration in seconds                                                                                                              | 2592000                          |                                  |                    
| API_MONITORING              | Set external monitoring system. Set to none to stop publishing metrics to sentry                                                                | sentry                           | sentry, none                     | 


### Admin UI

| ENV variable                | Description                                                                                                                                     | Default                          | Possible Values                  | 
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------- | :------------------------------- |
| REACT_APP_SERVER_BASE       | Port of the Server API                                                                                                                          | 4345                             |                                  |             
| PUBLIC_URL                  | Base of the API - use this to prefix endpoints of the API                                                                                       | ""                               |                                  |
| REACT_APP_BASE              | Name of the Server instance - used for logging purposes                                                                                         | local                            |                                  |
| REACT_APP_AUTH              | Auth method used by the server                                                                                                                  | basic                            | none, basic, auth0               |
| REACT_APP_AUTH_USER         | [Only if REACT_APP_AUTH=none] sets the user that will be used to connect to the server, should match one of the API_AUTH_EXCLUSIVE_USERS in the server config  | mongodb://localhost:27017/server |                                  |
| REACT_APP_AUTH0_DOMAIN      | [Only if REACT_APP_AUTH=auth0] Auth0 Domain       | mongodb://localhost:27017/server |                                  |
| REACT_APP_AUTH0_CLIENT_ID   | [Only if REACT_APP_AUTH=auth0] Auth0 Client ID    | mongodb://localhost:27017/server |                                  |
| REACT_APP_AUTH0_AUDIENCE    | [Only if REACT_APP_AUTH=auth0] Auth0 Audience     | mongodb://localhost:27017/server |                                  |
| REACT_APP_AUTH0_REDIRECT_URL| [Only if REACT_APP_AUTH=auth0] Auth0 Redirect URL | mongodb://localhost:27017/server |                                  |