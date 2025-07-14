import { hash, verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwr.js";

export const register = async (req, res) => {
  try {
    const data = req.body;

    const encryptedPass = await hash(data.password);
    data.password = encryptedPass;
    if (data.monthEarnings < 100) {
      return res.status(400).json({
        message: "User registration failed, insufficient funds",
      });
    }

    const user = await User.create(data);
    const token = await generateJWT(user.id);

    res.cookie(
      "auth",
      { token, role: user.role },
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      }
    );

    return res.status(201).json({
      message: "User has been created",
      userDetails: {
        id: user._id,
        token: token,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "user registration failed",
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
        error: "no existe el usuario o crreo electrónico",
      });
    }

    const validPassword = await verify(user.password, password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Credenciale inválidas",
        error: "Contraseña incorrecta",
      });
    }

    const token = await generateJWT(user.id);

    const userData = {
      id: user._id,
      userName: user.userName,
      token: token,
    };

    res.cookie("User", JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login succeful",
      userDetails: {
        id: user._id,
        token: token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "login failed, server Error",
      error: err.message,
    });
  }
};

