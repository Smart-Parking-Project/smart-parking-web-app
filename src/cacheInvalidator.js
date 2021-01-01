/**
 * For all functions in this file, the nature of the parameters are given as follow
 *
 * @param   _cache  response from '@apollo/client' of useMutation or useQuer
 * @param   data  the updated data in graphql form. e.g data:{projects:[{}]}
 * @param   variables   input for graphql query inputs, must be Object
 * @param   query   graphql query
 */

export function writeToCache(_cache, data, query) {
  return _cache.writeQuery({
    query: query,
    data,
  })
}

export function readFromCache(_cache, variables, query) {
  return _cache.readQuery({
    query: query,
    variables: { ...variables },
  })
}
