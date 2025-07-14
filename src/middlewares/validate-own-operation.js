export const validateOwnOperation = async (req, res, next) => {
  try {
    const userIdFromToken = req.usuario?._id?.toString() || req.usuario?.uid?.toString();
    const userIdFromRequest = req.params.uid;

    if (!userIdFromRequest) {
      return res.status(400).json({
        success: false,
        message: "User id not provided in request"
      });
    }
    if (userIdFromToken !== userIdFromRequest) {
      return res.status(400).json({
        success: false,
        message: "You are not the user"
      });
    }
    next();
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error at validate own operation",
      error: error.message
    });
  }
};
