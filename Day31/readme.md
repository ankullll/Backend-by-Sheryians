# ☁️ AWS Deployment Architecture — VPC, ECS, ECR & ALB

> Beginner-friendly notes to understand how a Dockerized application can be deployed on AWS using **VPC, Subnets, ECS, ECR, ALB, Target Groups, and Security Groups**.

---

## 📌 Architecture Overview

A typical AWS architecture for a web application can look like this:

```text
                    🌍 INTERNET
                         │
                         ▼
              ┌─────────────────────┐
              │         ALB         │
              │ Application Load    │
              │      Balancer       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    Target Group     │
              │  Traffic Routing    │
              └──────────┬──────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
        ┌───────────┐         ┌───────────┐
        │ ECS Task  │         │ ECS Task  │
        │ Container │         │ Container │
        └─────┬─────┘         └─────┬─────┘
              │                     │
              └──────────┬──────────┘
                         │
                         ▼
                 🗄️ PRIVATE SUBNET
                      Database
```

---

# 1. 🌐 VPC — Virtual Private Cloud

**VPC = Virtual Private Cloud**

A VPC is an isolated virtual network inside AWS where we deploy and manage our AWS resources.

Think of a VPC as your **private network inside AWS**.

### Example

```text
AWS
 │
 └── VPC
      │
      ├── Public Subnet
      │
      └── Private Subnet
```

A VPC allows us to control:

- IP addresses
- Subnets
- Routing
- Internet connectivity
- Security
- Network access

---

# 2. 🧩 Subnet

A **Subnet** is a smaller network created inside a VPC.

Generally, we divide our infrastructure into:

### 1️⃣ Public Subnet

A public subnet contains resources that need to communicate with the internet.

```text
Internet
   │
   ▼
Public Subnet
   │
   └── Web/Application resources
```

A public subnet typically has a route to an **Internet Gateway**.

### 2️⃣ Private Subnet

A private subnet is used for resources that should not be directly accessible from the public internet.

```text
Private Subnet
   │
   └── Database
```

For example:

- MongoDB-compatible database
- PostgreSQL
- MySQL
- Redis
- Internal services

### 🔐 Why use private subnets?

If the database is placed in a private subnet, users on the internet cannot directly connect to it.

Instead:

```text
Internet
   ↓
ALB
   ↓
Application
   ↓
Database
```

This provides an additional layer of security.

---

# 3. 🐳 ECR — Elastic Container Registry

**ECR = Amazon Elastic Container Registry**

ECR is used to **store Docker container images**.

Think of ECR as a cloud-based Docker image repository.

### Flow

```text
Dockerfile
    │
    ▼
Docker Image
    │
    ▼
    ECR
    │
    └── Stores Docker Image
```

For example:

```bash
docker build -t my-app .
```

Then the image can be pushed to ECR.

```text
Local Machine
     │
     │ docker push
     ▼
    ECR
     │
     └── my-app:latest
```

### 📦 ECR is mainly responsible for:

- Storing Docker images
- Versioning images using tags
- Making images available to ECS
- Managing private container repositories

---

# 4. 🚀 ECS — Elastic Container Service

**ECS = Amazon Elastic Container Service**

ECS is used to **run and manage Docker containers on AWS**.

The relationship is:

```text
ECR
 │
 │ stores image
 ▼
Docker Image
 │
 │ pulled by
 ▼
ECS
 │
 └── Runs Container
```

### Simple way to remember:

> **ECR stores the image, ECS runs the container.**

---

# 5. 📋 ECS Task Definition

A **Task Definition** tells ECS how a container should run.

It contains information such as:

- Which Docker image to use
- CPU
- Memory
- Container port
- Environment variables
- Networking configuration
- Logging configuration

Example:

```text
Task Definition
      │
      ├── Image → my-app:latest
      ├── CPU → 512
      ├── Memory → 1 GB
      └── Port → 3000
```

### Important correction

A Task Definition doesn't directly decide **which physical machine** the container runs on.

It defines **how the container should run**.

ECS then schedules the task on the available compute capacity.

---

# 6. ⚙️ ECS Task

A **Task** is a running instance of a Task Definition.

For example:

```text
Task Definition
      │
      ▼
ECS Task
      │
      └── Running Container
```

If we need multiple copies:

```text
Task Definition
      │
      ├── Task 1
      ├── Task 2
      └── Task 3
```

This allows the application to handle more traffic.

---

# 7. 🔄 ECS Service

An **ECS Service** manages the desired number of running tasks.

For example:

```text
Desired Tasks = 3

ECS Service
   │
   ├── Task 1 ✅
   ├── Task 2 ✅
   └── Task 3 ✅
```

If one task crashes:

```text
Task 1 ❌
Task 2 ✅
Task 3 ✅
```

The ECS Service can launch another task to maintain the desired count.

```text
Task 1 ❌
   ↓
ECS Service
   ↓
New Task ✅
```

### Scaling

When traffic increases, we can increase the number of tasks:

```text
Low Traffic

Service
 ├── Task 1
 └── Task 2


High Traffic

Service
 ├── Task 1
 ├── Task 2
 ├── Task 3
 ├── Task 4
 └── Task 5
```

---

# 8. ⚖️ ALB — Application Load Balancer

**ALB = Application Load Balancer**

ALB receives incoming HTTP/HTTPS requests and distributes them among healthy application targets.

```text
             🌍 Internet
                  │
                  ▼
           ┌─────────────┐
           │     ALB     │
           └──────┬──────┘
                  │
          ┌───────┴────────┐
          ▼                ▼
       Task 1           Task 2
```

Instead of users directly accessing individual servers, they access the ALB.

### Example

```text
User Request
     │
     ▼
https://myapp.com
     │
     ▼
    ALB
     │
     ├──────► Task 1
     │
     ├──────► Task 2
     │
     └──────► Task 3
```

---

# 9. 🎯 Target Group

A **Target Group** defines the targets to which the ALB sends traffic.

The targets can include resources such as ECS tasks.

```text
Internet
    │
    ▼
   ALB
    │
    ▼
Target Group
    │
    ├── Task 1
    ├── Task 2
    └── Task 3
```

The Target Group also performs **health checks** to determine whether targets are healthy.

Example:

```text
Target 1 → Healthy ✅
Target 2 → Healthy ✅
Target 3 → Unhealthy ❌
```

The ALB can avoid sending normal traffic to unhealthy targets.

---

# 10. 🔐 Security Group

A **Security Group (SG)** acts like a virtual firewall for AWS resources.

It controls which inbound and outbound traffic is allowed.

### Example

Suppose our application runs on:

```text
Port: 3000
```

We can configure a Security Group to allow required traffic to that port.

Common ports:

| Port | Purpose |
|------|---------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3000 | Common Node.js application port |
| 5432 | PostgreSQL |
| 3306 | MySQL |

### Example Architecture

```text
Internet
   │
   ▼
ALB Security Group
   │
   │ Allow HTTP/HTTPS
   ▼
ECS Security Group
   │
   │ Allow application traffic
   ▼
Database Security Group
```

A good security design is to allow only the traffic that is actually required.

---

# 🏗️ Complete AWS Architecture

Putting everything together:

```text
                         🌍 INTERNET
                              │
                              ▼
                    ┌─────────────────┐
                    │       ALB       │
                    │ Application     │
                    │ Load Balancer   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Target Group   │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
          ┌───────────┐             ┌───────────┐
          │ ECS Task  │             │ ECS Task  │
          │ Container │             │ Container │
          └─────┬─────┘             └─────┬─────┘
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Private Subnet  │
                    │                 │
                    │    Database     │
                    └─────────────────┘


        ┌──────────────────────────────────────┐
        │                  VPC                 │
        │                                      │
        │  Public Subnet     Private Subnet    │
        │                                      │
        │      ALB               Database      │
        │       │                    ▲         │
        │       ▼                    │         │
        │    ECS Tasks ──────────────┘         │
        │                                      │
        └──────────────────────────────────────┘
```

---

# 🔄 Complete Request Flow

Let's understand the complete flow step-by-step.

### Step 1 — User sends request

```text
User
 ↓
https://myapp.com
```

### Step 2 — Request reaches ALB

```text
Internet
 ↓
ALB
```

The ALB receives the incoming request.

### Step 3 — ALB checks Target Group

```text
ALB
 ↓
Target Group
```

The Target Group contains the available ECS tasks.

### Step 4 — Traffic goes to a healthy ECS Task

```text
Target Group
 ↓
ECS Task
 ↓
Docker Container
```

### Step 5 — Application processes request

The application inside the Docker container processes the request.

### Step 6 — Application communicates with database

```text
ECS Task
   │
   ▼
Private Subnet
   │
   ▼
Database
```

The database is not directly exposed to the internet.

### Step 7 — Response returns

```text
Database
   ↓
ECS Task
   ↓
Target Group
   ↓
ALB
   ↓
User
```

---

# 🧠 Easy Way to Remember Everything

| AWS Component | Simple Meaning |
|---|---|
| **VPC** | Your private network in AWS |
| **Subnet** | Smaller network inside VPC |
| **Public Subnet** | Resources with internet-facing connectivity |
| **Private Subnet** | Resources isolated from direct internet access |
| **ECR** | Stores Docker images |
| **ECS** | Runs Docker containers |
| **Task Definition** | Instructions for running a container |
| **Task** | Running instance of a task definition |
| **Service** | Maintains and scales desired tasks |
| **ALB** | Receives and distributes application traffic |
| **Target Group** | Group of targets receiving ALB traffic |
| **Security Group** | Virtual firewall controlling traffic |

---

# 🐳 ECR vs ECS

The easiest distinction:

```text
             Docker Image
                  │
                  ▼
            ┌───────────┐
            │    ECR    │
            │   STORE   │
            └─────┬─────┘
                  │
                  │ Pull Image
                  ▼
            ┌───────────┐
            │    ECS    │
            │    RUN    │
            └───────────┘
```

> 🟢 **ECR = Store Docker Image**  
> 🔵 **ECS = Run Docker Container**

---

# 🌐 Public vs Private Subnet

```text
                    VPC
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
   Public Subnet         Private Subnet
          │                     │
          ▼                     ▼
        ALB                 Database
          │
          ▼
      ECS Tasks
```

### Public Subnet

Used for resources that need public/internet-facing connectivity.

### Private Subnet

Used for resources that should not be directly accessible from the internet.

---

# 🔐 Security Concept

A common pattern is:

```text
Internet
   │
   │ HTTP/HTTPS
   ▼
[ ALB SG ]
   │
   │ Application traffic
   ▼
[ ECS SG ]
   │
   │ Database port
   ▼
[ DB SG ]
```

Instead of opening everything to everyone, security groups can restrict traffic between specific resources.

---

# 🎯 Final Summary

The complete concept can be remembered as:

```text
VPC
│
├── Public Subnet
│    │
│    └── ALB
│         │
│         ▼
│    Target Group
│         │
│         ▼
│    ECS Service
│         │
│         ├── ECS Task
│         ├── ECS Task
│         └── ECS Task
│
└── Private Subnet
     │
     └── Database


ECR
 │
 └── Docker Images
       │
       ▼
      ECS
       │
       └── Runs Containers
```

### 💡 One-Line Revision

> **VPC provides the network, Subnets organize it, ECR stores Docker images, ECS runs containers, Tasks define running workloads, Services maintain and scale tasks, ALB distributes traffic, Target Groups identify destinations, and Security Groups control network access.**

---

## 📚 Key Abbreviations

- **VPC** → Virtual Private Cloud
- **ECR** → Elastic Container Registry
- **ECS** → Elastic Container Service
- **ALB** → Application Load Balancer
- **TG** → Target Group
- **SG** → Security Group
- **IP** → Internet Protocol
- **HTTP** → Hypertext Transfer Protocol
- **HTTPS** → Hypertext Transfer Protocol Secure

---

⭐ **AWS + Docker Deployment Flow**

```text
Dockerfile
    ↓
Docker Image
    ↓
ECR
    ↓
ECS Task Definition
    ↓
ECS Task
    ↓
ECS Service
    ↓
Target Group
    ↓
ALB
    ↓
🌍 Internet
```

> **Build → Store → Run → Scale → Route → Secure**