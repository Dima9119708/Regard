export function reSorting(types, DATA) {

  return types.reduce( (acc,type) => {

    acc[type] = []

    DATA.forEach(elem => {

      if (type === elem.type) {
        acc[type].push(elem)
      }
    })

    return acc
  }, {});
}

export function sideBarHTML(reSort) {

  return Object.keys(reSort).map(goods => {

    if (goods === '') return

    let brand = reSort[goods].map(elem => elem.producer)

    brand = [...new Set(brand)]

    brand = brand.map(item => {

      if (item) {
        return `
          <li class="content-product__menu-internal-item" data-brand="${item}">${item}</li>
        `
      }
    })

    return `
      <li class="content-product__menu-item" data-accardion="false" data-goods="${goods}"> ${goods} <span>+</span>
          <ul class="content-product__menu-internal" data-internal ">
            <li class="content-product__menu-internal-item">все товары раздела</li>
            ${brand.join('')}
          </ul>
      </li>
    `
  })
}

export function accardion(event) {

  const { scrollHeight, style, dataset } = event.target

  if (JSON.parse(dataset.accardion)) {
    style.maxHeight = 26 + 'px'
    event.target.setAttribute('data-accardion', false)
  }
  else {
    style.maxHeight = event.target.scrollHeight + 'px'
    event.target.setAttribute('data-accardion', true)
  }

}