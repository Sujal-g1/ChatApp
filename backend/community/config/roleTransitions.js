export const ROLE_TRANSITIONS = {

  owner: {

    owner: false,

    admin: true,

    moderator: true,

    member: true,

  },

  admin: {

    owner: false,

    admin: false,

    moderator: true,

    member: true,

  },

  moderator: {

    owner: false,

    admin: false,

    moderator: false,

    member: false,

  },

  member: {

    owner: false,

    admin: false,

    moderator: false,

    member: false,

  }

};