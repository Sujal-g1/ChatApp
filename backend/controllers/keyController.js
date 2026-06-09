import User from "../models/User.js";

// set Public key
export const savePublicKey = async (req, res) => {
  try {

    const userId = req.user._id;
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({
        success: false,
        message: "Public key required"
      });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        publicKey
      }
    );

    res.json({
      success: true,
      message: "Public key saved"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// get publicKey
export const getPublicKey = async (req, res) => {
  try {

    const user =
      await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }

    res.json({
      success:true,
      publicKey:user.publicKey
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};