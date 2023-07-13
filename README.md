# RPMS
This Is A School Web App

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- bcrypt (Password hashing)

## Installation

1. Clone the repository:

```ruby
git@github.com:Mensa-Philosophical-Circle/RPMS.git
```
2. Install dependencies:

```ruby
cd rpms
npm install
```
3. Set up the database:
- Create a PostgreSQL database named "rpms_database".
- Update the database configuration in .env file.

4. Run database migrations:

```ruby
node database/migrate.js
```

5. Start the server:

```ruby
npm run dev
```