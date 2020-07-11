import { $ } from "./Dom"

export function preloader() {

  const preloader = $.create('div', 'lds-roller')
  preloader.setAttribute('data-preloader', true)
  preloader.innerHTML = `
    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  `

  return preloader
}