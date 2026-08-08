import * as communityMemberService from "../services/communityMemberService.js";

export const leaveCommunity = async (
  req,
  res
) => {

  try {

    await communityMemberService.leaveCommunity(
      req.params.id,
      req.user._id
    );

    return res.json({
      success: true,
      message: "You left the community.",
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};


export const getCommunityMembers = async (req, res) => {

  try {

    const members =
      await communityMemberService.getCommunityMembers(
        req.params.id
      );

    return res.json({
      success: true,
      members,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


export const updateMemberRole = async (req,res)=>{

try{

const member =
await communityMemberService.updateMemberRole(

req.params.memberId,

req.communityMember.role,

req.body.role

);

return res.json({

success:true,

member

});

}catch(error){

return res.status(400).json({

success:false,

message:error.message

});

}

}


export const removeMember = async (
  req,
  res
) => {

  try {

    await communityMemberService.removeMember(

      req.params.memberId,

      req.communityMember.role,

      req.user._id

    );

    return res.json({

      success: true,

      message: "Member removed successfully.",

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message,

    });

  }

};


export const transferOwnership = async (
  req,
  res
) => {

  try {

    const result =
      await communityMemberService.transferOwnership(

        req.params.id,

        req.body.memberId,

        req.user._id

      );

    return res.json({

      success: true,

      message:
        "Ownership transferred successfully.",

      ...result,

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message,

    });

  }

};

export const searchCommunityMembers = async (
  req,
  res
) => {

  try {

    const { q } = req.query;

    const members =
      await communityMemberService.searchCommunityMembers(
        req.params.id,
        q
      );

    return res.json({
      success: true,
      members,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};