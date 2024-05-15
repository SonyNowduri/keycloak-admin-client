import { KEYCLOAK_USERINFO_TOKEN_ENDPOINT } from "../envConstants.js";

const validateToken = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const options = {
        method: "GET",
        headers: {
          Authorization: req.headers.authorization,
        },
      };
      const userInfo = await fetch(KEYCLOAK_USERINFO_TOKEN_ENDPOINT, options);
      const data = await userInfo.json();
      if (userInfo.status !== 200) {
        res.status(401).json({
          error: `unauthorized, Token is not active`,
        });
      } else {
        next();
      }
    } else {
      res.status(401).json({
        error: `unauthorized`,
      });
    }
  } catch (error) {
    next(error);
  }
};

export { validateToken };
