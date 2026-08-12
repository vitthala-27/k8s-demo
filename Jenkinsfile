pipeline {
    agent any

    environment {
        IMAGE = "vitthalgole/k8s-demo"
    }

     stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Unit Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE}:${BUILD_NUMBER} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh """
                        echo \$DOCKER_PASS | docker login \
                        -u \$DOCKER_USER \
                        --password-stdin

                        docker push ${IMAGE}:${BUILD_NUMBER}
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig(
                    credentialsId: 'kubernetes-config'
                ) {
                    sh """
                        kubectl set image deployment/backend \
                        backend=${IMAGE}:${BUILD_NUMBER} \
                        -n demo
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withKubeConfig(
                    credentialsId: 'kubernetes-config'
                ) {
                    sh """
                        kubectl rollout status deployment/backend -n demo
                    """
                }
            }
        }
    }
}