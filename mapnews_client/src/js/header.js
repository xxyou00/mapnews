const menu_bar = document.getElementById('menu_bar')
const head_menu = document.getElementById('head_menu')
const contact_menu_bar = document.getElementById('contact_menu_bar')
const contact_menu = document.getElementById('contact_menu')
menu_bar.addEventListener('click', (e) => {
    menu_bar.classList.toggle('active')
    head_menu.classList.toggle('active')
    if (contact_menu.classList.contains('active')) {
        contact_menu.classList.toggle('active')
    }

})
contact_menu_bar.addEventListener('click', (e) => {
    contact_menu.classList.toggle('active')
})