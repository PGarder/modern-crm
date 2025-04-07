# Modern CRM System

A modern, feature-rich CRM system built with Node.js, Express, and MongoDB, designed to streamline sales processes and improve team productivity.

## Features

- **User Management**
  - Role-based access control (Admin, Manager, Sales)
  - Team-based organization
  - Secure authentication with JWT

- **Contact Management**
  - Comprehensive contact profiles
  - Contact history tracking
  - Notes and activity logging
  - Tag-based organization

- **Lead Management**
  - Sales pipeline tracking
  - Lead scoring and qualification
  - Activity tracking
  - Probability and value estimation

- **Task Management**
  - Activity scheduling
  - Priority-based task organization
  - Reminders and notifications
  - Task assignment and tracking

## Tech Stack

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Express Validator

## Installation

1. Clone the repository
```bash
git clone [repository-url]
cd modern-crm
```

2. Install dependencies
```bash
npm install
```

3. Create a .env file in the root directory
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development server
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Contacts
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create a new contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact
- `POST /api/contacts/:id/notes` - Add a note to a contact

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead
- `POST /api/leads/:id/activities` - Add an activity to a lead

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- Role-based access control

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 