// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


  // map content starts from here
  var map = L.map('map').setView([lat, lon], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


const customMarker = L.divIcon({
    className: 'custom-marker',
    iconSize: [30, 42]
});
  

const marker = L.marker([lat, lon], { icon: customMarker }).addTo(map);

  


  // Add a popup to the marker
  marker.bindPopup(place).openPopup();
  