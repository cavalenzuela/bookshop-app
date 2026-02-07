# Implementation Plan: Jenkins-SonarQube Integration

## Overview

This implementation plan breaks down the Jenkins-SonarQube integration into discrete coding tasks. The approach follows this sequence: extend Docker Compose configuration, create Jenkinsfiles for both backend and frontend, add configuration validation tests, and create comprehensive setup documentation. Each task builds incrementally to ensure the CI/CD infrastructure is properly integrated with the existing bookshop application.

## Tasks

- [x] 1. Extend Docker Compose with CI/CD services
  - Add Jenkins service definition with persistent volume and Docker socket mount
  - Add SonarQube service definition with data, extensions, and logs volumes
  - Add PostgreSQL service for SonarQube database
  - Configure all services on bookshop-network
  - Add health checks for Jenkins and SonarQube
  - Define named volumes for data persistence
  - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7, 1.8, 8.1_

- [ ]* 1.1 Write property test for Docker Compose configuration
  - **Property 1: Docker Compose Configuration Completeness**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.6, 1.7, 1.8**

- [x] 2. Create backend Jenkinsfile
  - [x] 2.1 Create backend/Jenkinsfile with declarative pipeline structure
    - Define pipeline with agent any
    - Configure tools section (Maven-3.9, JDK-21)
    - Set up environment variables for SonarQube (using credentials)
    - _Requirements: 2.1, 2.6, 7.3, 8.2_
  
  - [x] 2.2 Implement Checkout stage
    - Add stage for checking out source code from SCM
    - _Requirements: 2.2_
  
  - [x] 2.3 Implement Build stage
    - Add stage executing Maven clean and compile in backend directory
    - Use 'sh' step for Unix shell compatibility
    - _Requirements: 2.3, 8.2_
  
  - [x] 2.4 Implement Test stage
    - Add stage executing Maven test in backend directory
    - Add post-action to publish JUnit test results
    - _Requirements: 2.4, 2.9_
  
  - [x] 2.5 Implement SonarQube Analysis stage
    - Add stage executing mvn sonar:sonar with project key and credentials
    - Configure SonarQube host URL from environment variable
    - _Requirements: 2.5_
  
  - [x] 2.6 Implement Quality Gate stage
    - Add stage with waitForQualityGate step
    - Configure timeout (5 minutes) and abortPipeline on failure
    - _Requirements: 2.7, 2.8_
  
  - [x] 2.7 Add post-build actions
    - Add post section with failure and success handlers
    - _Requirements: 2.10, 9.1_

- [ ]* 2.8 Write property test for backend Jenkinsfile structure
  - **Property 2: Backend Jenkinsfile Structure Validity**
  - **Validates: Requirements 2.1, 2.6, 2.9, 7.3, 8.2, 9.1**

- [x] 3. Create frontend Jenkinsfile
  - [x] 3.1 Create frontend/Jenkinsfile with declarative pipeline structure
    - Define pipeline with agent any
    - Configure tools section (NodeJS-20)
    - Set up environment variables for SonarQube (using credentials)
    - Define SONAR_SCANNER_HOME from tool
    - _Requirements: 3.1, 3.7, 7.3, 8.2_
  
  - [x] 3.2 Implement Checkout stage
    - Add stage for checking out source code from SCM
    - _Requirements: 3.2_
  
  - [x] 3.3 Implement Install Dependencies stage
    - Add stage executing npm ci in frontend directory
    - _Requirements: 3.3_
  
  - [x] 3.4 Implement Build stage
    - Add stage executing npm run build in frontend directory
    - _Requirements: 3.4_
  
  - [x] 3.5 Implement Test stage
    - Add stage executing npm test with headless Chrome configuration
    - Include --watch=false and --code-coverage flags
    - Add post-action to publish HTML coverage report
    - _Requirements: 3.5, 3.10_
  
  - [x] 3.6 Implement SonarQube Analysis stage
    - Add stage executing sonar-scanner with project key and configuration
    - Configure source directory, exclusions, test inclusions, and coverage path
    - _Requirements: 3.6, 4.6, 4.8_
  
  - [x] 3.7 Implement Quality Gate stage
    - Add stage with waitForQualityGate step
    - Configure timeout (5 minutes) and abortPipeline on failure
    - _Requirements: 3.8, 3.9_
  
  - [x] 3.8 Add post-build actions and concurrent build prevention
    - Add post section with failure and success handlers
    - Add options block with disableConcurrentBuilds
    - _Requirements: 3.11, 5.7, 9.2_

- [ ]* 3.9 Write property test for frontend Jenkinsfile structure
  - **Property 3: Frontend Jenkinsfile Structure Validity**
  - **Validates: Requirements 3.1, 3.7, 3.10, 7.3, 8.2, 9.2**

- [x] 4. Checkpoint - Verify configuration files
  - Ensure docker-compose.yml is valid YAML and contains all services
  - Ensure both Jenkinsfiles are valid Groovy syntax
  - Ask the user if questions arise

- [ ]* 5. Create configuration validation tests
  - [ ]* 5.1 Set up test framework for configuration validation
    - Create test directory structure
    - Install testing dependencies (pytest/jest with YAML parser)
    - _Requirements: Testing Strategy_
  
  - [ ]* 5.2 Write unit tests for Docker Compose validation
    - Test Jenkins service definition exists
    - Test SonarQube service definition exists
    - Test PostgreSQL service definition exists
    - Test volume mounts are correct
    - Test network configuration
    - Test health checks are defined
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7, 1.8_
  
  - [ ]* 5.3 Write unit tests for backend Jenkinsfile validation
    - Test all required stages are present
    - Test tools section includes Maven and JDK
    - Test credentials function is used (no hardcoded tokens)
    - Test junit publishing is configured
    - Test shell commands use 'sh' not 'bat'
    - _Requirements: 2.1, 2.6, 2.9, 7.3, 8.2, 9.1_
  
  - [ ]* 5.4 Write unit tests for frontend Jenkinsfile validation
    - Test all required stages are present
    - Test tools section includes nodejs
    - Test credentials function is used
    - Test coverage publishing is configured
    - Test headless browser configuration in test command
    - Test disableConcurrentBuilds option
    - _Requirements: 3.1, 3.7, 3.10, 7.3, 8.2, 5.7, 9.2_
  
  - [ ]* 5.5 Write property test for SonarQube configuration
    - **Property 4: SonarQube Configuration Correctness**
    - **Validates: Requirements 4.5, 4.6, 4.7, 4.8**
  
  - [ ]* 5.6 Write property test for Windows compatibility
    - **Property 5: Windows Compatibility**
    - **Validates: Requirements 8.1**
  
  - [ ]* 5.7 Write property test for concurrent build prevention
    - **Property 6: Pipeline Concurrent Build Prevention**
    - **Validates: Requirements 5.7**

- [x] 6. Create setup and usage documentation
  - [x] 6.1 Create JENKINS_SONARQUBE_SETUP.md documentation file
    - Add introduction and prerequisites section
    - _Requirements: 10.1_
  
  - [x] 6.2 Document Docker Compose setup
    - Add step-by-step instructions for starting services
    - Include commands for viewing logs and checking service health
    - Add Windows-specific notes for Docker Desktop
    - _Requirements: 10.1, 8.5_
  
  - [x] 6.3 Document Jenkins initial setup
    - Add instructions for accessing Jenkins on port 8081
    - Add instructions for retrieving initial admin password from container
    - Add list of required plugins to install
    - _Requirements: 10.2, 10.3_
  
  - [x] 6.4 Document Jenkins tools configuration
    - Add step-by-step instructions for configuring JDK-21
    - Add instructions for configuring Maven-3.9
    - Add instructions for configuring NodeJS-20
    - Add instructions for configuring SonarQube Scanner
    - _Requirements: 10.4_
  
  - [x] 6.5 Document SonarQube setup
    - Add instructions for accessing SonarQube on port 9000
    - Add instructions for initial login and password change
    - Add instructions for creating backend and frontend projects
    - Add instructions for generating authentication token
    - Add instructions for configuring quality gates
    - _Requirements: 10.5, 6.1_
  
  - [x] 6.6 Document Jenkins credentials configuration
    - Add instructions for adding SonarQube token to Jenkins credentials
    - Add instructions for setting credential ID as 'sonarqube-token'
    - _Requirements: 10.6, 7.2_
  
  - [x] 6.7 Document Jenkins pipeline job creation
    - Add instructions for creating backend pipeline job
    - Add instructions for creating frontend pipeline job
    - Add instructions for configuring SCM (Git repository URL)
    - Add instructions for setting Jenkinsfile paths
    - _Requirements: 10.7, 10.8_
  
  - [x] 6.8 Document pipeline trigger configuration
    - Add instructions for configuring Git polling schedule
    - Add instructions for webhook setup (optional)
    - Add notes about directory-specific triggering
    - _Requirements: 10.9, 5.1, 5.4, 5.5_
  
  - [x] 6.9 Add troubleshooting section
    - Document common Docker Compose issues and solutions
    - Document common Jenkins pipeline errors and fixes
    - Document SonarQube connection issues
    - Document quality gate failures and how to interpret them
    - _Requirements: 10.10_
  
  - [x] 6.10 Add example outputs and screenshots
    - Add example of successful backend pipeline execution
    - Add example of successful frontend pipeline execution
    - Add example of SonarQube analysis results
    - Add example of quality gate pass/fail
    - _Requirements: 10.11_

- [ ]* 6.11 Write property test for documentation completeness
  - **Property 7: Documentation Completeness**
  - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11**

- [x] 7. Final checkpoint - Integration verification
  - Ensure all configuration files are created and valid
  - Ensure documentation is complete and accurate
  - Ensure all tests pass (if implemented)
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Configuration validation tests help catch errors before deployment
- Property-based tests ensure configuration files meet all requirements
- Manual integration testing will be required to verify the full CI/CD workflow
- The implementation focuses on creating configuration files and documentation
- Actual Jenkins and SonarQube setup will be performed manually following the documentation
- Each Jenkinsfile task builds incrementally, adding one stage at a time
- Checkpoints ensure configuration validity before proceeding
