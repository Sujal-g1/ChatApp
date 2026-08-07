import Community from "../models/Community.js";

const slugify = (text) => {

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

};

export const generateSlug = async (name) => {

  const baseSlug = slugify(name);

  let slug = baseSlug;

  let counter = 1;

  while (await Community.exists({ slug })) {

    counter++;

    slug = `${baseSlug}-${counter}`;

  }

  return slug;

};