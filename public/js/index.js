const socket = io()

const form = document.getElementById('form')
const inputName = document.getElementById('name')
const inputPrice = document.getElementById('price')
const deleteForm = document.getElementById('deleteForm')
const deleteId = document.getElementById('deleteId')
const products = document.getElementById('products')


form.onsubmit = (e) => {
    e.preventDefault();

    const name = inputName.value
    const price = inputPrice.value

    socket.emit('new-product', {name, price})
}

socket.on('array-productos', (arrayProducts) => {
    let infoProducts = ''

    arrayProducts.forEach(p => {
        infoProducts += `Name: ${p.name} - Price: $${p.price} <br/>`
    })

    products.innerHTML = infoProducts
})

deleteForm.onsubmit = (e) => {
    e.preventDefault();

    const id = parseInt(deleteId.value);
    socket.emit("deleteProduct", id);
}