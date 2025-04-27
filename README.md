# Pear Paradise

A web application about pears with intentional security vulnerabilities for testing purposes. This application is designed for security testing and educational purposes only.

**⚠️ WARNING: This application contains deliberate security vulnerabilities. DO NOT deploy it in a production environment or on a public server. Use only in isolated testing environments.**

## About

Pear Paradise is a simple web application that showcases different types of pears. It includes user authentication, a search feature, profile management, and an admin panel. The application is intentionally vulnerable to several types of attacks to help test vulnerability detection and fixing tools.

## Installation

### Prerequisites
- Node.js (v14+)
- npm

### Setup

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/pear-paradise.git
   cd pear-paradise
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create an `uploads` directory:
   ```
   mkdir uploads
   ```

4. Set up sample images:
   - Create a `public/images` directory
   - Add the following image files to this directory:
     - pear-logo.png
     - pear-hero.jpg
     - bartlett.jpg
     - anjou.jpg
     - bosc.jpg
     - comice.jpg
     - seckel.jpg

5. Start the application:
   ```
   npm start
   ```

6. Access the application in your browser:
   ```
   http://localhost:3000
   ```

## Application Features

- View different types of pears
- Search for pears by name, origin, or description
- User authentication (login/logout)
- User profiles
- Admin panel (for admin users)
- Contact form
- Image upload functionality

## User Credentials

The application has three predefined users:

1. Admin User:
   - Username: `admin`
   - Password: `pearadmin123`

2. Regular Users:
   - Username: `user1`
   - Password: `password123`
   
   - Username: `user2`
   - Password: `pearfan456`

## Fixing Vulnerabilities

This application is designed for testing vulnerability detection and fixing tools. The goal is for your tool to identify the vulnerabilities and suggest or implement fixes.

## Using This App for Testing

This application is ideal for:
- Testing various vulnerability detection tools
- Practicing manual penetration testing
- Demonstrating the impact of web application vulnerabilities
- Testing automated vulnerability fixing tools
- Educational purposes in cybersecurity courses
