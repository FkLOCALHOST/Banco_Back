import { hash, verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwr.js";

export const register = async (req, res) => {
  try {
    const data = req.body;
    data.password = await hash(data.password);

    if (data.monthEarnings < 100) {
      return res.status(400).json({
        message: "User registration failed, insufficient funds",
      });
    }

    const user = await User.create(data);
    const token = await generateJWT(user.id);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User has been created",
      userDetails: {
        id: user._id,
        role: user.role,
        token: token
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "User registration failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, userName, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { userName: userName }],
    });

    if (!user) {
      return res.status(400).json({
        message: "Credenciales inválidas",
        error: "No existe el usuario o correo electrónico",
      });
    }

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Credenciales inválidas",
        error: "Contraseña incorrecta",
      });
    }

    const token = await generateJWT(user.id);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      userDetails: {
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Login failed, server error",
      error: err.message,
    });
  }
};