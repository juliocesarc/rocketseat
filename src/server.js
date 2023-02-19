import http from "node:http"
import { json } from "./middleware/json.js"
import { routes } from "./routes.js"
import { extractQueryParms } from "./utils/extract-query-parms.js"

const server = http.createServer(async (req, res) => {
    const { method, url } = req
    
    await json(req, res)

    const route = routes.find(route => {
        return route.method == method && route.path.test(url)
    })

    if (route) {
        const routeParameters = req.url.match(route.path)

        const { query, ...parms } = routeParameters.groups
        req.query = query ? extractQueryParms(query) : {}
        req.parms = parms

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3000)