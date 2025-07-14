import User from "./user.model.js";
import Wallet from "../wallet/wallet.model.js"
import argon2 from "argon2";

export const getUserById = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el usuario",
      error: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(Number(desde)).limit(Number(limite)).populate("wallet"),
    ]);

    return res.status(200).json({
      success: true,
      total,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { uid } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(uid);

    const matchOldAndNewPassword = await argon2.verify(
      user.password,
      newPassword
    );

    if (matchOldAndNewPassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña no puede ser igual a la anterior",
      });
    }

    const encryptedPassword = await argon2.hash(newPassword);

    await User.findByIdAndUpdate(
      uid,
      { password: encryptedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar contraseña",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const data = { ...req.body };

    if ('dpi' in data) delete data.dpi;
    if ('password' in data) delete data.password;

    const user = await User.findByIdAndUpdate(uid, data, { new: true });

    res.status(200).json({
      success: true,
      msg: "Usuario Actualizado",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Error al actualizar usuario",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findByIdAndUpdate(
      uid,
      { status: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: "Usuario Eliminado",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error al eliminar el usuario",
      error: err.message,
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .select("historyOfSend historyOfReceive")
        .populate('historyOfSend')
        .populate('historyOfRecive')
        .select('historyOfSend historyOfRecive name userName email')
    ]);

    return res.status(200).json({
      success: true,
      total,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message,
    });
  }
};


export const addFavorite = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario no proporcionado",
      });
    }

    const { accountNumber } = req.body;
    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: "El número de cuenta es requerido",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario autenticado no encontrado en la base de datos",
      });
    }

    const favoriteUser = await Wallet.findOne({
      $or: [
        { noAccount: accountNumber },
        { savingAccount: accountNumber },
        { foreingCurrencyAccount: accountNumber }
      ]
    });
    if (!favoriteUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario con ese número de cuenta no encontrado",
      });
    }

    if (user._id.equals(favoriteUser._id)) {
      return res.status(400).json({
        success: false,
        message: "No puedes agregarte a ti mismo como favorito",
      });
    }

    const isFavorite = user.favorites.includes(favoriteUser._id);

    if (isFavorite) {
      user.favorites = user.favorites.filter(id => !id.equals(favoriteUser._id));
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Usuario eliminado de favoritos",
        favorites: user.favorites,
      });
    } else {
      user.favorites.push(favoriteUser._id);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Usuario agregado a favoritos",
        favorites: user.favorites,
      });
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al modificar favoritos",
      error: err.message,
    });
  }
};

export const getFavorites = async (req, res) => {
  try {

    const userId = req.usuario._id || req.usuario.uid

    const user = await User.findById(userId).populate('favorites', 'name userName numberAccount email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      favorites: user.favorites,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener favoritos",
      error: err.message,
    });
  }
};

export const getBalance = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid).select("wallet").populate("wallet")

    return res.status(200).json({
      success: true,
      balance: {
        noAccountBalance: user.wallet.noAccountBalance,
        savingAccountBalance: user.wallet.savingAccountBalance,
        foreingCurrencyBalance: user.wallet.foreingCurrencyBalance
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message,
    });
  }
};

export const getWallet = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid).select("wallet").populate("wallet");

    return res.status(200).json({
      success: true,
      wallet: user
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message,
    });
  }
};

export const getUsersTransaction = async (req, res) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    const sortedUsers = users.sort((a, b) => {
      const totalA = (a.historyOfSend?.length || 0) + (a.historyOfRecive?.length || 0);
      const totalB = (b.historyOfSend?.length || 0) + (b.historyOfRecive?.length || 0);
      return totalB - totalA;
    });

    return res.status(200).json({
      success: true,
      total,
      users: sortedUsers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los usuarios",
      error: err.message,
    });
  }
};
