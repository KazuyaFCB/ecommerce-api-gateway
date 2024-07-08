import Role from "./Role";

export default {
    WHILELIST: ['/v1/api/auth'],
    
    // Define the proxy services
    SERVICE_MAPPING: [
        {
          pathPrefix: "/objects",
          target: "https://api.restful-api.dev",
          requiredRoles: [Role.SHOP, Role.USER]
        },
        {
          pathPrefix: "/api",
          target: "http://dog.ceo",
          requiredRoles: [Role.SHOP]
        }
    ]
}
