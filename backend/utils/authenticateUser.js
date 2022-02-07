import Admin from "../models/admin.js";

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const loggedAdmin = await Admin.findOne({ accessToken });
    if (loggedAdmin) {
      next();
    } else {
      res.status(401).json({
        response: {
          message: "Please, log in",
        },
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
};

export default authenticateUser;
