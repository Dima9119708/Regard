export const catalog = 'catalog'
export const catalogHashPath = {
  search : 'Поиск',
  production : 'Продукция'
}

export const changeURLCalatog = (params, params2, pageActive = 1) => {
  return `${catalog}/+/${params}/+/${params2}/+/${pageActive}`
}
