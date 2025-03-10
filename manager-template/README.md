# 🔍 Overview
  
[io.Manager](https://interop.io/products/io-manager/) is a server-side application that provides a simple, yet scalable, storage mechanism and monitoring service for [io.Connect platforms](https://interop.io/products/io-connect/). For more information, please visit the [official io.Manager documentation](https://docs.interop.io/manager/overview/index.html).

This repository is a template for building and deploying io.Manager to your own infrastructure. It provides a Docker Compose configuration for local development and testing, as well as Kubernetes configurations for deployment to a production environment.

There are two deploy options:

1. **🌱 Basic**: In this option you use the docker images provided by interop.io and deploy them to your infrastructure. This allows configuration-only control without modifying the code. To use the Basic Mode, follow the instructions in the [Basic Mode README](./1-basic/README.md).
  
2. **🌳 Advanced**: In this option you use the npm packages provided by interop.io, write some code to extend the functionality using extension points and then build your custom docker images for deployment. This option is suitable for more complex customizations.To use the Advanced Mode, follow the instructions in the [Advanced Mode README](./2-advanced/README.md).

# 🔧 Choosing between Basic and Advanced Options

* Use *Advanced* if you need to:
  - Integrate with a custom authentication system that is not supported by io.Manager
  - Integrate with a non-standard database or a proprietary storage solution
  - Extend the functionality of io.Manager using extension points
  - Customize the Administrative UI of io.Manager
  
* In any other case, use *Basic mode*