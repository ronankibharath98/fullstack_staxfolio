import epxress, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route"
import adminRoute from "./routes/admin.route"
import staxRoute from "./routes/stax.route"
import express from "express";
import dotenv from "dotenv"
import cors from "cors";

dotenv.config({});

const app = epxress();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
};


app.use(epxress.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors(corsOptions));

const PORT = process.env.PORT ?? 8000

app.use("/api/v1/user", userRoute)
app.use("/api/v1/admin", adminRoute)
app.use("/api/v1/stack", staxRoute)

app.listen(PORT, () => {
    console.log(`Server listenening at port http://localhost:${PORT}`)
})