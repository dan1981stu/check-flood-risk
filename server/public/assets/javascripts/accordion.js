var accordion = document.querySelector('.accordion')
var subsections = accordion.querySelectorAll('.subsection-accordion')
for (var i = 0; i < subsections.length; i++) {

    var subsection = subsections[i]
    subsection.classList.add('js-subsection-accordion')
    var subsectionHeader = subsection.querySelector('.subsection-header')
    var subsectionContent = subsection.querySelector('.subsection-content')
    
    var hyperlink = document.createElement('a')
    hyperlink.href = subsectionHeader.getAttribute('data-href')
    hyperlink.innerHTML = subsectionHeader.innerHTML
    hyperlink.classList.add('subsection-header')

    // Add a element and remove div element
    subsectionHeader.parentNode.insertBefore(hyperlink, subsectionHeader)
    subsectionHeader.parentNode.removeChild(subsectionHeader)

    // Toggle accordion
    hyperlink.addEventListener('click', function(e) {
        e.preventDefault()
        this.parentNode.classList.toggle('subsection-open')
        this.nextElementSibling.classList.toggle('js-hidden')
    })
    
}