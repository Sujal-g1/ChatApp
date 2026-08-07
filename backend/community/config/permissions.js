export const COMMUNITY_PERMISSIONS = {

  owner: [

    "community:update",
    "community:delete",

    "community:transfer",

    "member:approve",
    "member:reject",

    "member:kick",
    "member:ban",
    "member:mute",

    "member:promoteAdmin",
    "member:removeAdmin",

    "member:promoteModerator",
    "member:removeModerator",

  ],

  admin: [

    "member:approve",
    "member:reject",

    "member:kick",
    "member:ban",
    "member:mute",

    "member:promoteModerator",
    "member:removeModerator",

  ],

  moderator: [

    "member:kick",
    "member:ban",
    "member:mute",

  ],

  member: [],

};