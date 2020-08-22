export function animate(div, className, time) {

    setTimeout(() => {
        div.classList.add(className)
    }, time)

}
