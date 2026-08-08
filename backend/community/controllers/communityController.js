import * as communityService from "../services/communityService.js";

/**
 * Create Community
 */
export const createCommunity = async (req, res) => {
  try {
    const {
      name,
      description,
      visibility,
      category,
      tags,
      language,
      country,
    } = req.body;

    const community =
      await communityService.createCommunity({
        name,
        description,
        ownerId: req.user._id,
        visibility,
        category,
        tags,
        language,
        country,
      });

    return res.status(201).json({
      success: true,
      community,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Communities
 */
export const getCommunities = async (req, res) => {
  try {

    const communities =
      await communityService.getCommunities();

    return res.json({
      success: true,
      communities,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * Get Community By Slug
 */
export const getCommunity = async (req, res) => {
  try {

    const { slug } = req.params;

    const community =
      await communityService.getCommunity(slug);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    return res.json({
      success: true,
      community,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * Update Community
 */
export const updateCommunity = async (req, res) => {
  try {

    const community =
      await communityService.updateCommunity(
        req.params.id,
        req.body
      );

    return res.json({
      success: true,
      community,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

/**
 * Delete Community
 */
// export const deleteCommunity = async (req, res) => {
//   try {

//     await communityService.deleteCommunity(
//       req.params.id
//     );

//     return res.json({
//       success: true,
//       message: "Community deleted successfully",
//     });

//   } catch (error) {

//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };
export const deleteCommunity = async (req, res) => {
  try {

    await communityService.deleteCommunity(req.params.id);

    return res.json({
      success: true,
      message: "Community deleted successfully",
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};


/**
 * Discover Communities
 */
export const discoverCommunities = async (req, res) => {

  try {

    const {
      page,
      limit,
      search,
      category,
      sort,
    } = req.query;

    const result =
      await communityService.discoverCommunities({

        page,

        limit,

        search,

        category,

        sort,

      });

    return res.json({

      success: true,

      ...result,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

export const getCommunityStats = async (
  req,
  res
) => {

  try {

    const stats =
      await communityService.getCommunityStats(
        req.params.id
      );

    return res.json({

      success: true,

      stats,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};