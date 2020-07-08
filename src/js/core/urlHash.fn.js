export const catalog = 'catalog'

export const calatogFN = (params, params2) => {

  const paramsBrand = params === params2 ? '' : `/---/${params2}`

  return `${catalog}/---/${params}${paramsBrand}`

}
