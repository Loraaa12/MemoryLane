# Memory Lane - Surprise Sharing Platform

A web application that allows users to share and discover surprises in the form of films, photos, and quotes.

## User Stories

### Core Features
1. As a user, I want to add new surprises (films, photos, quotes) so that I can share them with others.
   - I can add a film with its name, year, and a personal note
   - I can add a photo with a URL and a personal note
   - I can add a quote with its text, author, and a personal note

2. As a user, I want to view random surprises so that I can discover new content.
   - I can click a button to get a random surprise
   - I must wait 15 seconds between views to prevent spam
   - I can see all details of the surprise (name, year, note, etc.)

3. As a user, I want to navigate easily between different features so that I can use the app efficiently.
   - I can access the surprise viewer from any page
   - I can add new surprises from any page
   - I can see clear feedback for my actions

### Future Features
4. As a user, I want to create and manage my profile so that I can personalize my experience.
   - I can set up a profile with my preferences
   - I can see my history of added/viewed surprises
   - I can manage my content

5. As a user, I want to upload photos directly so that I don't need to host them elsewhere.
   - I can upload photos from my device
   - I can manage my uploaded photos
   - I can delete photos I no longer want to share

## Scalability

### Current Architecture
- Frontend: React with TypeScript
- Backend: Django REST API
- Database: SQLite (development) / PostgreSQL (production)
- Static file storage: Local filesystem

### Planned Scalability Improvements

#### 1. User Authentication & Profiles
- Implement JWT-based authentication
- Add user profiles with preferences and history
- Enable user-specific content management
- Add social features (following, sharing)

#### 2. Cloud Storage Integration
- Migrate from local storage to cloud storage (AWS S3 or similar)
- Implement CDN for faster content delivery
- Add image optimization and processing
- Enable direct uploads from frontend to cloud storage

#### 3. Database Scaling
- Migrate from SQLite to PostgreSQL
- Implement database sharding for user data
- Add caching layer (Redis) for frequently accessed data
- Optimize database queries and indexes

#### 4. Application Scaling
- Containerize application with Docker
- Implement horizontal scaling with load balancers
- Add monitoring and logging
- Implement rate limiting and caching

#### 5. Performance Optimization
- Implement lazy loading for images
- Add pagination for large datasets
- Optimize API responses
- Add service workers for offline capabilities

## Development Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- Docker (optional)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Prerequisites
- Docker and Docker Compose installed
- Git installed
- A PostgreSQL database (or use the included Docker setup)

### Environment Setup
1. Create a `.env` file in the root directory with the following variables:
```env
# Django settings
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=0

# Database settings
POSTGRES_DB=memorylane
POSTGRES_USER=memorylane
POSTGRES_PASSWORD=your-secure-password-here
DATABASE_URL=postgres://memorylane:your-secure-password-here@db:5432/memorylane
```

### Docker Deployment
1. Build and start the containers:
```bash
docker-compose up --build
```

2. Run database migrations:
```bash
docker-compose exec backend python manage.py migrate
```

3. Create a superuser (optional):
```bash
docker-compose exec backend python manage.py createsuperuser
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000/api/

### Production Deployment
For production deployment, consider:
1. Using a proper web server (e.g., Nginx) as a reverse proxy
2. Setting up SSL/TLS certificates
3. Using a managed database service
4. Implementing proper backup strategies
5. Setting up monitoring and logging
6. Using environment-specific settings

### Scaling
The application is designed to scale horizontally:
1. Frontend: Deploy multiple instances behind a load balancer
2. Backend: Use multiple Django instances with a load balancer
3. Database: Consider read replicas for heavy read operations
4. Static files: Use a CDN for better performance
5. Media files: Use cloud storage (e.g., AWS S3, Google Cloud Storage)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
MIT License 