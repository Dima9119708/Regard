export const catalog = 'catalog'
export const catalogHashPath = {
  search : 'Поиск',
  production : 'Продукция'
}

export const calatogFN = (params, params2, pageActive = '') => {
  return `${catalog}/+/${params}/+/${params2}/+/${pageActive}`
}
