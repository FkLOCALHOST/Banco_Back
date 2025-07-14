import Service from "./service.model.js";
import User from "../user/user.model.js";
import cloudinary from "../middlewares/cloudinary-uploads.js";
import Wallet from "../wallet/wallet.model.js";
import { numberVerificationAccount } from "../wallet/wallet.controller.js"; // Importa la función

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ status: true }).sort({
      createdAt: -1,
    });

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No services found",
      });
    }
    const servicesWithWallet = await Promise.all(
      services.map(async (service) => {
        // Busca la wallet asociada al servicio
        const wallet = await Wallet.findOne({ service: service._id });
        return {
          ...service.toObject(),
          wallet: wallet
            ? {
                walletId: wallet._id,
                noAccount: wallet.noAccount,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      services: servicesWithWallet,
      serviceIds: services.map((service) => service.id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving services",
      error: error.message,
    });
  }
};

export const addService = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.price === "string") data.price = Number(data.price);
    if (typeof data.status === "string") data.status = data.status === "true";
    if (req.file) {
      data.image = req.file.path;
    }

    const service = new Service(data);
    await service.save();
    const noAccount = await numberVerificationAccount("monetary");
    const savingAccount = await numberVerificationAccount("saving");
    const foreingCurrency = await numberVerificationAccount("foreing");
    const walletData = {
      noAccount,
      savingAccount,
      foreingCurrency,
      service: service._id, // Cambia aquí
    };

    const wallet = await Wallet.create(walletData);
    return res.status(200).json({
      success: true,
      message: "Service and wallet created successfully",
      service,
      wallet: {
        walletId: wallet._id,
        noAccount: wallet.noAccount,
        savingAccount: wallet.savingAccount,
        foreingCurrency: wallet.foreingCurrency,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding service and wallet",
      error: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (req.file) {
      const oldService = await Service.findById(id);
      if (oldService.image) {
        const publicId = oldService.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`services/${publicId}`);
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      data.image = result.secure_url;
    }

    const updatedService = await Service.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating service",
      error: error.message,
    });
  }
};

export const deactivateService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado",
      });
    }

    service.status = !service.status;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Servicio ${
        service.status ? "activado" : "desactivado"
      } correctamente`,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al cambiar el estado del servicio",
      error: error.message,
    });
  }
};

export const searchService = async (req, res) => {
  try {
    const { name } = req.params;

    const services = await Service.find({
      name: new RegExp(name, "i"),
      status: true,
    }).sort({ createdAt: -1 });

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No services found with that name",
      });
    }

    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching for services",
      error: error.message,
    });
  }
};

export const assignServiceToUser = async (req, res) => {
  try {
    const { userId, serviceId } = req.body;

    if (!userId || !serviceId) {
      return res.status(400).json({
        success: false,
        message: "Se requieren tanto el ID de usuario como el ID de servicio",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.status) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado o no está activo",
      });
    }

    if (user.services.includes(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Este servicio ya está asignado al usuario",
      });
    }

    user.services.push(serviceId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Servicio asignado al usuario correctamente",
      user: {
        id: user._id,
        name: user.name,
        services: user.services,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al asignar el servicio al usuario",
      error: error.message,
    });
  }
};

export const removeServiceFromUser = async (req, res) => {
  try {
    const { userId, serviceId } = req.body;

    if (!userId || !serviceId) {
      return res.status(400).json({
        success: false,
        message: "Se requieren tanto el ID de usuario como el ID de servicio",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!user.services.includes(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Este servicio no está asignado al usuario",
      });
    }

    user.services = user.services.filter((id) => id.toString() !== serviceId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Servicio eliminado del usuario correctamente",
      user: {
        id: user._id,
        name: user.name,
        services: user.services,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el servicio del usuario",
      error: error.message,
    });
  }
};

export const getUserServices = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Se requiere el ID de usuario",
      });
    }

    const user = await User.findById(userId).populate("services");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Servicios del usuario obtenidos correctamente",
      services: user.services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los servicios del usuario",
      error: error.message,
    });
  }
};
