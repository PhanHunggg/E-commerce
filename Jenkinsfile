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
                   sudo docker-compose down &&
                   sudo docker-compose up -d --build
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
