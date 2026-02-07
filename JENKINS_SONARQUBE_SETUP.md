# Guía de Configuración: Jenkins y SonarQube CI/CD

Esta guía te ayudará a configurar Jenkins y SonarQube para integración continua y análisis de calidad de código en la aplicación Bookshop.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Iniciar Servicios con Docker Compose](#iniciar-servicios-con-docker-compose)
3. [Configuración Inicial de Jenkins](#configuración-inicial-de-jenkins)
4. [Configuración de Herramientas en Jenkins](#configuración-de-herramientas-en-jenkins)
5. [Configuración Inicial de SonarQube](#configuración-inicial-de-sonarqube)
6. [Configurar Credenciales en Jenkins](#configurar-credenciales-en-jenkins)
7. [Crear Jobs de Pipeline en Jenkins](#crear-jobs-de-pipeline-en-jenkins)
8. [Configurar Triggers Automáticos](#configurar-triggers-automáticos)
9. [Troubleshooting](#troubleshooting)
10. [Ejemplos de Ejecución](#ejemplos-de-ejecución)

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Docker Desktop** (Windows) o **Docker Engine** (Linux)
- ✅ **Docker Compose** (incluido en Docker Desktop)
- ✅ **Git** (para clonar repositorios)
- ✅ Al menos **8GB de RAM** disponible
- ✅ Al menos **10GB de espacio en disco**

### Verificar instalación:

```cmd
docker --version
docker-compose --version
git --version
```

---

## Iniciar Servicios con Docker Compose

### 1. Iniciar todos los servicios

Desde la raíz del proyecto:

```cmd
docker-compose up -d
```

Este comando iniciará:
- Backend (Spring Boot) en puerto 8282
- Frontend (Angular) en puerto 8080
- Jenkins en puerto 8081
- SonarQube en puerto 9000
- PostgreSQL para SonarQube (interno)

### 2. Verificar que los servicios estén corriendo

```cmd
docker-compose ps
```

Deberías ver todos los servicios con estado "Up":

```
NAME                        STATUS
bookshop-angular-app        Up (healthy)
bookshop-jenkins            Up (healthy)
bookshop-sonarqube          Up (healthy)
bookshop-sonarqube-db       Up (healthy)
bookshop-springboot-app     Up (healthy)
```

### 3. Ver logs de un servicio específico

```cmd
# Ver logs de Jenkins
docker-compose logs -f jenkins

# Ver logs de SonarQube
docker-compose logs -f sonarqube
```

### 4. Detener servicios

```cmd
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡cuidado! pierdes datos)
docker-compose down -v
```


### Notas para Windows

- Docker Desktop debe estar corriendo
- Asegúrate de que Docker Desktop tenga acceso a la unidad donde está el proyecto
- Si usas WSL2, los contenedores correrán en WSL2

---

## Configuración Inicial de Jenkins

### 1. Acceder a Jenkins

Abre tu navegador y ve a: **http://localhost:8081**

### 2. Obtener la contraseña inicial de administrador

Jenkins genera una contraseña aleatoria en el primer inicio. Para obtenerla:

**⚠️ IMPORTANTE: Estos comandos se ejecutan en PowerShell o CMD de Windows, NO en el navegador.**

**Paso 1: Abre PowerShell**
- Presiona `Windows + X` y selecciona "Windows PowerShell" o "Terminal"
- O busca "PowerShell" en el menú inicio

**Paso 2: Navega a la carpeta del proyecto**
```powershell
cd D:\GitHub\bookshop-app
```
(Ajusta la ruta según donde tengas tu proyecto)

**Paso 3: Espera a que Jenkins termine de iniciar (30-60 segundos después de `docker-compose up`)**

**Paso 4: Ejecuta este comando para obtener la contraseña:**

```powershell
docker exec bookshop-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Resultado esperado:**
```
83e8d1acbe364e2c94e41d8c78c17f35
```

**Si obtienes error "No such file or directory":**
- Jenkins aún no ha terminado de iniciar
- Espera 30 segundos más y vuelve a intentar
- O verifica que Jenkins esté corriendo: `docker-compose ps`

**Paso 5: Copia la contraseña**
- Selecciona la contraseña que aparece en PowerShell
- Click derecho → Copiar (o Ctrl+C)
- Pégala en el navegador donde Jenkins te la pide

### 3. Completar el asistente de configuración

1. Pega la contraseña inicial
2. Selecciona **"Install suggested plugins"**
3. Espera a que se instalen los plugins (puede tomar 5-10 minutos)
4. Crea tu usuario administrador:
   - Username: `admin`
   - Password: (elige una contraseña segura)
   - Full name: `Admin`
   - Email: tu email
5. Confirma la URL de Jenkins: `http://localhost:8081/`
6. Click en **"Start using Jenkins"**

### 4. Instalar plugins adicionales requeridos

Ve a: **Manage Jenkins** → **Manage Plugins** → **Available plugins**

Busca e instala los siguientes plugins:

- ✅ **SonarQube Scanner** (para análisis de código)
- ✅ **NodeJS Plugin** (para builds de frontend)
- ✅ **HTML Publisher Plugin** (para reportes de coverage)
- ✅ **Pipeline** (ya debería estar instalado)
- ✅ **Git Plugin** (ya debería estar instalado)

Después de instalar, marca **"Restart Jenkins when installation is complete"**

Espera a que Jenkins se reinicie (1-2 minutos).

---

## Configuración de Herramientas en Jenkins

### 1. Acceder a configuración de herramientas

Ve a: **Manage Jenkins** → **Global Tool Configuration**

### 2. Configurar JDK

Busca la sección **JDK**:

1. Click en **"Add JDK"**
2. Nombre: `JDK-21`
3. Marca **"Install automatically"**
4. Selecciona **"Install from adoptium.net"**
5. Versión: **jdk-21.0.x+y** (la más reciente de Java 21)
6. Click en **"Save"**

### 3. Configurar Maven

Busca la sección **Maven**:

1. Click en **"Add Maven"**
2. Nombre: `Maven-3.9`
3. Marca **"Install automatically"**
4. Versión: **3.9.x** (la más reciente de 3.9)
5. Click en **"Save"**

### 4. Configurar Node.js

Busca la sección **NodeJS**:

1. Click en **"Add NodeJS"**
2. Nombre: `NodeJS-20`
3. Marca **"Install automatically"**
4. Versión: **NodeJS 20.x.x** (la más reciente LTS de Node 20)
5. Global npm packages: (dejar vacío)
6. Click en **"Save"**

### 5. Configurar SonarQube Scanner

Busca la sección **SonarQube Scanner**:

1. Click en **"Add SonarQube Scanner"**
2. Nombre: `SonarScanner`
3. Marca **"Install automatically"**
4. Versión: **SonarQube Scanner (latest)** o una versión específica como 5.0.x
5. Click en **"Save"**

---

## Configuración Inicial de SonarQube

### 1. Acceder a SonarQube

Abre tu navegador y ve a: **http://localhost:9000**

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin`

### 2. Cambiar contraseña

SonarQube te pedirá cambiar la contraseña en el primer login:

1. Ingresa la contraseña actual: `admin`
2. Nueva contraseña: (elige una contraseña segura)
3. Confirma la nueva contraseña
4. Click en **"Update"**

### 3. Crear proyecto para Backend

1. Click en **"Create Project"** → **"Manually"**
2. Project key: `bookshop-backend`
3. Display name: `Bookshop Backend`
4. Main branch name: `main` (o `master` según tu repo)
5. Click en **"Set Up"**
6. Selecciona **"Locally"**
7. Genera un token:
   - Token name: `jenkins-backend`
   - Expiration: **No expiration** (o 90 días)
   - Click en **"Generate"**
   - **⚠️ COPIA EL TOKEN** (lo necesitarás después)
   - Ejemplo: `sqp_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8`

### 4. Crear proyecto para Frontend

1. Click en **"Projects"** → **"Create Project"** → **"Manually"**
2. Project key: `bookshop-frontend`
3. Display name: `Bookshop Frontend`
4. Main branch name: `main`
5. Click en **"Set Up"**
6. Selecciona **"Locally"**
7. Puedes usar el mismo token generado anteriormente

### 5. Configurar Quality Gate (opcional pero recomendado)

1. Ve a **"Quality Gates"** en el menú superior
2. Selecciona **"Sonar way"** (el quality gate por defecto)
3. O crea uno personalizado:
   - Click en **"Create"**
   - Nombre: `Bookshop Quality Gate`
   - Agrega condiciones:
     - Coverage on New Code: **>= 80%**
     - Duplicated Lines on New Code: **<= 3%**
     - Maintainability Rating on New Code: **>= A**
     - Reliability Rating on New Code: **>= A**
     - Security Rating on New Code: **>= A**

---

## Configurar Credenciales en Jenkins

### 1. Acceder a credenciales

Ve a: **Manage Jenkins** → **Manage Credentials** → **(global)** → **Add Credentials**

### 2. Agregar token de SonarQube

1. Kind: **Secret text**
2. Scope: **Global**
3. Secret: (pega el token de SonarQube que copiaste antes)
   - Ejemplo: `sqp_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8`
4. ID: `sonarqube-token` (⚠️ **IMPORTANTE: debe ser exactamente este ID**)
5. Description: `SonarQube authentication token`
6. Click en **"Create"**

### 3. Configurar servidor SonarQube en Jenkins

Ve a: **Manage Jenkins** → **Configure System**

Busca la sección **SonarQube servers**:

1. Marca **"Enable injection of SonarQube server configuration"**
2. Click en **"Add SonarQube"**
3. Name: `SonarQube`
4. Server URL: `http://bookshop-sonarqube:9000`
5. Server authentication token: Selecciona `sonarqube-token`
6. Click en **"Save"**

---

## Crear Jobs de Pipeline en Jenkins

### 1. Crear Pipeline para Backend

1. Desde el dashboard de Jenkins, click en **"New Item"**
2. Nombre: `bookshop-backend-pipeline`
3. Tipo: **Pipeline**
4. Click en **"OK"**

**Configuración del pipeline:**

1. **General:**
   - Description: `CI/CD pipeline for Bookshop backend (Spring Boot)`

2. **Build Triggers:**
   - Marca **"Poll SCM"**
   - Schedule: `H/5 * * * *` (revisa cada 5 minutos)

3. **Pipeline:**
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: (URL de tu repositorio Git)
     - Ejemplo: `https://github.com/tu-usuario/bookshop-app.git`
     - O ruta local: `file:///d:/GitHub/bookshop-app` (Windows)
   - Credentials: (si tu repo es privado, agrega credenciales)
   - Branch: `*/main` (o `*/master`)
   - Script Path: `backend/Jenkinsfile`

4. Click en **"Save"**

### 2. Crear Pipeline para Frontend

1. Desde el dashboard, click en **"New Item"**
2. Nombre: `bookshop-frontend-pipeline`
3. Tipo: **Pipeline**
4. Click en **"OK"**

**Configuración del pipeline:**

1. **General:**
   - Description: `CI/CD pipeline for Bookshop frontend (Angular)`

2. **Build Triggers:**
   - Marca **"Poll SCM"**
   - Schedule: `H/5 * * * *`

3. **Pipeline:**
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: (misma URL que el backend)
   - Branch: `*/main`
   - Script Path: `frontend/Jenkinsfile`

4. Click en **"Save"**

### 3. Ejecutar pipelines manualmente (primera vez)

1. Ve al pipeline `bookshop-backend-pipeline`
2. Click en **"Build Now"**
3. Observa la ejecución en **"Build History"**
4. Repite para `bookshop-frontend-pipeline`

---

## Configurar Triggers Automáticos

### Opción 1: Git Polling (Ya configurado)

Los pipelines ya están configurados para revisar cambios cada 5 minutos con `H/5 * * * *`.

**Cómo funciona:**
- Jenkins revisa el repositorio cada 5 minutos
- Si detecta nuevos commits, ejecuta el pipeline automáticamente
- Solo ejecuta si hay cambios en el directorio correspondiente

### Opción 2: Webhooks (Recomendado para producción)

Si usas GitHub, GitLab o Bitbucket:

1. **En Jenkins:**
   - Edita el pipeline
   - En **Build Triggers**, marca **"GitHub hook trigger for GITScm polling"** (para GitHub)
   - O **"Build when a change is pushed to GitLab"** (para GitLab)

2. **En tu repositorio Git:**
   - Ve a Settings → Webhooks
   - Payload URL: `http://tu-servidor-jenkins:8081/github-webhook/` (GitHub)
   - Content type: `application/json`
   - Events: **Just the push event**
   - Click en **"Add webhook"**

**Nota:** Para webhooks, Jenkins debe ser accesible desde internet o tu servidor Git.

### Triggers específicos por directorio

Para que el backend solo se ejecute con cambios en `/backend` y frontend con `/frontend`:

1. Edita el pipeline
2. En **Pipeline** → **Additional Behaviours** → **Add** → **Polling ignores commits in certain paths**
3. Included Regions:
   - Backend: `backend/.*`
   - Frontend: `frontend/.*`

---

## Troubleshooting

### Problema: Jenkins no inicia

**Síntomas:** Contenedor se reinicia constantemente

**Solución:**
```cmd
# Ver logs
docker-compose logs jenkins

# Verificar memoria disponible
docker stats

# Aumentar memoria de Docker Desktop (Windows):
# Docker Desktop → Settings → Resources → Memory: 4GB o más
```

### Problema: SonarQube no inicia

**Síntomas:** Error "max virtual memory areas vm.max_map_count [65530] is too low"

**Solución en Windows (WSL2):**
```cmd
# Abrir PowerShell como administrador
wsl -d docker-desktop
sysctl -w vm.max_map_count=262144
exit
```

**Solución en Linux:**
```bash
sudo sysctl -w vm.max_map_count=262144
# Para hacerlo permanente:
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
```

### Problema: Pipeline falla en "Checkout"

**Síntomas:** Error "Failed to connect to repository"

**Solución:**
- Verifica la URL del repositorio
- Si es repositorio privado, agrega credenciales en Jenkins
- Si es ruta local en Windows, usa formato: `file:///d:/ruta/al/repo`

### Problema: Pipeline falla en "SonarQube Analysis"

**Síntomas:** Error "Unauthorized" o "Connection refused"

**Solución:**
```cmd
# Verificar que SonarQube esté corriendo
docker-compose ps sonarqube

# Verificar conectividad desde Jenkins
docker exec bookshop-jenkins curl http://bookshop-sonarqube:9000/api/system/status

# Verificar token en Jenkins
# Manage Jenkins → Manage Credentials → verificar 'sonarqube-token'
```

### Problema: Pipeline falla en "Quality Gate"

**Síntomas:** Error "Quality gate failed"

**Solución:**
- Esto es normal si el código no cumple los estándares
- Ve a SonarQube: http://localhost:9000
- Revisa el proyecto y los issues detectados
- Opciones:
  1. Corregir los issues en el código
  2. Ajustar el quality gate en SonarQube (menos estricto)

### Problema: Tests de frontend fallan

**Síntomas:** Error "ChromeHeadless not found"

**Solución:**
- El contenedor de Jenkins necesita Chrome instalado
- Alternativa: Modificar `frontend/Jenkinsfile` para usar otro navegador
- O instalar Chrome en el contenedor Jenkins (requiere Dockerfile personalizado)

### Problema: Maven no descarga dependencias

**Síntomas:** Error "Could not resolve dependencies"

**Solución:**
```cmd
# Verificar conectividad a internet desde Jenkins
docker exec bookshop-jenkins ping -c 3 repo.maven.apache.org

# Limpiar caché de Maven
docker exec bookshop-jenkins rm -rf /var/jenkins_home/.m2/repository
```

### Problema: Volúmenes de Docker ocupan mucho espacio

**Solución:**
```cmd
# Ver espacio usado
docker system df

# Limpiar volúmenes no usados
docker volume prune

# Limpiar todo (¡cuidado! pierdes datos)
docker system prune -a --volumes
```

---


## Ejemplos de Ejecución

### Ejemplo 1: Pipeline de Backend Exitoso

```
Started by user Admin
Obtained backend/Jenkinsfile from git https://github.com/usuario/bookshop-app.git
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/jenkins_home/workspace/bookshop-backend-pipeline
[Pipeline] {
[Pipeline] stage (Checkout)
[Pipeline] { (Checkout)
[Pipeline] checkout
Cloning repository https://github.com/usuario/bookshop-app.git
Commit: a1b2c3d (feat: add user authentication)
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (Build)
[Pipeline] { (Build)
[Pipeline] sh
+ mvn clean compile
[INFO] Scanning for projects...
[INFO] Building bookshop 1.0.0
[INFO] Compiling 45 source files to target/classes
[INFO] BUILD SUCCESS
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (Test)
[Pipeline] { (Test)
[Pipeline] sh
+ mvn test
[INFO] Running tests...
[INFO] Tests run: 28, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[Pipeline] junit
Recording test results
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (SonarQube Analysis)
[Pipeline] { (SonarQube Analysis)
[Pipeline] sh
+ mvn sonar:sonar -Dsonar.projectKey=bookshop-backend ...
[INFO] Analysis report uploaded in 2.5s
[INFO] ANALYSIS SUCCESSFUL
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (Quality Gate)
[Pipeline] { (Quality Gate)
[Pipeline] waitForQualityGate
Checking quality gate status...
Quality gate status: PASSED
[Pipeline] }
[Pipeline] // stage
[Pipeline] echo
Pipeline succeeded!
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
```

### Ejemplo 2: Pipeline de Frontend Exitoso

```
Started by SCM change
Obtained frontend/Jenkinsfile from git https://github.com/usuario/bookshop-app.git
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/jenkins_home/workspace/bookshop-frontend-pipeline
[Pipeline] {
[Pipeline] stage (Checkout)
[Pipeline] { (Checkout)
[Pipeline] checkout
Cloning repository...
Commit: b2c3d4e (fix: update Angular dependencies)
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (Install Dependencies)
[Pipeline] { (Install Dependencies)
[Pipeline] sh
+ npm ci
added 1523 packages in 45s
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (Build)
[Pipeline] { (Build)
[Pipeline] sh
+ npm run build
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.
Build at: 2024-01-15T10:30:45.123Z
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (Test)
[Pipeline] { (Test)
[Pipeline] sh
+ npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
Chrome Headless 120.0.0.0 (Windows 10): Executed 42 of 42 SUCCESS
Code Coverage: 85.3%
[Pipeline] publishHTML
Publishing HTML reports...
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (SonarQube Analysis)
[Pipeline] { (SonarQube Analysis)
[Pipeline] sh
+ sonar-scanner -Dsonar.projectKey=bookshop-frontend ...
INFO: Analysis report uploaded in 1.8s
INFO: ANALYSIS SUCCESSFUL
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage (Quality Gate)
[Pipeline] { (Quality Gate)
[Pipeline] waitForQualityGate
Checking quality gate status...
Quality gate status: PASSED
[Pipeline] }
[Pipeline] // stage
[Pipeline] echo
Pipeline succeeded!
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
```

### Ejemplo 3: Pipeline Fallido por Quality Gate

```
[Pipeline] stage (Quality Gate)
[Pipeline] { (Quality Gate)
[Pipeline] waitForQualityGate
Checking quality gate status...
Quality gate status: FAILED

Quality Gate Conditions:
  ✗ Coverage on New Code: 65.2% (required: >= 80%)
  ✓ Duplicated Lines: 2.1% (required: <= 3%)
  ✗ Bugs: 3 new bugs (required: 0)
  ✓ Vulnerabilities: 0 (required: 0)

See detailed report: http://localhost:9000/dashboard?id=bookshop-backend

[Pipeline] error
Quality gate failed, aborting pipeline
[Pipeline] }
[Pipeline] // stage
[Pipeline] echo
Pipeline failed!
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
ERROR: Quality gate failed
Finished: FAILURE
```

### Ejemplo 4: Resultados en SonarQube

Después de ejecutar los pipelines, en SonarQube verás:

**Dashboard del Proyecto Backend:**
```
Bookshop Backend
Last analysis: 2 minutes ago

Reliability: A (0 bugs)
Security: A (0 vulnerabilities)
Maintainability: A (12 code smells)
Coverage: 85.3%
Duplications: 1.2%

Lines of Code: 3,245
Technical Debt: 2h 15min
```

**Dashboard del Proyecto Frontend:**
```
Bookshop Frontend
Last analysis: 5 minutes ago

Reliability: A (0 bugs)
Security: A (0 vulnerabilities)
Maintainability: B (28 code smells)
Coverage: 82.7%
Duplications: 2.8%

Lines of Code: 5,678
Technical Debt: 4h 30min
```

---

## Flujo de Trabajo Completo

### Escenario: Desarrollador hace un commit

1. **Desarrollador hace cambios:**
   ```cmd
   cd backend
   # Hacer cambios en código
   git add .
   git commit -m "feat: add new endpoint"
   git push origin main
   ```

2. **Jenkins detecta cambios (después de máximo 5 minutos):**
   - Poll SCM revisa el repositorio
   - Detecta nuevo commit en `/backend`
   - Inicia `bookshop-backend-pipeline` automáticamente

3. **Pipeline se ejecuta:**
   - ✅ Checkout: Descarga código
   - ✅ Build: Compila con Maven
   - ✅ Test: Ejecuta tests unitarios
   - ✅ SonarQube Analysis: Analiza calidad
   - ⏳ Quality Gate: Espera resultado

4. **SonarQube procesa análisis:**
   - Calcula métricas de calidad
   - Evalúa quality gate
   - Retorna resultado a Jenkins

5. **Resultado:**
   - ✅ Si pasa: Pipeline SUCCESS (verde)
   - ❌ Si falla: Pipeline FAILURE (rojo)
   - 📧 Notificación al desarrollador (si está configurado)

6. **Desarrollador revisa:**
   - Ve resultado en Jenkins: http://localhost:8081
   - Ve detalles en SonarQube: http://localhost:9000
   - Corrige issues si es necesario

---

## Comandos Útiles

### Docker Compose

```cmd
# Iniciar todos los servicios
docker-compose up -d

# Iniciar solo CI/CD
docker-compose up -d jenkins sonarqube sonarqube-db

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f jenkins
docker-compose logs -f sonarqube

# Reiniciar un servicio
docker-compose restart jenkins

# Detener todos
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Jenkins

```cmd
# Ver logs de Jenkins
docker-compose logs -f jenkins

# Acceder al contenedor
docker exec -it bookshop-jenkins bash

# Ver contraseña inicial
docker exec bookshop-jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Reiniciar Jenkins
docker-compose restart jenkins
```

### SonarQube

```cmd
# Ver logs de SonarQube
docker-compose logs -f sonarqube

# Acceder al contenedor
docker exec -it bookshop-sonarqube sh

# Verificar estado
curl http://localhost:9000/api/system/status

# Ver base de datos
docker exec -it bookshop-sonarqube-db psql -U sonar -d sonar
```

### Limpieza

```cmd
# Limpiar builds antiguos de Jenkins (manual en UI)
# Manage Jenkins → Manage Old Data

# Limpiar imágenes Docker no usadas
docker image prune -a

# Limpiar volúmenes no usados
docker volume prune

# Ver espacio usado
docker system df
```

---

## Próximos Pasos

Después de completar esta configuración:

1. ✅ **Ejecuta los pipelines manualmente** para verificar que funcionan
2. ✅ **Haz un commit de prueba** para verificar triggers automáticos
3. ✅ **Revisa los reportes en SonarQube** y familiarízate con las métricas
4. ✅ **Ajusta quality gates** según las necesidades de tu equipo
5. ✅ **Configura notificaciones** (email, Slack) en Jenkins
6. ✅ **Documenta el proceso** para tu equipo

---

## Recursos Adicionales

- **Jenkins Documentation:** https://www.jenkins.io/doc/
- **SonarQube Documentation:** https://docs.sonarqube.org/
- **Docker Compose Documentation:** https://docs.docker.com/compose/
- **Pipeline Syntax Reference:** https://www.jenkins.io/doc/book/pipeline/syntax/

---

## Soporte

Si encuentras problemas:

1. Revisa la sección [Troubleshooting](#troubleshooting)
2. Verifica los logs con `docker-compose logs`
3. Consulta la documentación oficial
4. Abre un issue en el repositorio del proyecto

---

**¡Configuración completada! 🎉**

Ahora tienes un sistema completo de CI/CD con Jenkins y SonarQube para tu aplicación Bookshop.
