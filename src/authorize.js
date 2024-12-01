const profiles = require("./profiles.json");

function authorize(requiredPermission) {
  return (req, res, next) => {
    console.log("Authorize request for profile:", req.user?.profile);
    const userProfile = req.header("x-user-profile");
    console.log("User profile:", userProfile);

    if (!userProfile) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No profile provided" });
    }

    const profilePermissions = profiles[userProfile]?.permissions;
    console.log("Profile permissions:", profilePermissions);
    if (
      !profilePermissions ||
      !profilePermissions.includes(requiredPermission)
    ) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }

    next(); // user authorized to access the endpoint
  };
}

module.exports = authorize;
