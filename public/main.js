let submit = document.querySelector('.submit')
let focusForm= document.querySelector('#focus-form')

focusForm.addEventListener('submit', function(e) {
  // Capture the value of the select element
  console.log('hi')
  let focusValue = document.querySelector('#focus').value
  console.log(focusValue)

  const url = `/api/${focusValue}`
  fetch(url)
  .then(res => res.json())
  .then(data => {
    document.querySelector(".focus-p").innerText = data['doorway stretch']['instructions']
      
  })

})

