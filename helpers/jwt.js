const { expressjwt: jwt }= require('express-jwt')

function authJwt(){
    const secret= process.env.SECRET;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            {url: /\/public\/upload(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/location(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/location(.*)/, methods: ['POST', 'OPTIONS']},
            // {url: /\/api\/v1\/order(.*)/, methods: ['GET', 'OPTIONS']},
            //  {url: /\/api\/v1\/order/, methods: ['POST', 'OPTIONS']},
            '/api/v1/user/login',
            '/api/v1/user/register'

        ]
    })
}
async function isRevoked(req, token){
    // if(!token.payload.isAdmin){
    //    return true
    // }
    if(!token){
        return true
     }
  
}

module.exports= authJwt;