import epxress, { Request, Response } from "express";
import userRoute from "./routes/user.route"
import staxRoute from "./routes/stax.route"
import dotenv from "dotenv"


const app = epxress();

dotenv.config();
app.use(epxress.json());

const PORT = process.env.PORT ?? 8000

app.use("/api/v1/auth", userRoute)
app.use("/api/v1/stack", staxRoute)

app.listen(PORT, () => {
    console.log(`Server listenening at port http://localhost:${PORT}`)
})