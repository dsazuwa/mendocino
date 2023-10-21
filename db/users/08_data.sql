DO $$
DECLARE
  names text[] := ARRAY ['James', 'Jack', 'Jackson', 'John', 'Joe', 'Joseph', 'Jacob', 'Julian', 'Jayden', 'Josiah', 'Jonathan', 'Jameson', 'Jose', 'Jeremiah', 'Jace', 'Josephine', 'Jaxson', 'Jasper', 'Jade', 'Jonah', 'Juan', 'Jason', 'Julia', 'Juniper', 'Jayce', 'Jude', 'Josie', 'Judah', 'Justin', 'Jesse', 'Jett', 'Joel', 'June', 'Juliette', 'Jasmine', 'Journee', 'Javier', 'Jeremy', 'Jordyn', 'Juliana', 'Jax', 'Jorge', 'Jensen', 'Josue', 'Jaylen', 'Journey', 'Jane', 'Jaden', 'Juliet', 'Jocelyn', 'Joanna', 'Julianna', 'Jayla', 'Julius', 'Jay', 'Jared', 'Jamie', 'Johnny', 'Jaziel', 'Jake', 'Julietta', 'Joy', 'Jaiden', 'Jeffrey', 'Jasiah', 'Jaxton', 'Jolene', 'Justice', 'Jimena', 'Jennifer', 'Jacqueline', 'Jessica', 'Jamari', 'Jaz', 'Jalen', 'Jamir', 'Jase', 'Julio', 'Jayson', 'Jessie', 'Jonas', 'Jaime', 'Jamison', 'Johan', 'Jayleen', 'Jaliyah', 'Journi', 'Jenesis', 'Jenna', 'Janelle', 'Julien', 'Jazmin', 'Joey', 'Jemma', 'Julie', 'Jovie', 'Jakari', 'Joelle', 'Jaylin', 'Joan', 'Jolie', 'Johanna', 'Jaxxon', 'Jerry', 'Jayda', 'Jada', 'Jagger'];
  first_name text;
  email text;
  email_id_var INTEGER;
  customer_id_var INTEGER;
BEGIN
  FOREACH first_name IN ARRAY names LOOP
    email := LOWER(first_name || 'doe@gmail.com');

    INSERT INTO users.emails ("email_id", "email", "created_at")
    VALUES (DEFAULT, email, '2023-01-01 00:00:00')
    RETURNING "email_id" INTO email_id_var;

    INSERT INTO users.customers ("customer_id", "first_name", "last_name", "status", "created_at", "updated_at")
    VALUES (DEFAULT, first_name, 'Doe', 'active', '2023-01-01 00:00:00', '2023-01-01 00:00:00')
    RETURNING "customer_id" INTO customer_id_var;

    INSERT INTO users.customer_emails ("customer_id", "email_id", "created_at")
    VALUES (customer_id_var, email_id_var, '2023-01-01 00:00:00');

    INSERT INTO users.customer_passwords ("customer_id", "password", "created_at", "updated_at" )
    VALUES (customer_id_var, '$2a$10$jMi7MIm2ahA/Om/EpztbDexrMSFizl.dmJjDv1OpvU2sWPOWyfeoC', '2023-01-01 00:00:00', '2023-01-01 00:00:00');
  END LOOP;
END $$;