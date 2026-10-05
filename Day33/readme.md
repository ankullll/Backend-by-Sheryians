# 🚀 Deploy an Express.js Application on AWS ECS

This guide explains how to deploy a containerized Express.js application on **Amazon ECS** using:

- Amazon VPC
- Amazon ECR
- Amazon ECS
- ECS Task Definition
- Application Load Balancer (ALB)
- Target Group
- Security Groups
- Public Subnet

The application will be accessible through the **Load Balancer DNS name**.

---

## 🏗️ Architecture

```text
                    🌍 Internet
                         |
                         ↓
              ┌─────────────────────┐
              │  Application Load   │
              │     Balancer        │
              │      (ALB)          │
              └──────────┬──────────┘
                         |
                         ↓
              ┌─────────────────────┐
              │    Target Group     │
              │      Port 3000      │
              └──────────┬──────────┘
                         |
                         ↓
              ┌─────────────────────┐
              │     ECS Service     │
              └──────────┬──────────┘
                         |
                         ↓
              ┌─────────────────────┐
              │     ECS Task        │
              │                     │
              │  Express App        │
              │  Container : 3000   │
              └─────────────────────┘
                         |
                         ↓
                    Amazon ECR
                 Docker Image
```

---

# 1. Create a VPC

First, go to:

**AWS Console → All Services → VPC**

### Steps

1. Open **VPC**.
2. Select **VPC and more**.
3. Configure the VPC.
4. Deselect/remove the **Private Subnet** option if it is enabled.
5. Create the VPC.
6. After creation, **copy/save the VPC ID**.

Example:

```text
VPC ID:
vpc-xxxxxxxxxxxxxxxxx
```

We will use this VPC while creating the ECS service.

---

# 2. Create ECS Task Definition

Go to:

**AWS Console → ECS → Task Definitions**

Click:

```text
Create new task definition
```

### Task Definition Name

Example:

```text
hallex-task-1
```

---

## 3. Configure Task Role

For the task execution role, select:

```text
ecsTaskExecutionRole
```

This role allows ECS to perform required actions such as pulling the Docker image from ECR and sending logs to CloudWatch when configured.

---

# 4. Configure Container

Add a container.

### Container Name

```text
mainapp
```

### Image URI

Go to:

**AWS Console → ECR → Repositories**

Open your repository and copy the image URI.

Make sure you also specify the correct **image tag**.

Example:

```text
123456789012.dkr.ecr.ap-south-1.amazonaws.com/my-app:latest
```

> ⚠️ Do not use only the repository URI if your image has a specific tag. The tag identifies which image version ECS should pull.

---

# 5. Configure Port Mapping

Add the following port mapping:

| Setting | Value |
|---|---|
| Container Port | `3000` |
| Port Name | `express-app` |
| App Protocol | `HTTP` |

Example:

```text
Container Port: 3000
Port Name: express-app
App Protocol: HTTP
```

Then create the task definition.

---

# 6. Create ECS Service

After creating the task definition:

**ECS → Task Definition → Select your task → Deploy → Create Service**

### Service Name

```text
express-main-app
```

---

# 7. Configure Networking

Inside the service configuration, go to **Networking**.

### VPC

Select the VPC that you created earlier.

Example:

```text
vpc-xxxxxxxxxxxxxxxxx
```

### Subnets

Select the **Public Subnet**.

If private subnets are selected and your setup is intended to expose the application directly through a public ALB, remove them and select the required public subnet(s).

### Security Group

You can select the default security group or create a dedicated security group for the application.

For production, a dedicated security group is recommended.

---

# 8. Create Application Load Balancer

Inside the ECS service configuration, enable:

```text
Create a new load balancer
```

### Load Balancer Name

```text
hallex-ALB
```

Use:

```text
Application Load Balancer
```

---

# 9. Create Target Group

Create a target group for the ECS application.

### Target Group Name

```text
hallex-TG
```

### Port

```text
3000
```

The target group will forward traffic to the Express.js container running on port `3000`.

---

# 10. Create the ECS Service

Review all the configuration:

```text
Task Definition
        ↓
ECS Service
        ↓
VPC
        ↓
Public Subnet
        ↓
Security Group
        ↓
Application Load Balancer
        ↓
Target Group : 3000
```

Click:

```text
Create Service
```

Wait until the ECS service becomes healthy and the task shows:

```text
RUNNING
```

---

# 11. Check ECS Service

Go to:

**AWS Console → ECS → Clusters**

Open your cluster.

Then open:

```text
Services
```

Find:

```text
express-main-app
```

Check the running task.

You should see something similar to:

```text
Desired tasks: 1
Running tasks: 1
Pending tasks: 0
```

---

# 12. Check Application Load Balancer

Go to:

**AWS Console → EC2 → Load Balancers**

> AWS places Load Balancer management under the EC2 console.

Find:

```text
hallex-ALB
```

Open it.

Check:

- Load Balancer state
- Listeners
- Target groups
- Target health

The target should eventually become:

```text
Healthy
```

---

# 13. Configure Security Group

Go to:

**AWS Console → EC2 → Security Groups**

Select the security group attached to your application/load balancer.

Go to:

```text
Inbound rules → Edit inbound rules
```

Add the required rules.

### Rule 1 — HTTP

```text
Type: HTTP
Port: 80
Source: Anywhere-IPv4
```

This allows HTTP traffic from the internet to reach the Application Load Balancer.

---

### Rule 2 — Custom TCP

```text
Type: Custom TCP
Port: 3000
Source: Your Security Group
```

For the source, select the appropriate security group instead of allowing `0.0.0.0/0`.

This allows traffic on port `3000` from the specified security group.

> 🔐 **Security note:** Avoid opening port `3000` to `Anywhere-IPv4` unless you specifically need direct public access to the container. Ideally, the ALB should be publicly accessible while the ECS task only accepts traffic from the ALB's security group.

Click:

```text
Save rules
```

---

# 14. Get Load Balancer DNS Name

Go back to:

**EC2 → Load Balancers → hallex-ALB**

Find:

```text
DNS name
```

It will look similar to:

```text
hallex-alb-123456789.ap-south-1.elb.amazonaws.com
```

Copy the DNS name.

---

# 15. Test the Application

Open your browser and enter:

```text
http://<LOAD-BALANCER-DNS-NAME>
```

Example:

```text
http://hallex-alb-123456789.ap-south-1.elb.amazonaws.com
```

If everything is configured correctly, your Express.js application should be accessible.

Example response:

```text
Hello World!
```

🎉 **Your Express.js application is now running on AWS ECS behind an Application Load Balancer.**

---

# 🔄 Complete Deployment Flow

```text
Docker Image
     ↓
Amazon ECR
     ↓
ECS Task Definition
     ↓
ECS Service
     ↓
VPC
     ↓
Public Subnet
     ↓
Application Load Balancer
     ↓
Target Group
     ↓
ECS Container
     ↓
Express.js Application
```

---

# ⚙️ Configuration Summary

| Component | Configuration |
|---|---|
| VPC | Newly created VPC |
| Subnet | Public Subnet |
| ECS Task | `hallex-task-1` |
| Task Role | `ecsTaskExecutionRole` |
| Container | `mainapp` |
| Container Port | `3000` |
| Port Name | `express-app` |
| Protocol | HTTP |
| ECS Service | `express-main-app` |
| Load Balancer | `hallex-ALB` |
| Target Group | `hallex-TG` |
| Target Port | `3000` |
| Access | Load Balancer DNS |

---

# 🐛 Troubleshooting

## ECS Task is not running

Check:

- ECR image URI
- Image tag
- Task execution role
- Security groups
- Subnet configuration
- CloudWatch logs
- ECS task stopped reason

---

## Target is Unhealthy

Check:

1. Express server is actually running.
2. Application is listening on port `3000`.
3. Container port is `3000`.
4. Target group port is `3000`.
5. Security groups allow the required traffic.
6. Health-check path is correct.

For an Express application, make sure your server has a route such as:

```javascript
app.get("/", (req, res) => {
    res.send("Hello World!");
});
```

And the server listens on the correct port:

```javascript
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

# 🔐 Security Best Practices

For learning, the above setup is sufficient.

For production:

- Don't expose port `3000` publicly.
- Allow port `3000` only from the ALB security group.
- Use HTTPS instead of HTTP.
- Use a dedicated IAM role instead of unnecessarily broad permissions.
- Don't commit AWS access keys or secrets to GitHub.
- Use environment variables or AWS Secrets Manager for sensitive values.
- Use dedicated security groups instead of relying on the default security group.

---

# ✅ Final Checklist

Before testing the application, verify:

```text
☑ VPC created
☑ VPC ID saved
☑ Public subnet available
☑ ECR repository created
☑ Docker image pushed to ECR
☑ Correct image tag used
☑ ECS Task Definition created
☑ ecsTaskExecutionRole selected
☑ Container port = 3000
☑ ECS Service created
☑ Correct VPC selected
☑ Public subnet selected
☑ ALB created
☑ Target Group created
☑ Target Group port = 3000
☑ Security Groups configured
☑ ECS task status = RUNNING
☑ Target health = HEALTHY
☑ ALB DNS copied
☑ Application opens in browser
```

---

## 🎯 Result

After completing all the steps, the architecture will look like:

```text
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │   hallex-ALB   │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │   hallex-TG    │
              │     :3000      │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │ express-main-  │
              │     app        │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │    mainapp      │
              │ Express.js      │
              │    :3000        │
              └────────────────┘
```

**Result:** Your Dockerized Express.js application is deployed on **Amazon ECS** and exposed to the internet through an **Application Load Balancer**.