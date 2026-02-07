# Requirements Document

## Introduction

This document specifies the requirements for integrating Jenkins and SonarQube into the existing bookshop application CI/CD workflow. The integration will provide automated continuous integration and code quality analysis for both the Spring Boot backend and Angular frontend components. The system will use Docker containers for Jenkins and SonarQube, integrate with the existing docker-compose.yml configuration, and support automated pipeline execution triggered by code commits.

## Glossary

- **Jenkins**: The continuous integration and continuous delivery automation server
- **SonarQube**: The code quality and security analysis platform
- **Pipeline**: A Jenkins automated workflow defined in a Jenkinsfile
- **Quality_Gate**: A SonarQube threshold configuration that determines if code meets quality standards
- **Backend**: The Spring Boot Java application using Maven build system
- **Frontend**: The Angular application using npm build system
- **Docker_Compose**: The tool for defining and running multi-container Docker applications
- **SonarQube_Scanner**: The tool that analyzes code and sends results to SonarQube server
- **Webhook**: An automated HTTP callback triggered by Git events
- **Jenkins_Agent**: The execution environment where Jenkins pipeline stages run
- **SonarQube_Token**: An authentication credential for Jenkins to communicate with SonarQube
- **Maven**: The build automation tool for the Java backend
- **NPM**: The package manager and build tool for the Angular frontend

## Requirements

### Requirement 1: Docker Container Infrastructure

**User Story:** As a developer, I want Jenkins and SonarQube running in Docker containers, so that I can have a consistent, isolated CI/CD environment without local Windows installation.

#### Acceptance Criteria

1. THE Docker_Compose SHALL define a Jenkins service with persistent volume storage for Jenkins home directory
2. THE Docker_Compose SHALL define a SonarQube service with persistent volume storage for data, extensions, and logs
3. THE Docker_Compose SHALL define a PostgreSQL database service for SonarQube data persistence
4. WHEN Docker_Compose starts THEN Jenkins SHALL be accessible on port 8081
5. WHEN Docker_Compose starts THEN SonarQube SHALL be accessible on port 9000
6. THE Docker_Compose SHALL connect Jenkins, SonarQube, and PostgreSQL services to the bookshop-network
7. THE Docker_Compose SHALL configure health checks for Jenkins and SonarQube services
8. THE Docker_Compose SHALL mount Docker socket to Jenkins container to enable Docker commands within pipelines

### Requirement 2: Jenkins Pipeline for Backend

**User Story:** As a developer, I want an automated Jenkins pipeline for the backend, so that code commits trigger Maven builds, tests, and SonarQube analysis automatically.

#### Acceptance Criteria

1. THE Backend SHALL include a Jenkinsfile defining the pipeline stages
2. WHEN the pipeline executes THEN Jenkins SHALL checkout the backend source code from Git
3. WHEN the checkout completes THEN Jenkins SHALL execute Maven clean and compile stages
4. WHEN compilation succeeds THEN Jenkins SHALL execute Maven test stage
5. WHEN tests complete THEN Jenkins SHALL execute SonarQube_Scanner for Maven projects
6. THE Pipeline SHALL use Maven wrapper or Maven tool configured in Jenkins
7. WHEN SonarQube analysis completes THEN Jenkins SHALL wait for Quality_Gate result
8. IF Quality_Gate fails THEN Jenkins SHALL mark the pipeline as failed
9. THE Pipeline SHALL publish test results and code coverage reports
10. WHEN any stage fails THEN Jenkins SHALL send failure notifications

### Requirement 3: Jenkins Pipeline for Frontend

**User Story:** As a developer, I want an automated Jenkins pipeline for the frontend, so that code commits trigger npm builds, tests, and SonarQube analysis automatically.

#### Acceptance Criteria

1. THE Frontend SHALL include a Jenkinsfile defining the pipeline stages
2. WHEN the pipeline executes THEN Jenkins SHALL checkout the frontend source code from Git
3. WHEN the checkout completes THEN Jenkins SHALL execute npm install to install dependencies
4. WHEN dependencies install THEN Jenkins SHALL execute npm run build
5. WHEN build succeeds THEN Jenkins SHALL execute npm test with headless browser configuration
6. WHEN tests complete THEN Jenkins SHALL execute SonarQube_Scanner for JavaScript/TypeScript projects
7. THE Pipeline SHALL use Node.js tool configured in Jenkins
8. WHEN SonarQube analysis completes THEN Jenkins SHALL wait for Quality_Gate result
9. IF Quality_Gate fails THEN Jenkins SHALL mark the pipeline as failed
10. THE Pipeline SHALL publish test results and code coverage reports
11. WHEN any stage fails THEN Jenkins SHALL send failure notifications

### Requirement 4: SonarQube Project Configuration

**User Story:** As a developer, I want SonarQube projects configured for both backend and frontend, so that code quality metrics are tracked separately for each component.

#### Acceptance Criteria

1. THE SonarQube SHALL have a project configured for the backend with project key "bookshop-backend"
2. THE SonarQube SHALL have a project configured for the frontend with project key "bookshop-frontend"
3. WHEN backend analysis runs THEN SonarQube SHALL analyze Java source files using appropriate language rules
4. WHEN frontend analysis runs THEN SonarQube SHALL analyze TypeScript and JavaScript files using appropriate language rules
5. THE Backend project SHALL configure source directories pointing to src/main/java
6. THE Frontend project SHALL configure source directories pointing to src/app
7. THE Backend project SHALL configure test directories pointing to src/test/java
8. THE Frontend project SHALL exclude node_modules and dist directories from analysis
9. THE SonarQube SHALL generate authentication tokens for Jenkins integration
10. WHEN analysis completes THEN SonarQube SHALL display code coverage, bugs, vulnerabilities, and code smells

### Requirement 5: Automated Pipeline Triggers

**User Story:** As a developer, I want pipelines to trigger automatically on code commits, so that I receive immediate feedback without manual intervention.

#### Acceptance Criteria

1. THE Jenkins SHALL configure Git polling with a schedule to check for repository changes
2. WHEN new commits are detected THEN Jenkins SHALL automatically trigger the corresponding pipeline
3. THE Jenkins SHALL support webhook configuration for immediate triggering when Git hosting supports it
4. THE Backend pipeline SHALL trigger only when changes are detected in the backend directory
5. THE Frontend pipeline SHALL trigger only when changes are detected in the frontend directory
6. WHEN multiple commits are pushed THEN Jenkins SHALL queue pipeline executions appropriately
7. THE Jenkins SHALL prevent concurrent builds of the same pipeline to avoid conflicts

### Requirement 6: Quality Gates and Reporting

**User Story:** As a developer, I want quality gates to enforce code standards, so that poor quality code is identified before merging.

#### Acceptance Criteria

1. THE SonarQube SHALL define a Quality_Gate with thresholds for code coverage, bugs, and vulnerabilities
2. WHEN code coverage falls below 80% THEN Quality_Gate SHALL fail
3. WHEN new bugs are introduced THEN Quality_Gate SHALL fail
4. WHEN new vulnerabilities are introduced THEN Quality_Gate SHALL fail
5. WHEN code smells exceed threshold THEN Quality_Gate SHALL warn but not fail
6. THE Jenkins SHALL display SonarQube analysis results in the pipeline console output
7. THE Jenkins SHALL provide links to detailed SonarQube reports
8. WHEN Quality_Gate passes THEN Jenkins SHALL mark the build as successful
9. THE SonarQube SHALL retain historical analysis data for trend tracking

### Requirement 7: Jenkins Credentials Management

**User Story:** As a developer, I want Jenkins to securely store SonarQube credentials, so that pipelines can authenticate without exposing tokens in code.

#### Acceptance Criteria

1. THE Jenkins SHALL provide a credentials store for sensitive information
2. WHEN SonarQube_Token is created THEN it SHALL be stored as a secret text credential in Jenkins
3. THE Jenkinsfile SHALL reference credentials by ID without exposing the actual token value
4. WHEN pipeline executes THEN Jenkins SHALL inject credentials as environment variables securely
5. THE Jenkins SHALL encrypt stored credentials at rest
6. THE Jenkins SHALL restrict credential access to authorized pipelines only

### Requirement 8: Windows Environment Compatibility

**User Story:** As a developer working on Windows, I want the CI/CD setup to work seamlessly on Windows, so that I can develop and test locally without platform issues.

#### Acceptance Criteria

1. THE Docker_Compose configuration SHALL use Windows-compatible volume path syntax
2. THE Jenkinsfile SHALL use shell commands compatible with the Jenkins container environment
3. WHEN running on Windows THEN Docker_Compose SHALL successfully mount volumes from Windows filesystem
4. THE Jenkins container SHALL use Unix-based shell for pipeline execution regardless of host OS
5. THE Documentation SHALL include Windows-specific setup instructions for Docker Desktop
6. WHEN Docker socket is mounted THEN it SHALL work with Docker Desktop on Windows

### Requirement 9: Pipeline Stage Organization

**User Story:** As a developer, I want clear pipeline stages, so that I can quickly identify where failures occur and understand the build process.

#### Acceptance Criteria

1. THE Backend pipeline SHALL define stages: Checkout, Build, Test, SonarQube Analysis, Quality Gate
2. THE Frontend pipeline SHALL define stages: Checkout, Install Dependencies, Build, Test, SonarQube Analysis, Quality Gate
3. WHEN viewing pipeline execution THEN Jenkins SHALL display each stage with status and duration
4. WHEN a stage fails THEN Jenkins SHALL skip subsequent stages and mark the build as failed
5. THE Pipeline SHALL display stage logs for debugging failures
6. WHEN all stages succeed THEN Jenkins SHALL mark the build as successful with green status

### Requirement 10: Setup and Usage Documentation

**User Story:** As a developer, I want comprehensive documentation, so that I can set up and use the CI/CD system without prior Jenkins or SonarQube experience.

#### Acceptance Criteria

1. THE Documentation SHALL include step-by-step instructions for initial Docker Compose setup
2. THE Documentation SHALL include instructions for accessing Jenkins initial admin password
3. THE Documentation SHALL include instructions for installing required Jenkins plugins
4. THE Documentation SHALL include instructions for configuring Jenkins tools (Maven, Node.js, SonarQube Scanner)
5. THE Documentation SHALL include instructions for creating SonarQube projects and generating tokens
6. THE Documentation SHALL include instructions for adding SonarQube token to Jenkins credentials
7. THE Documentation SHALL include instructions for creating Jenkins pipeline jobs
8. THE Documentation SHALL include instructions for configuring Git repository connections
9. THE Documentation SHALL include instructions for setting up polling or webhooks
10. THE Documentation SHALL include troubleshooting guidance for common issues
11. THE Documentation SHALL include examples of successful pipeline execution output
