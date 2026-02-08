# ☁️ Serverless Cloud Portfolio

This is my personal portfolio website, hosted entirely on the AWS Cloud using a Serverless architecture. It demonstrates a full-stack integration between a frontend UI and a cloud backend.

## 🚀 Live Demo
[Insert your AWS API Gateway URL here]

## 🏗️ Architecture
- **Frontend:** HTML5, CSS3, JavaScript (Embedded in Lambda for server-side rendering).
- **Backend:** AWS Lambda (Node.js) handles the routing and logic.
- **Database:** Amazon DynamoDB stores guestbook messages and visitor counts.
- **API:** AWS API Gateway triggers the Lambda function via HTTP requests.

## ✨ Features
- **Dynamic Content:** The site renders HTML dynamically based on database state.
- **Guestbook:** Visitors can sign a guestbook; data is persisted in DynamoDB.
- **Visitor Counter:** Tracks unique hits to the page.
- **Serverless:** Zero infrastructure management; scales automatically to zero when not in use.

## 🛠️ How it Works
1. User visits the API Gateway URL.
2. API Gateway triggers the Lambda function.
3. Lambda fetches the latest messages from DynamoDB.
4. Lambda constructs the HTML string and returns it to the browser.
5. When a user posts a message, a POST request is sent to the same Lambda, which updates DynamoDB and reloads the page.
