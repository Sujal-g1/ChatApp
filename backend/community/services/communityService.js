import mongoose from "mongoose";
import Community from "../models/Community.js";
import CommunityMember from "../models/CommunityMember.js";
import { generateSlug } from "../utils/generateSlug.js";



/**
 * Create Community
 */
export const createCommunity = async ({
  name,
  description,
  ownerId,
  visibility,
  category,
  tags,
  language,
  country,
}) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    const slug = await generateSlug(name);

    // Create Community
    const [community] = await Community.create(
      [{
        name,
        description,
        ownerId,
        slug,
        visibility,
        category,
        tags,
        language,
        country,
      }],
      { session }
    );

    // Creator becomes Owner
    await CommunityMember.create(
      [{
        communityId: community._id,
        userId: ownerId,
        role: "owner",
      }],
      { session }
    );

    await session.commitTransaction();

    return community;

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }

};


//  Get all communities
export const getCommunities = async () => {

  return await Community.find({
    status: "active",
  })
    .sort({
      memberCount: -1,
    });

};

//  Discover Communities
export const discoverCommunities = async ({
  page = 1,
  limit = 20,
  search = "",
  category = "",
  sort = "active",
}) => {

  const query = {
    status: "active",
  };

  // Search by community name
  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  // Category Filter
  if (
    category &&
    category !== "All"
  ) {
    query.category = category;
  }

  let sortQuery = {};

  switch (sort) {

    case "members":
      sortQuery = {
        memberCount: -1,
      };
      break;

    case "new":
      sortQuery = {
        createdAt: -1,
      };
      break;

    case "active":
    default:
      sortQuery = {
        activityScore: -1,
      };
      break;
  }

  const communities =
    await Community.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));

  const total =
    await Community.countDocuments(query);

  return {
    communities,
    total,
    page,
    pages: Math.ceil(total / limit),
  };

};

//  Get one community
export const getCommunity = async (slug) => {

  return await Community.findOne({
    slug,
  });

};

//  Update Community
export const updateCommunity = async (
  communityId,
  updates
) => {

  const allowedFields = [
    "name",
    "description",
    "banner",
    "icon",
    "category",
    "tags",
    "language",
    "country",
    "visibility",
    "messageTTL",
    "maxOnlineUsers",
  ];

  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  return await Community.findByIdAndUpdate(
    communityId,
    filteredUpdates,
    {
      new: true,
      runValidators: true,
    }
  );

};


// Delete Community
export const deleteCommunity = async (
  communityId
) => {

  return await Community.findByIdAndDelete(
    communityId
  );

};