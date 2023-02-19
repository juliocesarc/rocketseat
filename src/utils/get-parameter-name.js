export function getParameterName(path) {
    const routeParameterName = /:([a-zA-Z]+)/g
    const pathWithParms = path.replace(routeParameterName, '(?<$1>[a-z0-9\-_]+)')
    
    const pathRegex = new RegExp(`^${pathWithParms}(?<query>\\?(.*))?$`)
    return pathRegex
}