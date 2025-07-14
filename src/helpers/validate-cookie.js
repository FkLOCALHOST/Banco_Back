import jwt from "jsonwebtoken";

export const validateToken = (req, res) => {
    console.log("Cookies recibidas:", req.cookies);

    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        return res.status(200).json({ message: "Token válido", userId: decoded.uid });
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};
