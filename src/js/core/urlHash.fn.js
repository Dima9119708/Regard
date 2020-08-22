export const catalog = 'catalog'
export const catalogHashPath = {
  search : 'Поиск',
  production : 'Продукция'
}
export const changeURLCalatog = (params, params2, pageActive = 1) => {
  return `${catalog}/+/${params}/+/${params2}/+/${pageActive}`
}


export const card = 'card'
export const changeURLCard = (id) => `${card}/+/${id}`


export const basket = 'basket'
export const changeURLBasket = () => `${basket}`


export const wishList = 'wishList'
export const changeURLWishList = () => `${wishList}`