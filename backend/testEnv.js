import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY);
