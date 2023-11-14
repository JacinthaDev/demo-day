let submit = document.querySelector('.submit')
let focusForm= document.querySelector('#focus-form')

focusForm.addEventListener('submit', function(e) {

  // Capture the value of the select element
  let focusValue = document.querySelector('#focus').value
  console.log(focusValue)

  const url = `/api/${focusValue}`
  fetch(url)
  .then(res => res.json())
  .then(data => {
    for (item in data) {
      console.log(item)
    }
  })
})

