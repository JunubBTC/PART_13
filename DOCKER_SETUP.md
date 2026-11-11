# Docker and PostgreSQL Setup Guide

## Step 1: Start PostgreSQL Container

Open your terminal and run:

```bash
docker run -d -e POSTGRES_PASSWORD=1234 -p 5432:5432 --name part13-postgres postgres
```

**Explanation:**
- `-d` = Run in detached mode (background)
- `-e POSTGRES_PASSWORD=1234` = Set password to 1234
- `-p 5432:5432` = Map port 5432
- `--name part13-postgres` = Name the container

## Step 2: Verify Container is Running

```bash
docker ps
```

You should see `part13-postgres` in the list.

## Step 3: Connect to PostgreSQL Console

```bash
docker exec -it part13-postgres psql -U postgres postgres
```

## Step 4: Create the Database Tables

Inside the psql console, paste this SQL:

```sql
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);
```

## Step 5: Insert Sample Data (Optional)

```sql
INSERT INTO blogs (author, url, title, likes) VALUES 
    ('Dan Abramov', 'https://overreacted.io/', 'Overreacted', 10),
    ('Martin Fowler', 'https://martinfowler.com/', 'Martin Fowler Blog', 15);
```

## Step 6: Verify Data

```sql
SELECT * FROM blogs;
```

## Step 7: Exit psql

```
\q
```

## Useful psql Commands

- `\d` - List all tables
- `\d blogs` - Describe the blogs table
- `\l` - List all databases
- `\q` - Quit psql

## Container Management Commands

### Stop the container:
```bash
docker stop part13-postgres
```

### Start the container:
```bash
docker start part13-postgres
```

### Remove the container:
```bash
docker rm -f part13-postgres
```

### View container logs:
```bash
docker logs part13-postgres
```

## Alternative: Run SQL File Directly

You can also execute the SQL file directly:

```bash
docker exec -i part13-postgres psql -U postgres postgres < setup_database.sql
```

## Troubleshooting

### Port 5432 already in use?

If you get an error about port 5432 being in use, you can either:

1. **Use a different port:**
   ```bash
   docker run -d -e POSTGRES_PASSWORD=1234 -p 5433:5432 --name part13-postgres postgres
   ```
   Then update `.env` to:
   ```
   DATABASE_URL=postgres://postgres:1234@localhost:5433/postgres
   ```

2. **Stop the other PostgreSQL container:**
   ```bash
   docker ps
   docker stop <container-name>
   ```

### Connection refused?

Wait a few seconds after starting the container for PostgreSQL to fully initialize.
