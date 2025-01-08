# MultiPlayServer

>  unity client와 연동하는 nodejs 위치동기화 멀티플레이 서버

<br>

학습 목표: 처음부터 프로젝트를 세팅하여 직접 위치 동기화를 위한 멀티플레이 서버를 구현한다.

<br>

## Initial Setup

```bash
npm init -y
npm install dotenv lodash long mysql2 protobufjs uuid
npm install -D nodemon prettier
```

<br>

## File Dierctory

- assets
- clients
- README.md
- package-lock.json
- package.json
- .prettier
- src
    - classes
        - managers
        - models
    - config
    - constants
    - db
    - events
    - handlers
    - init
    - protobuf
    - session
    - utils