import { changeURL, urlParse } from "../../core/utils"
import { pagination } from "../../core/pagination"
import { renderCards } from "./renderContent"
import { accardion } from "./renderContent.functions"

export class Filter {

  static onClick(e, base, store, $root) {

    const buttonSort = e.target.closest('[data-price]')

    if (buttonSort) {
      const $parent = buttonSort.closest('[data-sort]')

      for (const item of $parent.children) {
        item.classList.remove('price--active')
      }
      e.target.classList.add('price--active')

      const value = e.target.dataset.value

      renderCards(e, $root, filterSortPrice(value, base), store)
      changeURL(1)
      pagination.onClick(e, base, store, $root)
    }

    const { checkbox } = e.target.dataset

    if (checkbox) {

      const { checked } = e.target.dataset

      if (JSON.parse(checked)) {
        e.target.children[0].style.display = "none"
        e.target.setAttribute('data-checked', false)
      }
      else {
        e.target.children[0].style.display = "block"
        e.target.setAttribute('data-checked', true)
      }

    }

    const filterTitle = e.target.dataset.filtertittle

    if (filterTitle) {
      const $parent = e.target.closest('[data-accardion]')
      accardion($parent)
    }

  }

  static rangeSliderINIT($elem) {

    // Возращаем из инстенса класса DOM, DOM - элемент'
    const $root = $elem.returnNode()

    // Получение интупа мин и макс
    const inputMin = $root.querySelector('[data-minInput]')
    const inputMax = $root.querySelector('[data-maxInput]')

    // Левая и правая кнопка
    const $leftRange = $root.querySelector('[data-range="left"]')
    const $rightRange = $root.querySelector('[data-range="right"]')

    // Родитель всего слайдера
    const $slider = $root.querySelector('[data-rangeparent]')

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

            inputMin.value = (parseInt(min) + Math.round((max - min) * per_min / 100));
            inputMax.value = (parseInt(min) + Math.round((max - min) * per_max / 100));
          }
        }

        $root.onmouseup = e => {
          $root.onmousemove = null
          $root.onmouseup = null
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
          $root.onmousemove = null
          $root.onmouseup = null
        }
      }
    }
  }

  static renderFilterContent(base) {

    if (base.length) {

      const type = base[0].type
      const types = base.map(item => item.type)
      const arrayTypes = [...new Set(types)]

      if (arrayTypes.length > 1) {

        const typeHTML = arrayTypes.map( item => {

          return `
            <div class="filter-checkbox">
              <div class="checkbox-fake " data-checkbox="checkbox" data-checked="false" >${item}
                <div class="checkbox-fake--active">&#10003;</div>
              </div>
            </div>
          `
        })

        return `
          <li class="content-products-filter__item" data-accardion="true" >
            <div class="content-products-filter__item-title" data-filterTittle="filterTittle">
              <i class="fas fa-long-arrow-alt-right"></i>Тип продукта
            </div>
            ${typeHTML.join('')}
          </li>
        `
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
          ['Мощность'],
          wattsHTML,
        )
      }

      if (type === 'Видеокарты') {

        const seria = [
          "FirePro 2270",
          "FirePro 2460",
          "FirePro S400",
          "FirePro 9150",
          "FirePro 9170",
          "GeForce 210",
          "GeForce GT 1030",
          "GeForce GT 710",
          "GeForce GT 730",
          "GeForce GTX 1050 Ti",
          "GeForce GTX 1060",
          "GeForce GTX 1070 Ti",
          "GeForce GTX 1650",
          "GeForce GTX 1650 Super",
          "GeForce GTX 1660",
          "GeForce GTX 1660 Super",
          "GeForce GTX 1660 Ti",
          "GeForce RTX 2060",
          "GeForce RTX 2060 Super",
          "GeForce RTX 2070",
          "GeForce RTX 2070 Super",
          "GeForce RTX 2080",
          "GeForce RTX 2080 Super",
          "GeForce RTX 2080 Ti",
          "GeForce Titan V",
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
          "Quadro 620",
          "Quadro RTX 4000",
          "Quadro RTX 5000",
          "Quadro RTX 6000",
          "Quadro RTX 8000",
          "Radeon Pro WX 2100",
          "Radeon Pro WX 3100",
          "Radeon Pro WX 5100",
          "Radeon R5 230",
          "Radeon R7 250",
          "Radeon RX 550",
          "Radeon RX 5500 XT",
          "Radeon RX 560",
          "Radeon RX 5600 XT",
          "Radeon RX 570",
          "Radeon RX 5700",
          "Radeon RX 5700 XT",
          "Radeon RX 580",
          "Radeon RX 590"
        ]
        const typeMemory = ['DDR3', 'DDR4', 'GDDR5', 'GDDR5X', 'GDDR6']
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

        const memoryHTML = selectionMemory.map(trainingHTMLList)
        const typeMemoryHTML = typeMemoryArray.map(trainingHTMLList)
        const seriaHTML = seriaArray.map(trainingHTMLList)

        return renderHTMLFilter(
          ['Обьем памяти', 'Тип памяти', 'Серия'],
          memoryHTML,
          typeMemoryHTML,
          seriaHTML
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
          powerSupplyHTML,
          colorHTML
        )
      }
    }

    return ''
  }
}

// Фильтрация товаров по цене
export function filterSortPrice(value,base) {
  let sortDATA = []

  if (!value) {
    sortDATA = base
  }
  else if (value === 'a-b') {
    sortDATA = base.sort((a, b) => a.price - b.price)
  }
  else if (value === 'b-a') {
    sortDATA = base.sort((a, b) => b.price - a.price)
  }

  return sortDATA
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

      const val = new RegExp(item, 'gi')

      if (
        elem.name.match(val)
        ||
        elem.name.toLowerCase().includes(item.toLowerCase())) {

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
          data-checked="false">
          ${item}
        <div class="checkbox-fake--active">&#10003;</div>
      </div>
    </div>
  `
}

function renderHTMLFilter(title, ...content) {

  const htmlStrings = []

  for (let i = 0; i < content.length; i++) {

    if (content[i].length) {

      htmlStrings.push(`
        <li class="content-products-filter__item" data-accardion="true">
          <div class="content-products-filter__item-title" data-filterTittle="filterTittle">
            <i class="fas fa-long-arrow-alt-right"></i>${title[i]}
           </div>
            ${content[i].join('')}
        </li>
      `)
    }
  }

  return htmlStrings.join('')
}