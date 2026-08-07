export const validateCommunity = (req, res, next) => {

    const {
        name,
        description,
    } = req.body;

    if (!name) {

        return res.status(400).json({
            success:false,
            message:"Community name is required."
        });

    }

    if (name.length < 3) {

        return res.status(400).json({
            success:false,
            message:"Community name must contain at least 3 characters."
        });

    }

    if (name.length > 80) {

        return res.status(400).json({
            success:false,
            message:"Community name is too long."
        });

    }

    if (
        description &&
        description.length > 500
    ){

        return res.status(400).json({

            success:false,

            message:"Description is too long."

        });

    }

    next();

};