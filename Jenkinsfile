pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"
        CONTAINER_NAME = "frontend-container"
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/krifthagram/frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 3000:3000 \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Build failed. Check logs above.'
        }
    }
}