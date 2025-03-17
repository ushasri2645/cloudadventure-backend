# Cloud Adventure Backend Service

This backend service handles user account creation, avatar uploads to Amazon S3, and user data storage in DynamoDB. The service is designed for high scalability and decouples image processing from core operations.

## Features
* User creation with first name, last name, and profile picture.
* Avatar upload to Amazon S3.
* User details stored in DynamoDB.

## Tech Stack

* **Backend**: Node.js with Express.js 
* **Database**: AWS DynamoDB
* **Storage**: AWS S3
* **Resizing Service**: AWS Lambda 

## Architecture

* User submits first name, last name, and avatar.
* Backend uploads avatar to S3 (raw storage).
* User details are stored in DynamoDB with S3 avatar reference.
* An event is triggered to resize the image using AWS Lambda.
* Resized image is stored in another S3 bucket.

## Setup Instructions

### Prerequisites

* AWS Account with configured credentials
* Node.js installed
* AWS SDK installed (npm install aws-sdk)

### Installation

#### Clone the repository
```
git clone https://github.com/ushasri2645/cloudadventure-backend.git
cd cloudadventure-backend
```

#### Install dependencies
```
npm install
```

#### Environment Variables

Create a .env file and add the following:

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
S3_BUCKET_NAME=your-bucket-name
S3_RESIZED_BUCKET_NAME=your-resized-bucket-name
DYNAMODB_TABLE_NAME=UsersTable
```



#### Running the Application
```
npm start
```