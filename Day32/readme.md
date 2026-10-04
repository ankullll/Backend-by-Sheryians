# 🚀 Docker Image → Amazon ECR → Amazon ECS

A beginner-friendly guide to upload a Docker image to **Amazon ECR** and prepare it for running on **Amazon ECS**.

---

## 🏗️ Complete Flow

```text
                  👨‍💻 Local Machine
                        │
                        │ Docker Build
                        ▼
                  🐳 Docker Image
                        │
                        │ docker push
                        ▼
                📦 Amazon ECR
                ┌───────────────┐
                │ Docker Image  │
                │ nebulla:latest│
                └───────┬───────┘
                        │
                        │ ECS pulls image
                        ▼
                  🚀 Amazon ECS
                        │
                        ▼
                  ECS Task/Service
                        │
                        ▼
                    Container
```

> **ECR stores the Docker image. ECS pulls that image and runs the container.**

---

# 1. 🔐 Create IAM User & Permissions

Before using AWS CLI from your local machine, create/configure an IAM identity with the required permissions.

Go to:

```text
AWS Console
   ↓
IAM
   ↓
Users
```

Create/select your user and add the required permissions.

### Permissions used for this learning setup

- AmazonEC2ContainerRegistryFullAccess
- AmazonEC2FullAccess
- AmazonECSFullAccess

### ⚠️ Security Note

For learning, broad AWS-managed policies may be convenient.

For production environments, follow the **principle of least privilege** and grant only the permissions actually required.

---

# 2. 📦 Create an ECR Repository

Go to:

```text
AWS Console
   ↓
All Services
   ↓
Elastic Container Registry (ECR)
   ↓
Repositories
   ↓
Create repository
```

Give your repository a name.

Example:

```text
nebulla
```

Your repository will look something like:

```text
ECR
└── nebulla
      └── Images
```

---

# 3. 💻 Install AWS CLI

Install the **AWS Command Line Interface (AWS CLI)** on your local machine.

After installation, verify it:

```bash
aws --version
```

If AWS CLI is installed correctly, you should see its version information.

---

# 4. 🔑 Create AWS Access Keys

Go to:

```text
AWS Console
   ↓
IAM
   ↓
Users
   ↓
Your User
   ↓
Security credentials
   ↓
Access keys
   ↓
Create access key
```

You will receive:

```text
Access Key ID
Secret Access Key
```

### ⚠️ IMPORTANT

Never share your:

- Access Key ID
- Secret Access Key
- `.env` credentials
- AWS credentials

Never upload them to GitHub.

---

# 5. ⚙️ Configure AWS CLI

Open your terminal and run:

```bash
aws configure
```

AWS CLI will ask for:

```text
AWS Access Key ID:
AWS Secret Access Key:
Default region name:
Default output format:
```

Example:

```text
AWS Access Key ID:     ****************
AWS Secret Access Key: ****************
Default region name:   ap-south-1
Default output format: json
```

For India, a common region is:

```text
ap-south-1
```

> You can choose whichever AWS region you are actually using.

### Verify configuration

```bash
aws sts get-caller-identity
```

If everything is configured correctly, AWS will return information about the authenticated identity.

---

# 6. 🚀 Create an ECS Cluster

Now go to:

```text
AWS Console
   ↓
ECS
   ↓
Clusters
   ↓
Create cluster
```

Give your cluster a name.

Example:

```text
nebulla-cluster
```

The ECS cluster will act as a logical grouping for your ECS workloads.

---

# 7. 🖥️ Build Docker Image for Linux AMD64

If your local machine uses a different architecture, such as ARM64, while your ECS runtime expects AMD64, build the image specifically for:

```text
linux/amd64
```

This is especially important when building on machines such as Apple Silicon Macs or other ARM-based systems.

---

# 8. 🛠️ Create a Docker Buildx Builder

Run:

```bash
docker buildx create --use
```

Docker will create a Buildx builder and may return a generated builder name.

Example:

```text
sharp_mclean
```

---

# 9. 🔍 Verify Buildx Builder

Run:

```bash
docker buildx ls
```

You should see your builder listed.

Example:

```text
NAME/NODE       DRIVER/ENDPOINT     STATUS
sharp_mclean    docker-container    running
```

---

# 10. 🐳 Build the Docker Image

Build your image specifically for Linux AMD64:

```bash
docker buildx build --platform linux/amd64 -t nebulla:latest . --load
```

### Understanding the command

```text
docker buildx build
        │
        ├── --platform linux/amd64
        │       → Build for AMD64 architecture
        │
        ├── -t nebulla:latest
        │       → Image name + tag
        │
        ├── .
        │       → Current directory
        │
        └── --load
                → Load image into local Docker image store
```

### Why `--load`?

Without `--load`, a Buildx build may not place the resulting image into your local Docker image store.

Since we need to run commands such as:

```bash
docker tag
docker push
```

against the locally available image, using:

```bash
--load
```

is useful for this workflow.

---

# 11. 📋 Get ECR Push Commands

Now open:

```text
AWS Console
   ↓
ECR
   ↓
Repositories
   ↓
nebulla
   ↓
View push commands
```

AWS will show commands similar to:

```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com
```

Then AWS will provide commands for:

```text
1. Authenticate Docker
2. Build Docker image
3. Tag Docker image
4. Push Docker image
```

---

# 12. ⏭️ Skip the Build Command

Since we already created our image using:

```bash
docker buildx build --platform linux/amd64 -t nebulla:latest . --load
```

you don't need to run the ECR-provided **build command** again.

Instead, use the relevant:

### 1️⃣ Login command

```bash
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
```

### 2️⃣ Tag command

Example:

```bash
docker tag nebulla:latest <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/nebulla:latest
```

### 3️⃣ Push command

```bash
docker push <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/nebulla:latest
```

---

# 13. 📤 Push Image to ECR

The final flow is:

```text
Local Docker Image
       │
       │ docker tag
       ▼
ECR Repository Tag
       │
       │ docker push
       ▼
Amazon ECR
```

After successful execution, you should see output similar to:

```text
latest: digest: sha256:xxxxxxxx
```

This means your Docker image has been pushed successfully.

---

# 14. 🔍 Verify Image in ECR

Go to:

```text
AWS Console
   ↓
ECR
   ↓
Repositories
   ↓
nebulla
   ↓
Images
```

You should see:

```text
Image Tag
──────────────
latest
```

🎉 Your Docker image is now stored in Amazon ECR.

---

# 🧠 Important: ECR vs ECS

A common beginner confusion is:

> "Image ECR mein upload karne se ECS mein upload ho gayi?"

❌ Not exactly.

The correct flow is:

```text
              ECR
        ┌──────────────┐
        │ Docker Image │
        │ nebulla:latest
        └──────┬───────┘
               │
               │ ECS pulls
               ▼
              ECS
               │
               ▼
          Docker Container
```

### ECR

**Stores** the Docker image.

### ECS

**Runs** the Docker container using the image stored in ECR.

---

# 📊 Complete Step-by-Step Flow

```text
STEP 1
Create IAM User
      │
      ▼
Add Required Permissions
      │
      ▼
STEP 2
Create ECR Repository
      │
      ▼
STEP 3
Install AWS CLI
      │
      ▼
STEP 4
Create Access Key
      │
      ▼
STEP 5
aws configure
      │
      ▼
STEP 6
Create ECS Cluster
      │
      ▼
STEP 7
Create Buildx Builder
      │
      ▼
docker buildx create --use
      │
      ▼
STEP 8
Check Builder
      │
      ▼
docker buildx ls
      │
      ▼
STEP 9
Build AMD64 Image
      │
      ▼
docker buildx build \
--platform linux/amd64 \
-t nebulla:latest . \
--load
      │
      ▼
STEP 10
ECR → Repository → View Push Commands
      │
      ▼
STEP 11
Docker Login
      │
      ▼
STEP 12
Docker Tag
      │
      ▼
STEP 13
Docker Push
      │
      ▼
📦 IMAGE STORED IN ECR
      │
      ▼
🚀 ECS CAN PULL & RUN IT
```

---

# 📝 Commands Cheat Sheet

### Check Docker

```bash
docker --version
```

### Check AWS CLI

```bash
aws --version
```

### Configure AWS

```bash
aws configure
```

### Verify AWS identity

```bash
aws sts get-caller-identity
```

### Create Buildx builder

```bash
docker buildx create --use
```

### Check Buildx

```bash
docker buildx ls
```

### Build AMD64 image

```bash
docker buildx build --platform linux/amd64 -t nebulla:latest . --load
```

### Login to ECR

```bash
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ECR_REGISTRY>
```

### Tag image

```bash
docker tag nebulla:latest <ECR_REGISTRY>/nebulla:latest
```

### Push image

```bash
docker push <ECR_REGISTRY>/nebulla:latest
```

---

# ⚠️ Common Mistakes

### ❌ Mistake 1 — Wrong architecture

Building:

```bash
docker build -t nebulla .
```

may create an image for your local architecture.

If your ECS environment requires AMD64, use:

```bash
docker buildx build --platform linux/amd64 -t nebulla:latest . --load
```

---

### ❌ Mistake 2 — Forgetting `--load`

If you need the built image in your local Docker image store, use:

```bash
--load
```

---

### ❌ Mistake 3 — Wrong AWS Region

Make sure the region used in:

```bash
aws configure
```

matches the region where your ECR repository exists.

Example:

```text
ap-south-1
```

---

### ❌ Mistake 4 — Wrong image tag

Before pushing, check:

```bash
docker images
```

You should have:

```text
nebulla    latest
```

---

### ❌ Mistake 5 — Exposing AWS credentials

Never put AWS credentials inside:

```text
GitHub
Dockerfile
.env committed to Git
README.md
```

If credentials are accidentally exposed, rotate/revoke them immediately.

---

# 💡 Quick Revision

Remember this simple formula:

```text
IAM
 ↓
AWS CLI
 ↓
ECR Repository
 ↓
Docker Build
 ↓
Docker Login
 ↓
Docker Tag
 ↓
Docker Push
 ↓
📦 ECR
 ↓
ECS pulls image
 ↓
🚀 Container runs
```

## 🎯 One-Line Summary

> **IAM gives permission → AWS CLI authenticates you → ECR stores the Docker image → ECS pulls the image → ECS runs the container.**

---

## 🚀 Next Step

After successfully pushing the image to ECR, the next major steps are:

```text
ECR Image
    ↓
ECS Task Definition
    ↓
ECS Service
    ↓
Target Group
    ↓
Application Load Balancer
    ↓
🌍 Public Application
```

This is where your Docker image actually becomes a **running, accessible application on AWS**.