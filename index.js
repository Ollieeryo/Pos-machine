// 3.變數宣告
const menu = document.getElementById('menu')
const cart = document.getElementById('cart')
const totalAmount = document.getElementById('total-amount')
const button = document.getElementById('submit-button')

let productData = []
let cartItems = []
let total = 0

// 4.GET API 菜單產品資料
// 非同步處理函式 axios
axios.get('https://ac-w3-dom-pos.firebaseio.com/products.json')
  .then(res => {
    productData = res.data
    displayProduct(productData);
  })
  .catch((err) => console.log(err))


// 5.將產品資料加入菜單區塊


function displayProduct(products) {
  products.forEach(product => menu.innerHTML += `
    <div class="col-3">
       <div class="card">
          <img src=${product.imgUrl} class="card-img-top" alt="..." data-id="${product.id}">
          <div class="card-body" data-id="${product.id}">
            <h5 class="card-title" data-id="${product.id}">${product.name}</h5>
            <p class="card-text" data-id="${product.id}">${product.price}</p>
            <a href="#" class="btn btn-primary" data-id="${product.id}">加入購物車</a>
          </div>
        </div>
      </div>
  `)
}

// 6.加入購物車
function addToCart(event) {
  // 找到觸發event的node元素，並得到其產品id
  const id = event.target.dataset.id
  // 錯誤處理
  if (!id) return

  // 在productData的資料裡，找到點擊的產品資訊，加入 cartItems
  //  find 找到點擊 id 的 元素
  const addedProduct = productData.find(product => product.id === id)
  const name = addedProduct.name
  const price = addedProduct.price

  // 加入購物車變數cartItems 分：有按過、沒按過
  const targetItem = cartItems.find(item => item.id === id)

  if (targetItem) {
    targetItem.quanaity += 1
  } else {
    cartItems.push({
      id: id,
      name: name,
      price: price,
      quanaity: 1,
    })
  }
  // 畫面顯示購物車清單
  renderCart(cartItems)

  // 計算總金額
  calTotoal(price)

}

// 7.計算總金額函式
function calTotoal(price) {
  total += price
  totalAmount.textContent = total
}

// 渲染購物車清單函式
function renderCart(cartItems) {
  cart.innerHTML = cartItems.map(item => `
    <li class="list-group-item">
    ${item.name} X ${item.quanaity} 小計：${item.price * item.quanaity} 
    <button class="btn btn-primary btn-sm plus-button" type="button" data-id=${item.id}>+</button>
    <button class="btn btn-primary btn-sm minus-button" type="button" data-id=${item.id}>-</button>
    </li>
    `).join('')
}

// 8.送出訂單
function submit(event) {
  const eachProductName = cartItems.map(item => `${item.name} X ${item.quanaity}`).join('\n')
  const totalConent = totalAmount.textContent
  if (total === 0) {
    return alert('購物車是空的')
  } else {
    return alert(`感謝購買!\n${eachProductName}\n總金額: ${total} 元`)
  }
}

// 9.重置資料
function reset(event) {
  cartItems = []
  cart.innerHTML = ''
  total = 0
  totalAmount.textContent = '--'
}

//11. 處理 + - 按鈕增減購物車項目
function changeItem(event) {
  const id = event.target.dataset.id
  // 錯誤處理
  if (!id) return
  const item = cartItems.find(item => item.id === id)
  const price = item.price

  if (event.target.matches('.plus-button') && item) {
    item.quanaity += 1
    // 渲染購物車
    renderCart(cartItems)
    // 重新計總金額
    calTotoal(price)
  }

  if (event.target.matches('.minus-button') && item && item.quanaity > 1) {
    item.quanaity -= 1
    // 渲染購物車
    renderCart(cartItems)
    // 重新計總金額
    minusTotal(price)
  } else if (event.target.matches('.minus-button') && item && item.quanaity === 1) {
    item.quanaity -= 1
    // 找父元素
    const cartElement = event.target.parentElement
    // 找點擊物件的 array.index
    const index = cartItems.indexOf(item)
    cartElement.remove()
    // 刪除點擊物件
    cartItems.splice(index, 1)
    // 重新計總金額
    minusTotal(price)
  }
}

// 12.減少總金額
function minusTotal(price) {
  total -= price
  totalAmount.textContent = total
}

// 10. 加入事件監聽
menu.addEventListener('click', addToCart)
button.addEventListener('click', event => {
  submit(event)
  reset(event)
})
cart.addEventListener('click', changeItem)


// 13. 清空購物車
const delButton = document.querySelector('.delete-cart')
function delCart(event) {
  reset(event)
  return alert('購物車已被清空')
}
delButton.addEventListener('click', delCart)