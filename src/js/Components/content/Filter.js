import { accardion, renderProductCards } from "./renderContent.functions"
import { ActiveRout } from "../../Routing/ActiveRouter"
import { urlParse, searchMaxAndMinNumber } from '../../core/utils'
import { catalog } from "../../core/urlHash.fn"
import { pagination, showItems } from "../../core/pagination"

export class Filter {

  static onClick(e, content) {

    const { $root } = content

    const buttonSort = e.target.closest('[data-price]')

    if (buttonSort) {
      const $parent = buttonSort.closest('[data-sort]')

      for (const item of $parent.children) {
        item.classList.remove('price--active')
        item.setAttribute('data-price', false)
      }
      e.target.classList.add('price--active')
      e.target.setAttribute('data-price', true)

      Filter.changeURL = $root
      Filter.displayСardsBasedOnTheFilter(content)
    }

    const checkbox = e.target.closest('[data-checkbox]')

    if (checkbox) {

      const { checked } = checkbox.dataset

      if (JSON.parse(checked)) {
        checkbox.children[0].style.display = "none"
        checkbox.setAttribute('data-checked', false)
      }
      else {
        checkbox.children[0].style.display = "block"
        checkbox.setAttribute('data-checked', true)
      }

      Filter.changeURL = $root
      Filter.displayСardsBasedOnTheFilter(content)
    }

    const filterTitle = e.target.dataset.filtertittle

    if (filterTitle) {
      const $parent = e.target.closest('[data-accardion]')
      accardion($parent)
    }

    const reset = e.target.dataset.reset

    if (reset) {
      const currentURL = urlParse()
      const changeURL = `${catalog}/+/${currentURL[0]}/+/${currentURL[1]}/+/${currentURL[2]}`
      ActiveRout.setHash(changeURL)
      content.reRenderHTML()
    }

    const mobileBTN = e.target.dataset.filterMobileButton
    const $node = $root.qSelector('[data-content-block__filter-mobile]')

    if (mobileBTN === 'false') {
      const $heightNode = $node.scrollHeight

      e.target.setAttribute('data-filter-mobile-button', true)
      $node.style.maxHeight = $heightNode + 'px'
      $node.style.marginBottom = 10 + 'px'
    }
    else if (mobileBTN === 'true') {
      e.target.setAttribute('data-filter-mobile-button', false)
      $node.style.maxHeight = 0
      $node.style.marginBottom = 0
    }

  }

  static renderHTML(base) {
    return `
        <div class="content-block__filter unselectable" data-filter data-da="[data-content-block__filter-mobile],0,1245,max">
          <div class="content-block__filter-header">Подбор по параметрам</div>
          <div class="content-block__filter-reset" data-reset="reset">Сбросить фильтры</div>
          <ul class="content-block__filter-list" data-simplebar>
            ${Filter.#renderRangeSliderHTML(base)}
            ${Filter.#renderFilterContent(base)}
          </ul>
        </div>
    `
  }

  static rangeSliderINIT(content, parent) {

    const { $root: $elem } = content

    // Возращаем из инстенса класса DOM, DOM - элемент'
    const $root = $elem.qSelector(parent) || document.querySelector(parent)

    if (!$root) {
      return
    }

    // Получение интупа мин и макс
    const inputMin = $root.querySelector('[data-minInput]')
    const inputMax = $root.querySelector('[data-maxInput]')

    // Левая и правая кнопка
    const $leftRange = $root.querySelector('[data-range="left"]')
    const $rightRange = $root.querySelector('[data-range="right"]')

    // Родитель всего слайдера
    const $slider = $root.querySelector('[data-rangeParent]')

    // Линия между кнопками
    const $line = $root.querySelector('[data-rangeLine]')

    // Получаем минимум и максимум
    const min = +inputMin.min
    const max = +inputMax.max

    // Перевод из пикселей в проценты
    let per_min = 0;
    let per_max = 0;

    // Ф-н инициализирует начальные данные
    rangeSliderInput(inputMin, inputMax, $slider, $leftRange, $rightRange, $line)

    // Изменение инпутов
    $root.onchange = e => {

      // Ищем родителя инпутов
      const $parent = e.target.closest('[data-inputFilterParent]')

      // Если это дейвствительно родитель, а не falsy значените то
      if ($parent) {

        // Снова вызываем ф-н делает все тоже самое
        rangeSliderInput(inputMin, inputMax, $slider, $leftRange, $rightRange, $line)

        Filter.changeURL = content.$root
        Filter.displayСardsBasedOnTheFilter(content)
      }
    }

    $root.onmousedown = e => {

      // Находим data атрибут у кнопок
      const range = e.target.dataset.range

      // Если атрибут есть у кнопки, значить можно продолжать логику
      if (range) {

        // Получаем текущую кнопку
        let targetButton = e.target

        $root.onmousemove = e => {

          if (targetButton) {

            // получаем значение left которое задано в стилях
            const rightButtonLeftPXValue = +$rightRange.style.left.split('px')[0]
            const leftButtonLeftPXValue = +$leftRange.style.left.split('px')[0]

            // Вычисляем дельту относительно компонента container
            // Так же нам нужны координаты самой кнопки, чтобы получить 0
            // То есть, если мы беремся за кнопку, значие всегда 0, + или - после
            const delta = e.pageX - targetButton.getBoundingClientRect().x

            // Так как значение дельты всегда 0 + или - то нам нужно
            // значения left у кнопки, чтобы прибавить к дельте
            // Допустим у кнопки 80рх + дельта 10 получаем 90рх сдвиг кнопки
            const value = delta + +targetButton.style.left.split('px')[0]

            // Условия чтобы кнопки не выходили за пределы
            if (value < 0) {
              inputMin.value = min
              return
            }
            else if (value > $slider.offsetWidth - targetButton.offsetWidth) {

              inputMax.value = max
              return
            }

            // Записываем в кнопку значение которое получилось из
            // Дельта + значение из кнопки
            targetButton.style.left = value < 1 ? 0 : value + 'px'

            // Так же нам нужно уменьшать линию
            if (range === 'left') {

              // правая кнопка имеет значение ширины родителя,
              // value - либо уменьшаеться либо увеличиваеться,
              // соответственно -- значиние правой кнопки - value, дает нам ширину линии
              $line.style.width = rightButtonLeftPXValue - value + 'px'

              // Так же нам нужно, двигать линию в лево маржином
              $line.style.marginLeft = value + 'px'
            }
            else {
              // Если это правая кнопка, то нам нужно всего лишь
              // Отнимать value и margin для того чтобы получить ширину
              $line.style.width = value - leftButtonLeftPXValue + 'px'
            }

            // формула для перевода из пикселей в проценты
            per_min = leftButtonLeftPXValue * 100 / ($slider.offsetWidth - $leftRange.offsetWidth);
            per_max = rightButtonLeftPXValue * 100 / ($slider.offsetWidth - $leftRange.offsetWidth);

            // Если при сдвиге минимальное значение больше чем макс или наоборот
            // Делаем сброс
            if (per_min >= per_max) {
              targetButton = null
              $leftRange.style.left = 0
              $rightRange.style.left = $slider.offsetWidth - $leftRange.offsetWidth + 'px'
              $line.style.width = $slider.offsetWidth - $leftRange.offsetWidth + 'px'
              $line.style.marginLeft = 0
              inputMin.value = min
              inputMax.value = max
              return
            }

            if (range === 'left') {
              inputMin.value = (parseInt(min) + Math.round((max - min) * per_min / 100));
            }
            else {
              inputMax.value = (parseInt(min) + Math.round((max - min) * per_max / 100));
            }
          }
        }

        $root.onmouseup = e => {
          $root.onmousemove = null
          $root.onmouseup = null

          Filter.changeURL = content.$root
          Filter.displayСardsBasedOnTheFilter(content)
        }
      }
    }

    $root.ontouchstart = e => {

      // Находим data атрибут у кнопок
      const range = e.target.dataset.range

      // Если атрибут есть у кнопки, значить можно продолжать логику
      if (range) {

        // Получаем текущую кнопку
        let targetButton = e.target

        $root.ontouchmove = e => {

          if (targetButton) {

            // получаем значение left которое задано в стилях
            const rightButtonLeftPXValue = +$rightRange.style.left.split('px')[0]
            const leftButtonLeftPXValue = +$leftRange.style.left.split('px')[0]

            // Вычисляем дельту относительно компонента container
            // Так же нам нужны координаты самой кнопки, чтобы получить 0
            // То есть, если мы беремся за кнопку, значие всегда 0, + или - после
            const delta = e.pageX - targetButton.getBoundingClientRect().x

            // Так как значение дельты всегда 0 + или - то нам нужно
            // значения left у кнопки, чтобы прибавить к дельте
            // Допустим у кнопки 80рх + дельта 10 получаем 90рх сдвиг кнопки
            const value = delta + +targetButton.style.left.split('px')[0]

            // Условия чтобы кнопки не выходили за пределы
            if (value < 0) {
              return
            }
            else if (value > $slider.offsetWidth - targetButton.offsetWidth) {
              return
            }

            // Записываем в кнопку значение которое получилось из
            // Дельта + значение из кнопки
            targetButton.style.left = value < 1 ? 0 : value + 'px'

            // Так же нам нужно уменьшать линию
            if (range === 'left') {

              // правая кнопка имеет значение ширины родителя,
              // value - либо уменьшаеться либо увеличиваеться,
              // соответственно -- значиние правой кнопки - value, дает нам ширину линии
              $line.style.width = rightButtonLeftPXValue - value + 'px'

              // Так же нам нужно, двигать линию в лево маржином
              $line.style.marginLeft = value + 'px'
            }
            else {

              // Если это правая кнопка, то нам нужно всего лишь
              // Отнимать value и margin для того чтобы получить ширину
              $line.style.width = value - leftButtonLeftPXValue + 'px'
            }

            // Если при сдвиге минимальное значение больше чем макс или наоборот
            // Делаем сброс
            if (+inputMin.value > +inputMax.value || +inputMax.value < +inputMin.value) {
              targetButton = null
              $leftRange.style.left = 0
              $rightRange.style.left = $slider.offsetWidth - $leftRange.offsetWidth + 'px'
              $line.style.width = $slider.offsetWidth - $leftRange.offsetWidth + 'px'
              $line.style.marginLeft = 0
            }

            // формула для перевода из пикселей в проценты
            per_min = leftButtonLeftPXValue * 100 / ($slider.offsetWidth - $leftRange.offsetWidth);
            per_max = rightButtonLeftPXValue * 100 / ($slider.offsetWidth - $leftRange.offsetWidth);

            inputMin.value = (parseInt(min) + Math.round((max - min) * per_min / 100));
            inputMax.value = (parseInt(min) + Math.round((max - min) * per_max / 100));
          }
        }

        $root.ontouchend = e => {
          $root.ontouchmove = null
          $root.ontouchend = null

          Filter.changeURL = content.$root
          Filter.displayСardsBasedOnTheFilter(content)
        }
      }
    }
  }

  static #renderRangeSliderHTML(base) {

    const min = searchMaxAndMinNumber(false, base)
    const max = searchMaxAndMinNumber(true, base)

    if (min === max) {
      return ''
    }
    else if (min === Infinity || max === 0) {
      return ''
    }

    return `
      <li class="content-block__filter-item" data-accardion="true" data-randeSliderPC>
        <div class="content-block__filter-title" data-filterTittle="filterTittle">
          <i class="fas fa-long-arrow-alt-right"></i>Цена, руб.
      </div>
        <div class="content-block__filter-price" data-inputFilterParent>
          <div class="input-price from">
          от
          <input type="number" data-minInput value="${searchMaxAndMinNumber(false, base)}" min="${searchMaxAndMinNumber(false, base)}">
          </div>
          <div class="input-price before">
            до
          <input type="number" data-maxInput value="${searchMaxAndMinNumber(true, base)}" max="${searchMaxAndMinNumber(true, base)}">
          </div>
          </div>

          <div class="content__range-slider" data-rangeParent>
            <button class="content__range-button" data-range="left"></button>
            <button class="content__range-button" data-range="right"></button>
            <div class="content__range-slider-line" data-rangeLine></div>
          </div>
      </li>
    `
  }

  static #renderFilterContent(base) {

    if (base.length) {

      const type = base[0].type
      const types = base.map(item => item.type)
      const arrayTypes = [...new Set(types)]

      if (arrayTypes.length > 1) {

        const typeHTML = arrayTypes.map(trainingHTMLList)

        return renderHTMLFilter(
          ['Тип продукта'],
          base,
          typeHTML
        )
      }

      if (type === 'Блоки питания') {
        const watts = [
          "350",
          "400",
          "450",
          "500",
          "550",
          "600",
          "650",
          "700",
          "750",
          "800",
          "850",
          "1000",
          "1200",
          "1500",
          "1800",
          "2000"
        ]

        const selectionWatts = searchForMatches(base, watts)
        const wattsHTML = selectionWatts.map(trainingHTMLList)

        return renderHTMLFilter(
          ['Мощность, W'],
          base,
          wattsHTML,
        )
      }

      if (type === 'Видеокарты') {

        const seria = [
          "FirePro 2270",
          "FirePro 2460",
          "FirePro 400",
          "FirePro 9150",
          "FirePro 9170",
          "GeForce 210",
          "GeForce GT 1030",
          "GeForce GT 710",
          "GeForce GT 730",
          "GTX 1050 Ti",
          "GTX 1060",
          "GTX 1070 Ti",
          "GTX 1650",
          "GTX 1650 Super",
          "GTX 1660",
          "GTX 1660 Super",
          "GTX 1660 Ti",
          "RTX 2060",
          "RTX 2060 Super",
          "RTX 2070",
          "RTX 2070 Super",
          "RTX 2080 Super",
          "RTX 2080 Ti",
          "Titan V",
          "Quadro 5000",
          "Quadro GP100",
          "Quadro K620",
          "Quadro M6000",
          "Quadro NVS 510",
          "Quadro P1000",
          "Quadro P2000",
          "Quadro P2200",
          "Quadro P400",
          "Quadro P5000",
          "Quadro P6000",
          "Quadro P620",
          "Quadro RTX 4000",
          "Quadro RTX 5000",
          "Quadro RTX 6000",
          "Quadro RTX 8000",
          "Radeon Instinct MI50",
          "Radeon Pro WX 2100",
          "Radeon Pro WX 3100",
          "Radeon Pro WX 4100",
          "Radeon Pro WX 5100",
          "Radeon Pro WX 9100",
          "Radeon R7 240",
          "Radeon R7 250",
          "Radeon RX 550",
          "Radeon RX 5500 XT",
          "Radeon RX 5600 XT",
          "Radeon RX 570",
          "Radeon RX 5700",
          "Radeon RX 5700 XT",
          "Radeon RX 580",
          "Radeon RX 590",
          "Titan RTX"
        ]

        const typeMemory = ['DDR3', 'DDR4', 'GDDR5', 'GDDR5X', 'GDDR6']

        const producer = [
          "AMD",
          "ASRock",
          "ASUS",
          "Colorful",
          "Dell",
          "EVGA",
          "Gigabyte",
          "lnno3D",
          "KFA2",
          "MSI",
          "PNY",
          "Palit",
          "PowerColor",
          "Sapphire",
          "nVidia"
        ]

        let memory = [
                      1,
                      11,
                      11000,
                      128,
                      1536,
                      16,
                      2,
                      2048,
                      24,
                      256,
                      3,
                      3072,
                      4,
                      4096,
                      5,
                      512,
                      6,
                      6144,
                      768,
                      8,
                      8192,
                      49152,
                      24576,
                      16384,
                     ]



        memory = memory.map(item => {
          if (item > 100) {
            return item + 'Mb'
          }
          else {
            return item + 'Гб'
          }
        })

        const selectionMemory = searchForMatches(base, memory)
        const typeMemoryArray = searchForMatches(base, typeMemory)
        const seriaArray = searchForMatches(base, seria)
        const producerArray = searchForMatches(base, producer)

        const memoryHTML = selectionMemory.map(trainingHTMLList)
        const typeMemoryHTML = typeMemoryArray.map(trainingHTMLList)
        const seriaHTML = seriaArray.map(trainingHTMLList)
        const producerHTML = producerArray.map(trainingHTMLList)

        return renderHTMLFilter(
          ['Обьем памяти', 'Тип памяти', 'Серия','Производитель'],
          base,
          memoryHTML,
          typeMemoryHTML,
          seriaHTML,
          producerHTML
        )
      }

      if (type === 'Процессоры' ) {
        const processorFamily = [
          "A10-Series",
          "A12-Series",
          "A6-Series",
          "A8-Series",
          "Athlon",
          "Athlon x4",
          "Celeron",
          "Celeron Dual-Core",
          "Core i3",
          "Core iS",
          "Core i7",
          "Core i9",
          "Pentium Dual-Core",
          "Ryzen 3",
          "Ryzen 5",
          "Ryzen 7",
          "Ryzen 9",
          "Ryzen Threadripper"
        ];

        const socket = [
          "AM4",
          "TR4",
          "sTRX4",
          "FM2+",
          "1150",
          "1151",
          "1151 v2.",
          "1155",
          "1200",
          "2066"
        ];

        const deliveryType = [
          "BOX",
          "OEM"
        ];

        const processorFamilyArray = searchForMatches(base, processorFamily)
        const socketArray = searchForMatches(base, socket)
        const deliveryTypeArray = searchForMatches(base, deliveryType)

        const processorFamilyHTML = processorFamilyArray.map(trainingHTMLList)
        const socketArrayHTML = socketArray.map(trainingHTMLList)
        const deliveryTypeHTML = deliveryTypeArray.map(trainingHTMLList)

        return renderHTMLFilter(
          ['Семейство', 'Сокет', 'Тип поставки'],
          base,
          processorFamilyHTML,
          socketArrayHTML,
          deliveryTypeHTML
        )
      }

      if (type === 'Жесткие диски (HDD)') {

        const formFactor = [
          "2.5",
          "3.5"
        ];

        const storageVolume = [
          "1Tb",
          "10Tb",
          "12Tb",
          "14Tb",
          "16Tb",
          "18Tb",
          "3Tb",
          "5Tb",
          "500Gb",
          "6Tb",
          "8Tb"
        ];

        const rotationalSpeed = [
          "5400rpm",
          "5700rpm",
          "5900rpm",
          "5940rpm",
          "7200rpm",
          "IntelliPower"
        ]

        const formFactorArray = searchForMatches(base, formFactor)
        const storageVolumeArray = searchForMatches(base, storageVolume)
        const rotationalSpeedArray = searchForMatches(base, rotationalSpeed)

        const formFactorHTML = formFactorArray.map(trainingHTMLList)
        const storageVolumeHTML = storageVolumeArray.map(trainingHTMLList)
        const rotationalSpeedHTML = rotationalSpeedArray.map(trainingHTMLList)

        return renderHTMLFilter(
            ['Форм-фактор', 'Объём накопителя', 'Скорость вращения'],
            base,
            formFactorHTML,
            storageVolumeHTML,
            rotationalSpeedHTML
            )
      }

      if (type === 'Материнские платы') {

        const producer = [
          "ASRock",
          "ASUS",
          "Biostar",
          "Colorful",
          "Gigabyte",
          "MSI",
          "NZXT",
          "Supermicro"
        ];

        const chipset = [
          "760G",
          "A320",
          "A68H",
          "B350",
          "B450",
          "B550",
          "TRX40",
          "X370",
          "X399",
          "X470",
          "X570",
          "B250",
          "B360",
          "B365",
          "B460",
          "C232",
          "C236",
          "C621",
          "G41",
          "НПО",
          "Н170",
          "Н270",
          "Н310",
          "Н370",
          "Н410",
          "Н470",
          "Н61",
          "Н81",
          "Q170",
          "Q270",
          "Q370",
          "Q470",
          "Х299",
          "Х99",
          "W480",
          "Z170",
          "Z270",
          "Z370",
          "Z390",
          "Z490"
        ]

        const producerArray = searchForMatches(base, producer)
        const chipsetArray = searchForMatches(base, chipset)

        const producerHTML = producerArray.map(trainingHTMLList)
        const chipsetHTML = chipsetArray.map(trainingHTMLList)

        return renderHTMLFilter(
          ['Производитель', 'Чипсет'],
          base,
          producerHTML,
          chipsetHTML,
        )
      }

      if (type === 'Оперативная память') {

        const clockFrequency = [
          "800MHz",
          "1066MHz",
          "1333MHz",
          "1600MHz",
          "1866MHz",
          "2133MHz",
          "2400MHz",
          "2666MHz",
          "2933MHz",
          "3000MHz",
          "3200MHz",
          "3333MHz",
          "3400MHz",
          "3466MHz",
          "3600MHz",
          "3733MHz",
          "3866MHz",
          "4000MHz",
          "4133MHz",
          "4266MHz",
          "4400MHz",
          "4600MHz",
          "4800MHz",
        ]

        const memory = [
          " 1Gb",
          " 2Gb",
          " 4Gb",
          " 8Gb",
          " 16Gb",
          " 32Gb",
          " 64Gb",
          " 128Gb",
        ]

        const clockFrequencyArray = searchForMatches(base, clockFrequency)
        const memoryArray = searchForMatches(base, memory)

        const clockFrequencyHTML = clockFrequencyArray.map(trainingHTMLList)
        const memoryHTML = memoryArray.map(trainingHTMLList)

        return renderHTMLFilter(
          ['Тактовая частота', 'Объём памяти'],
          base,
          clockFrequencyHTML,
          memoryHTML
        )
      }

      if (type === 'Корпуса') {
        const powerSupply = [
          "без БП",
          "65W",
          "120W",
          "150W",
          "160W",
          "200W",
          "250W",
          "265W",
          "300W",
          "350W",
          "400W",
          "450W",
          "500W",
          "550W",
          "600W",
          "700W"
        ]

        const color = [
          "white",
          "yellow",
          "green",
          "gold",
          "red",
          "orange",
          "silver",
          "gray",
          "blue",
          "black"
        ]

        const powerSupplyArray = searchForMatches(base, powerSupply)
        const colorArray = searchForMatches(base, color)

        const powerSupplyHTML = powerSupplyArray.map(trainingHTMLList)
        const colorHTML = colorArray.map(trainingHTMLList)

        return renderHTMLFilter(
          ['Блок питания', 'Цвет корпуса'],
          base,
          powerSupplyHTML,
          colorHTML
        )
      }
    }

    return ''
  }

  static displayСardsBasedOnTheFilter(Content) {

    let { filterCards : DATA, $root, store } = Content

    const dataCardsWrapDiv = $root.qSelector('[data-cards]')
    const currentURL = urlParse()[3] || []

    if (currentURL.length > 0) {

      const paginationWrap = $root.qSelector('[data-pagination]')
      const urlParse = currentURL.split(';')
      const sliderPriceINITNumber = urlParse[1].split('--')

      let sort = filterSortPrice(urlParse[0], DATA)
      sort = filteringByPrice(sort, sliderPriceINITNumber)
      const goods = filterChecked(urlParse, sort)

      if (!goods.length) {
        dataCardsWrapDiv.innerHTML = '<div class="content-block__cards-noProducts">Товаров по выбраному фильтру не найдено</div>'
        paginationWrap.innerHTML = ''
        return
      }

      dataCardsWrapDiv.style.opacity = '0.2'
      dataCardsWrapDiv.style.transition = 'opacity .4s linear'

      setTimeout(() => {
        dataCardsWrapDiv.innerHTML = renderProductCards(pagination.showItems(goods), Content)
        dataCardsWrapDiv.style.opacity = '1'
        dataCardsWrapDiv.style.transition = 'opacity .4s linear'
      }, 400)

      const pageActive = pagination.pageActive()
      const counterPages = Math.ceil(goods.length / showItems)


      if (pageActive > counterPages) {
        pagination.changingURLBasedOnActivePage(1)
      }

      paginationWrap.innerHTML = pagination.__INIT__(goods)
      return goods
    }

    dataCardsWrapDiv.style.opacity = '0.2'
    dataCardsWrapDiv.style.transition = 'opacity .4s linear'

    setTimeout(() => {
      dataCardsWrapDiv.style.opacity = '1'
      dataCardsWrapDiv.style.transition = 'opacity .4s linear'
    }, 400)

    return DATA
  }

  static viewUpdateDom(content) {

    const { $root } = content

    const currentURL = urlParse()[3] || []

    if (currentURL.length > 0) {

      const urlPARSE = currentURL.split(';')

      const sortDiv = $root.qSelector(`[data-value="${urlPARSE[0]}"]`)
      sortDiv.classList.add('price--active')

      if (urlPARSE.length > 2 && urlPARSE[2] !== '') {
        for (let i = 2; i <= urlPARSE.length - 1; i++) {
          const $elem = $root.qSelector(`[data-value="${urlPARSE[i]}"]`)
          $elem.setAttribute('data-checked', true)
          $elem.children[0].style.display = 'block'
        }
      }

      const priceMinAndMax = urlPARSE[1].split('--')
      const minPrice = $root.qSelector('[data-mininput]')
      const maxPrice = $root.qSelector('[data-maxinput]')

      minPrice.value = priceMinAndMax[0]
      maxPrice.value = priceMinAndMax[1]
    }
  }

  static set changeURL($root) {

    const sortPrice = $root.qSelectorAll('[data-price]')
    let sortPriceActive = ''

    sortPrice.forEach(elem => {
      if (elem.dataset.price === 'true') {
        sortPriceActive = elem.dataset.value
      }
    })

    const minPrice = $root.qSelector('[data-mininput]')
    const maxPrice = $root.qSelector('[data-maxinput]')

    if (!minPrice || !maxPrice) {
      return
    }

    const checkeds = []
    const checked = $root.qSelectorAll('[data-checked]')

    checked.forEach(elem => {
      if (elem.dataset.checked === 'true') {
        checkeds.unshift(elem.dataset.value)
      }
    })

    const currentURL = urlParse()

    const changeURL = `${catalog}/+/${currentURL[0]}/+/${currentURL[1]}/+/${currentURL[2]}/+/${sortPriceActive};${minPrice.value}--${maxPrice.value};${checkeds.join(';')}`
    ActiveRout.hash(changeURL)
  }
}

// Фильрация выбранных элементов
function filterChecked(urlString, sort) {

  urlString = urlString.slice(2, urlString.length)

  let checkboxCheckeds = []

  if (urlString.length && urlString[0] !== '') {

    for (let i = 0; i < urlString.length; i++) {
      sort.forEach(item => {

        const searchItem = urlString[i].split(' ').join('').toLowerCase()
        const itemWithoutSpaces = item.name.split(' ').join('').toLowerCase()

        if (itemWithoutSpaces.includes(searchItem) || item.type === urlString[i]) {
          checkboxCheckeds.push(item)
        }
      })

    }
  }
  else {
    checkboxCheckeds = sort
  }

  return checkboxCheckeds
}

// Фильтрация range слайдера от и до
function filteringByPrice(sort, priceSplit) {

  return sort.reduce((acc, item) => {
    if (+item.price >= +priceSplit[0] && +priceSplit[1] >= +item.price) {
      acc.push(item)
    }

    return acc
  }, [])
}

// Фильтрация товаров по цене (по убыванию...)
function filterSortPrice(value,base) {

  if (value === 'default') {
    return base.sort()
  }
  else if (value === 'a--b') {
    return base.sort((a, b) => a.price - b.price)
  }
  else if (value === 'b--a') {
    return base.sort((a, b) => b.price - a.price)
  }

}

// Изменение состояние инпут range Slider
function rangeSliderInput(inputMin, inputMax, $slider, $leftRange, $rightRange, $line) {

  const min = +inputMin.min
  const max = +inputMax.max

  if (+inputMin.value < min) {
    inputMin.value = min
  }
  if (+inputMax.value > max) {
    inputMax.value = max
  }
  if (+inputMin.value > max) {
    inputMin.value = min
  }
  if (+inputMax.value < min) {
    inputMax.value = max
  }
  if (+inputMin.value > +inputMax.value) {
    const temp = +inputMin.value
    inputMin.value = inputMax.value
    inputMax.value = temp
  }

  const per1 = parseInt(inputMin.value - min) * 100 / (max - min)
  const per2 = parseInt(inputMax.value - min) * 100 / (max - min)

  const rangeButtonPX1 = per1 * ($slider.offsetWidth - $leftRange.offsetWidth) / 100
  const rangeButtonPX2 = per2 * ($slider.offsetWidth - $rightRange.offsetWidth) / 100

  $leftRange.style.left = rangeButtonPX1 + 'px'
  $rightRange.style.left = rangeButtonPX2 + 'px'

  $line.style.width = (rangeButtonPX2 - rangeButtonPX1) + 'px'
  $line.style.marginLeft = rangeButtonPX1 + 'px'
}

// Ищем совпадение базы массива с элементами, отбираем данные
function searchForMatches(base, data) {

  return base.reduce( (acc,elem) => {

    data.forEach(item => {

      const searchItem = item.split(' ').join('').toLowerCase()
      const itemWithoutSpaces = elem.name.split(' ').join('').toLowerCase()

      if ( itemWithoutSpaces.includes(searchItem)) {

        if (acc.indexOf(item) === -1) {
          acc.push(item)
        }
      }
    })

    return acc
  }, []);

}

// Подготавливаем массив HTML
function trainingHTMLList(item) {

  return `
    <div class="filter-checkbox">
      <div class="checkbox-fake"
          data-checkbox="checkbox"
          data-checked="false"
          data-value="${item}">
          ${item}
        <div class="checkbox-fake--active">
          <i class="fa fa-check" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  `
}

// Выводим отфильрованные и подготовленые HTML фильтры
function renderHTMLFilter(title, base, ...content) {

  const htmlStrings = []

  for (let i = 0; i < content.length; i++) {

    if (content[i].length) {

      htmlStrings.push(`
        <li class="content-block__filter-item" data-accardion="true">
          <div class="content-block__filter-title" data-filterTittle="filterTittle">
            <i class="fas fa-long-arrow-alt-right"></i>${title[i]}
           </div>
            ${content[i].join('')}
        </li>
      `)
    }
  }

  return htmlStrings.join('')
}