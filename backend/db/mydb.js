import mysql from "mysql2";

const myConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Fdelivery"
});

myConnection.connect((error) => {
    if (error) {
        console.error("MYSQL CONNECTION ERROR:", error);
    } else {
        console.log("Connected to MySQL");
    }
});

export default myConnection;
