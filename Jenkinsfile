pipeline {
    agent any

    environment {
        BRANCH = 'master'  // Đặt giá trị cho biến BRANCH
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                sh '''
                    git pull origin ${BRANCH} &&
                    docker-compose down &&
                    docker-compose up -d --build
                '''
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
