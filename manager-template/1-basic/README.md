# Basic Deployment

This directory contains the necessary Kubernetes YAML files to deploy the `io.Manager` application in a basic mode. In this mode you will use the Docker images already published by [interop.io](https://github.com/orgs/InteropIO/packages)

## 🌐 Local Kubernetes with minikube

If you want to experiment with the Kubernetes configurations locally, you can use minikube to deploy the application to a local cluster.

### Prerequisites

- Docker
- Minikube
- `kubectl` configured to communicate with your Minikube cluster

Use [this article](https://minikube.sigs.k8s.io/docs/start/) to setup minikube.

License - **io.Manager** requires a license key to operate. To acquire a license key, contact us at `sales@interop.io`. Apply the license key using the `API_LICENSE_KEY` environment variable in [./kubernetes/_1_environment.yaml](./kubernetes/_1_environment.yaml)

### Deployment Steps

1. Start minikube and enable ingress

   ```bash
   minikube start
   minikube addons enable ingress
   ```

2. Apply kubernetes configurations

   ```bash
   cd ./1-basic
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
