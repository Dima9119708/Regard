import { changeURL } from "../../core/utils"
import { pagination } from "../../core/pagination"
import { renderCards } from "./renderContent"

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