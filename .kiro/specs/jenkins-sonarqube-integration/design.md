# Design Document: Jenkins-SonarQube Integration

## Overview

This design specifies the integration of Jenkins and SonarQube into the existing bookshop application CI/CD workflow. The solution uses Docker Compose to orchestrate Jenkins, SonarQube, and PostgreSQL containers alongside the existing backend and frontend services. Two separate Jenkins pipelines will automate the build, test, and code quality analysis processes for the Spring Boot backend and Angular frontend.

### Key Design Decisions

1. **Container-Based Architecture**: All CI/CD components run in Docker containers to ensure consistency across environments and avoid Windows-specific installation issues
2. **Separate Pipelines**: Backend and frontend have independent Jenkinsfiles to allow different build tools (Maven vs npm) and independent execution
3. **Shared Network**: All services connect to the existing bookshop-network for seamless communication
4. **Persistent Storage**: Jenkins and SonarQube data persist in Docker volumes to survive container restarts
5. **Quality Gate Integration**: Pipelines wait for SonarQube quality gate results before marking builds as successful

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Compose                          │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │   Jenkins    │◄────►│  SonarQube   │                   │
│  │   :8081      │      │    :9000     │                   │
│  └──────┬───────┘      └──────┬───────┘                   │
│         │                     │                            │
│         │              ┌──────▼───────┐                    │
│         │              │  PostgreSQL  │                    │
│         │              │    :5432     │                    │
│         │              └──────────────┘                    │
│         │                                                  │
│         ├──────────────┬──────────────┐                   │
│         │              │              │                    │
│  ┌──────▼───────┐ ┌───▼──────────┐ ┌─▼──────────────┐   │
│  │   Backend    │ │   Frontend   │ │  Docker Socket │   │
│  │   :8282      │ │    :8080     │ │  (mounted)     │   │
│  └──────────────┘ └──────────────┘ └────────────────┘   │
│                                                             │
│                  bookshop-network (bridge)                 │
└─────────────────────────────────────────────────────────────┘
```

### Pipeline Flow

**Backend Pipeline:**
```
Commit → Git Poll/Webhook → Jenkins Trigger
                              ↓
                         Checkout Code
                              ↓
                         Maven Clean & Compile
                              ↓
                         Maven Test
                              ↓
                         SonarQube Scan
                              ↓
                         Wait for Quality Gate
                              ↓
                         Success/Failure
```

**Frontend Pipeline:**
```
Commit → Git Poll/Webhook → Jenkins Trigger
                              ↓
                         Checkout Code
                              ↓
                         npm install
                              ↓
                         npm run build
                              ↓
                         npm test (headless)
                              ↓
                         SonarQube Scan
                              ↓
                         Wait for Quality Gate
                              ↓
                         Success/Failure
```

## Components and Interfaces

### 1. Docker Compose Configuration

**File**: `docker-compose.yml` (extended)

**New Services**:

```yaml
jenkins:
  image: jenkins/jenkins:lts
  container_name: bookshop-jenkins
  ports:
    - "8081:8080"
    - "50000:50000"
  volumes:
    - jenkins_home:/var/jenkins_home
    - /var/run/docker.sock:/var/run/docker.sock
  networks:
    - bookshop-network
  environment:
    - JAVA_OPTS=-Djenkins.install.runSetupWizard=false
  restart: unless-stopped

sonarqube:
  image: sonarqube:community
  container_name: bookshop-sonarqube
  ports:
    - "9000:9000"
  volumes:
    - sonarqube_data:/opt/sonarqube/data
    - sonarqube_extensions:/opt/sonarqube/extensions
    - sonarqube_logs:/opt/sonarqube/logs
  networks:
    - bookshop-network
  environment:
    - SONAR_JDBC_URL=jdbc:postgresql://sonarqube-db:5432/sonar
    - SONAR_JDBC_USERNAME=sonar
    - SONAR_JDBC_PASSWORD=sonar
  depends_on:
    - sonarqube-db
  restart: unless-stopped

sonarqube-db:
  image: postgres:15
  container_name: bookshop-sonarqube-db
  volumes:
    - sonarqube_db:/var/lib/postgresql/data
  networks:
    - bookshop-network
  environment:
    - POSTGRES_USER=sonar
    - POSTGRES_PASSWORD=sonar
    - POSTGRES_DB=sonar
  restart: unless-stopped

volumes:
  jenkins_home:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
  sonarqube_db:
```

**Interface**: Docker Compose CLI
- `docker-compose up -d` - Start all services
- `docker-compose down` - Stop all services
- `docker-compose logs <service>` - View service logs

### 2. Backend Jenkinsfile

**File**: `backend/Jenkinsfile`

**Pipeline Structure**:

```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven-3.9'
        jdk 'JDK-21'
    }
    
    environment {
        SONAR_TOKEN = credentials('sonarqube-token')
        SONAR_HOST_URL = 'http://bookshop-sonarqube:9000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                dir('backend') {
                    sh 'mvn clean compile'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    sh '''
                        mvn sonar:sonar \
                          -Dsonar.projectKey=bookshop-backend \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.login=${SONAR_TOKEN}
                    '''
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
    
    post {
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
```

**Interface**: Jenkins Pipeline DSL
- Declarative pipeline syntax
- Uses Jenkins credentials for SonarQube token
- Executes Maven commands in backend directory
- Publishes JUnit test results
- Waits for SonarQube quality gate

### 3. Frontend Jenkinsfile

**File**: `frontend/Jenkinsfile`

**Pipeline Structure**:

```groovy
pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20'
    }
    
    environment {
        SONAR_TOKEN = credentials('sonarqube-token')
        SONAR_HOST_URL = 'http://bookshop-sonarqube:9000'
        SONAR_SCANNER_HOME = tool 'SonarScanner'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('frontend') {
                    sh 'npm test -- --watch=false --browsers=ChromeHeadless --code-coverage'
                }
            }
            post {
                always {
                    publishHTML([
                        reportDir: 'frontend/coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                dir('frontend') {
                    sh '''
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                          -Dsonar.projectKey=bookshop-frontend \
                          -Dsonar.sources=src \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/** \
                          -Dsonar.tests=src \
                          -Dsonar.test.inclusions=**/*.spec.ts \
                          -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.login=${SONAR_TOKEN}
                    '''
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
    
    post {
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
}
```

**Interface**: Jenkins Pipeline DSL
- Declarative pipeline syntax
- Uses Node.js tool for npm commands
- Executes npm commands in frontend directory
- Runs tests with headless Chrome
- Uses SonarQube Scanner CLI for analysis
- Publishes HTML coverage reports

### 4. SonarQube Configuration

**Projects**:

1. **Backend Project**
   - Project Key: `bookshop-backend`
   - Language: Java
   - Source Directories: `src/main/java`
   - Test Directories: `src/test/java`
   - Binary Directories: `target/classes`

2. **Frontend Project**
   - Project Key: `bookshop-frontend`
   - Language: TypeScript/JavaScript
   - Source Directories: `src`
   - Test Inclusions: `**/*.spec.ts`
   - Exclusions: `**/node_modules/**`, `**/dist/**`
   - Coverage Report: `coverage/lcov.info`

**Quality Gate Configuration**:

```
Conditions:
- Coverage on New Code: >= 80%
- Duplicated Lines on New Code: <= 3%
- Maintainability Rating on New Code: >= A
- Reliability Rating on New Code: >= A
- Security Rating on New Code: >= A
- Security Hotspots Reviewed: >= 100%
```

**Interface**: SonarQube Web UI and REST API
- Web UI: http://localhost:9000
- Default credentials: admin/admin (must change on first login)
- REST API for programmatic access
- Token generation for Jenkins authentication

### 5. Jenkins Configuration

**Required Plugins**:
- Git Plugin
- Pipeline Plugin
- SonarQube Scanner Plugin
- Maven Integration Plugin
- NodeJS Plugin
- JUnit Plugin
- HTML Publisher Plugin

**Global Tool Configuration**:

1. **JDK**
   - Name: JDK-21
   - Install automatically from adoptium.net

2. **Maven**
   - Name: Maven-3.9
   - Install automatically from Apache

3. **Node.js**
   - Name: NodeJS-20
   - Install automatically

4. **SonarQube Scanner**
   - Name: SonarScanner
   - Install automatically (latest version)

**SonarQube Server Configuration**:
- Name: SonarQube
- Server URL: http://bookshop-sonarqube:9000
- Server authentication token: (stored in credentials)

**Credentials**:
- ID: `sonarqube-token`
- Type: Secret text
- Value: (generated from SonarQube)

**Pipeline Jobs**:

1. **bookshop-backend-pipeline**
   - Type: Pipeline
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: (your Git repository)
   - Script Path: backend/Jenkinsfile
   - Poll SCM: H/5 * * * * (every 5 minutes)

2. **bookshop-frontend-pipeline**
   - Type: Pipeline
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: (your Git repository)
   - Script Path: frontend/Jenkinsfile
   - Poll SCM: H/5 * * * * (every 5 minutes)

## Data Models

### Jenkins Pipeline Execution

```typescript
interface PipelineExecution {
  buildNumber: number;
  status: 'SUCCESS' | 'FAILURE' | 'ABORTED' | 'UNSTABLE';
  startTime: Date;
  duration: number; // milliseconds
  stages: Stage[];
  scmInfo: {
    branch: string;
    commit: string;
    author: string;
  };
}

interface Stage {
  name: string;
  status: 'SUCCESS' | 'FAILURE' | 'SKIPPED';
  duration: number;
  logs: string;
}
```

### SonarQube Analysis Result

```typescript
interface SonarQubeAnalysis {
  projectKey: string;
  analysisDate: Date;
  qualityGateStatus: 'PASSED' | 'FAILED' | 'NONE';
  metrics: {
    coverage: number; // percentage
    bugs: number;
    vulnerabilities: number;
    codeSmells: number;
    duplicatedLinesDensity: number;
    maintainabilityRating: 'A' | 'B' | 'C' | 'D' | 'E';
    reliabilityRating: 'A' | 'B' | 'C' | 'D' | 'E';
    securityRating: 'A' | 'B' | 'C' | 'D' | 'E';
  };
  conditions: QualityGateCondition[];
}

interface QualityGateCondition {
  metric: string;
  operator: 'GREATER_THAN' | 'LESS_THAN';
  threshold: string;
  actualValue: string;
  status: 'OK' | 'ERROR' | 'WARN';
}
```

### Docker Volume Data

```typescript
interface JenkinsVolume {
  path: '/var/jenkins_home';
  contents: {
    jobs: JobConfiguration[];
    credentials: EncryptedCredentials[];
    plugins: Plugin[];
    config: JenkinsConfiguration;
  };
}

interface SonarQubeVolume {
  dataPath: '/opt/sonarqube/data';
  extensionsPath: '/opt/sonarqube/extensions';
  logsPath: '/opt/sonarqube/logs';
  contents: {
    projects: SonarQubeProject[];
    qualityGates: QualityGate[];
    qualityProfiles: QualityProfile[];
  };
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Docker Compose Configuration Completeness

*For any* valid docker-compose.yml file in the project root, it should contain all required CI/CD service definitions (Jenkins, SonarQube, PostgreSQL) with proper volume mounts, network configuration, and health checks.

Specifically:
- Jenkins service with jenkins_home volume and Docker socket mount
- SonarQube service with data, extensions, and logs volumes
- PostgreSQL service with database volume
- All three services connected to bookshop-network
- Health checks defined for Jenkins and SonarQube

**Validates: Requirements 1.1, 1.2, 1.3, 1.6, 1.7, 1.8**

### Property 2: Backend Jenkinsfile Structure Validity

*For any* backend/Jenkinsfile in the repository, it should define a valid declarative pipeline with all required stages, proper tool configuration, secure credential handling, and Maven commands.

Specifically:
- Contains stages: Checkout, Build, Test, SonarQube Analysis, Quality Gate
- Declares Maven and JDK tools in tools section
- Uses credentials() function for SonarQube token (no hardcoded secrets)
- Contains junit test result publishing
- Uses 'sh' steps (Unix shell) not 'bat' or 'powershell'
- Maven commands execute in 'backend' directory context

**Validates: Requirements 2.1, 2.6, 2.9, 7.3, 8.2, 9.1**

### Property 3: Frontend Jenkinsfile Structure Validity

*For any* frontend/Jenkinsfile in the repository, it should define a valid declarative pipeline with all required stages, proper tool configuration, secure credential handling, and npm commands.

Specifically:
- Contains stages: Checkout, Install Dependencies, Build, Test, SonarQube Analysis, Quality Gate
- Declares nodejs tool in tools section
- Uses credentials() function for SonarQube token (no hardcoded secrets)
- Contains coverage report publishing
- Uses 'sh' steps (Unix shell) not 'bat' or 'powershell'
- npm commands execute in 'frontend' directory context
- Test command includes headless browser configuration

**Validates: Requirements 3.1, 3.7, 3.10, 7.3, 8.2, 9.2**

### Property 4: SonarQube Configuration Correctness

*For any* SonarQube scanner configuration (in Jenkinsfiles or properties files), it should specify correct project keys, source directories, test directories, and exclusion patterns for both backend and frontend projects.

Specifically:
- Backend uses project key "bookshop-backend"
- Frontend uses project key "bookshop-frontend"
- Backend configuration references src/main/java and src/test/java
- Frontend configuration references src directory
- Frontend excludes node_modules and dist directories

**Validates: Requirements 4.5, 4.6, 4.7, 4.8**

### Property 5: Windows Compatibility

*For any* Docker Compose configuration file, it should use volume syntax that is compatible with Windows (named volumes or forward-slash paths), ensuring the setup works on Windows with Docker Desktop.

Specifically:
- Uses named volumes (e.g., jenkins_home:) rather than Windows-style paths
- Or uses forward slashes in paths
- No backslashes in volume paths

**Validates: Requirements 8.1**

### Property 6: Pipeline Concurrent Build Prevention

*For any* Jenkinsfile (backend or frontend), if it contains pipeline options, it should include configuration to prevent concurrent builds to avoid resource conflicts.

Specifically:
- Contains options block with disableConcurrentBuilds() or similar

**Validates: Requirements 5.7**

### Property 7: Documentation Completeness

*For any* setup documentation file (README or SETUP guide), it should contain all required sections covering Docker Compose setup, Jenkins configuration, SonarQube configuration, pipeline job creation, Git integration, and troubleshooting.

Specifically:
- Docker Compose startup instructions
- Jenkins initial admin password retrieval
- Required Jenkins plugins list
- Jenkins tools configuration (Maven, Node.js, SonarQube Scanner)
- SonarQube project creation and token generation
- Jenkins credentials setup
- Pipeline job creation steps
- Git repository configuration
- Polling/webhook setup
- Troubleshooting section
- Example pipeline output

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11**

## Error Handling

### Docker Compose Errors

**Container Startup Failures**:
- **Cause**: Port conflicts, insufficient resources, image pull failures
- **Handling**: Docker Compose will display error messages; check logs with `docker-compose logs <service>`
- **Recovery**: Stop conflicting services, free up resources, check network connectivity

**Volume Mount Failures**:
- **Cause**: Permission issues, invalid paths on Windows
- **Handling**: Use named volumes instead of bind mounts; ensure Docker Desktop has file sharing enabled
- **Recovery**: Recreate volumes, check Docker Desktop settings

**Network Connectivity Issues**:
- **Cause**: Services cannot communicate on bookshop-network
- **Handling**: Verify all services are on the same network; check firewall rules
- **Recovery**: Recreate network with `docker network rm` and `docker-compose up`

### Jenkins Pipeline Errors

**Build Failures**:
- **Cause**: Compilation errors, test failures, missing dependencies
- **Handling**: Pipeline marks stage as failed; displays error in console output
- **Recovery**: Fix code issues; check dependency versions; review test failures

**SonarQube Connection Failures**:
- **Cause**: SonarQube not running, incorrect URL, invalid token
- **Handling**: Pipeline fails at SonarQube Analysis stage with connection error
- **Recovery**: Verify SonarQube is running; check SONAR_HOST_URL; regenerate token

**Quality Gate Failures**:
- **Cause**: Code quality below thresholds
- **Handling**: Pipeline fails at Quality Gate stage; provides link to SonarQube report
- **Recovery**: Review SonarQube report; fix identified issues; adjust quality gate if thresholds are too strict

**Credential Errors**:
- **Cause**: Missing or invalid credentials
- **Handling**: Pipeline fails with "credentials not found" error
- **Recovery**: Add credentials in Jenkins with correct ID; verify token is valid

**Tool Configuration Errors**:
- **Cause**: Maven, Node.js, or SonarQube Scanner not configured
- **Handling**: Pipeline fails with "tool not found" error
- **Recovery**: Configure tools in Jenkins Global Tool Configuration

### SonarQube Errors

**Analysis Failures**:
- **Cause**: Invalid project configuration, unsupported file types, scanner errors
- **Handling**: Scanner exits with error code; Jenkins pipeline fails
- **Recovery**: Check scanner logs; verify project configuration; ensure source paths are correct

**Database Connection Failures**:
- **Cause**: PostgreSQL not running, incorrect credentials
- **Handling**: SonarQube fails to start; displays database error in logs
- **Recovery**: Verify PostgreSQL is running; check SONAR_JDBC_URL and credentials

**Quality Gate Timeout**:
- **Cause**: SonarQube processing takes too long
- **Handling**: Jenkins pipeline times out after 5 minutes
- **Recovery**: Increase timeout in Jenkinsfile; check SonarQube performance

### Git Integration Errors

**Polling Failures**:
- **Cause**: Invalid repository URL, authentication failures, network issues
- **Handling**: Jenkins logs polling errors; pipelines don't trigger
- **Recovery**: Verify repository URL; add Git credentials; check network connectivity

**Webhook Failures**:
- **Cause**: Jenkins not accessible from Git server, invalid webhook URL
- **Handling**: Webhooks fail silently; pipelines don't trigger
- **Recovery**: Ensure Jenkins is publicly accessible or use polling; verify webhook URL

## Testing Strategy

### Overview

This feature requires a dual testing approach combining unit tests for configuration validation and integration tests for end-to-end workflow verification. Due to the infrastructure nature of this feature, many tests will validate configuration files and documentation rather than executable code.

### Unit Testing

Unit tests will focus on validating the structure and content of configuration files and documentation:

**Configuration File Validation**:
- Parse docker-compose.yml and verify service definitions
- Parse Jenkinsfiles and verify pipeline structure
- Validate SonarQube configuration parameters
- Check for security issues (hardcoded credentials, insecure configurations)

**Documentation Validation**:
- Verify all required sections are present
- Check for broken links or references
- Validate code examples and commands

**Test Framework**: Use language-appropriate testing frameworks
- Python: pytest with PyYAML for YAML parsing
- JavaScript/TypeScript: Jest with js-yaml
- Or shell scripts with yq/jq for YAML/JSON parsing

**Example Unit Tests**:
- Test: docker-compose.yml contains Jenkins service
- Test: backend/Jenkinsfile contains all required stages
- Test: frontend/Jenkinsfile uses credentials() function
- Test: Documentation includes SonarQube setup section

### Property-Based Testing

Property-based tests will validate universal properties across configuration variations:

**Test Library**: Use fast-check (JavaScript/TypeScript) or Hypothesis (Python)

**Configuration**: Minimum 100 iterations per property test

**Property Test Examples**:

1. **Property 1: Docker Compose Configuration Completeness**
   - Generate variations of docker-compose.yml
   - Verify all required services, volumes, and networks are present
   - Tag: **Feature: jenkins-sonarqube-integration, Property 1: Docker Compose Configuration Completeness**

2. **Property 2: Backend Jenkinsfile Structure Validity**
   - Parse backend/Jenkinsfile
   - Verify all required stages and tool declarations
   - Verify no hardcoded credentials
   - Tag: **Feature: jenkins-sonarqube-integration, Property 2: Backend Jenkinsfile Structure Validity**

3. **Property 3: Frontend Jenkinsfile Structure Validity**
   - Parse frontend/Jenkinsfile
   - Verify all required stages and tool declarations
   - Verify headless browser configuration
   - Tag: **Feature: jenkins-sonarqube-integration, Property 3: Frontend Jenkinsfile Structure Validity**

4. **Property 4: SonarQube Configuration Correctness**
   - Extract SonarQube configuration from Jenkinsfiles
   - Verify project keys, source paths, and exclusions
   - Tag: **Feature: jenkins-sonarqube-integration, Property 4: SonarQube Configuration Correctness**

5. **Property 5: Windows Compatibility**
   - Parse docker-compose.yml volume definitions
   - Verify no Windows-incompatible path syntax
   - Tag: **Feature: jenkins-sonarqube-integration, Property 5: Windows Compatibility**

6. **Property 6: Pipeline Concurrent Build Prevention**
   - Parse Jenkinsfiles for options block
   - Verify disableConcurrentBuilds is configured
   - Tag: **Feature: jenkins-sonarqube-integration, Property 6: Pipeline Concurrent Build Prevention**

7. **Property 7: Documentation Completeness**
   - Parse documentation file
   - Verify all required sections are present
   - Tag: **Feature: jenkins-sonarqube-integration, Property 7: Documentation Completeness**

### Integration Testing

Integration tests will verify the actual CI/CD workflow execution:

**Manual Integration Tests** (not automated in this phase):
- Start Docker Compose and verify all services are healthy
- Access Jenkins and SonarQube web interfaces
- Configure Jenkins tools and credentials
- Create pipeline jobs and trigger builds
- Verify SonarQube receives analysis results
- Verify quality gates work correctly
- Test Git polling triggers pipelines
- Verify pipeline failures are handled correctly

**Automated Integration Tests** (future enhancement):
- Use Testcontainers to spin up Jenkins and SonarQube
- Execute pipelines programmatically
- Verify analysis results via SonarQube API
- Test quality gate pass/fail scenarios

### Test Coverage Goals

- **Configuration Files**: 100% of required elements validated
- **Jenkinsfiles**: 100% of required stages and configurations validated
- **Documentation**: 100% of required sections validated
- **Integration Workflows**: Manual verification of all critical paths

### Testing Limitations

Due to the infrastructure nature of this feature:
- Many requirements involve runtime behavior of Jenkins and SonarQube (not testable via unit tests)
- Integration tests require actual Docker containers and external services
- Some tests require manual verification (UI behavior, webhook configuration)
- Property-based tests focus on configuration structure rather than runtime behavior

The testing strategy prioritizes validating what we create (configuration files, Jenkinsfiles, documentation) while acknowledging that full workflow testing requires manual integration testing or future automation with tools like Testcontainers.
