// import app from './app.js'; // Import express app
// import {sequelize} from './database/database.js';

const db = require('./src/models/index');
const app = require("./src/routes/app")
const { Server } = require("socket.io");
const http = require("http");


let io; // Declare this for potential export

async function main(){ //A promise
    try{
        // await sequelize.authenticate(); //Wait for the connection to establish
        // console.log("Connection has been established successfully");
        await db.sequelize.sync({ force:false }).then(async () => {
            console.log('Database synced successfully!');
        
            // Create Triggers if they don't exist
            await db.sequelize.query(`
                CREATE PROCEDURE IF NOT EXISTS RegisterAthlete(
                    IN p_CURP VARCHAR(18),
                    IN p_name VARCHAR(255),
                    IN p_birthday DATE,
                    IN p_gender VARCHAR(100),
                    IN p_years_compiting INT,
                    IN p_city_name VARCHAR(255)
                )
                BEGIN
                    DECLARE v_city_id INT;
                    DECLARE v_current_age INT;

                    -- Start Transaction
                    START TRANSACTION;

                    -- Calculate age (difference between current date and birthday)
                    SET v_current_age = TIMESTAMPDIFF(YEAR, p_birthday, CURDATE());

                    -- Check if the city exists
                    SELECT id_city INTO v_city_id FROM city WHERE city = p_city_name LIMIT 1;

                    -- If the city does not exist, insert it
                    IF v_city_id IS NULL THEN
                        INSERT INTO city (city) VALUES (p_city_name);
                        SET v_city_id = LAST_INSERT_ID(); -- Get the newly inserted city ID
                    END IF;

                    -- Insert the user with calculated age
                    INSERT INTO athlete (CURP, name, birthday, current_age, gender,years_competing,club_id,city_id) 
                    VALUES (p_CURP, p_name, p_birthday, v_current_age, p_gender,p_years_compiting, NULL,v_city_id);

                    -- Commit the transaction
                    COMMIT;
                END;
            `);
            await db.sequelize.query(
                `
                CREATE EVENT IF NOT EXISTS UpdateUserAges
                ON SCHEDULE EVERY 1 YEAR
                STARTS TIMESTAMP(CURDATE() + INTERVAL 1 DAY) -- Start at midnight the next day
                DO
                BEGIN
                    UPDATE athlete 
                    SET current_age = TIMESTAMPDIFF(YEAR, birthday, CURDATE());
                END;
                `

            );
        });
        
        

        // Create HTTP server from Express app
        const server = http.createServer(app);

        // Attach Socket.IO to HTTP server
        io = new Server(server, {
            cors: {
                origin: "*", // Configure as needed
            },
        });

        // Setup basic connection handler
        io.on("connection", (socket) => {
            console.log("Client connected via WebSocket:", socket.id);
        });

        // Start listening
        server.listen(3000, () => {
            console.log('Server is listening on port 3000');
        });

        // OPTIONAL: Make io available globally
        // Expose io to the rest of your app if needed
        app.set("io", io); // This way you can access it in route handlers: `req.app.get("io")`


        // app.listen(3000);
        // console.log('Server is listening on port', 3000);
    }catch (error){
        console.log("Unable to connect to the database: ",error);
    }
}

main();