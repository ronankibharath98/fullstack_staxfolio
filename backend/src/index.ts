import epxress from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.routes"
import adminRoute from "./routes/admin.routes"
import productRoute from "./routes/products.routes"
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
app.use("/api/v1/stack", productRoute)

app.listen(PORT, () => {
    console.log(`Server listenening at port http://localhost:${PORT}`)
})