export const COMMUNITY_PERMISSIONS = {

  owner: [

    "community:update",
    "community:delete",

    "community:transferOwnership",

    "member:approve",
    "member:reject",

    "member:kick",
    "member:ban",
    "member:mute",

    "member:promoteAdmin",
    "member:removeAdmin",

    "member:promoteModerator",
    "member:removeModerator",

    "message:delete",
    "message:moderate",


  ],

  admin: [

    "member:approve",
    "member:reject",

    "member:kick",
    "member:ban",
    "member:mute",

    "member:promoteModerator",
    "member:removeModerator",

     "message:delete",
    "message:moderate",

  ],

  moderator: [

    "member:kick",
    "member:ban",
    "member:mute",

    "message:delete",
    "message:moderate", 

  ],

  member: [],

};