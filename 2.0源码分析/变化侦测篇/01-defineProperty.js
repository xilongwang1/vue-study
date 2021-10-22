let obj = {
	brand: "BMW",
	price: 3000,
};

let car = {}
let val = 3000
Object.defineProperty(car, 'price', {
  enumerable: true,
  configurable: true,
  // writable: false,
  get(){
    console.log('price属性被读取了')
    return val
  },
  set(newVal){
    console.log('price属性被修改了')
    val = newVal
  }
})
car.price
car.price = val;
car['price'] = 500;