var accordion = document.querySelector('.accordion')
var subsections = accordion.querySelectorAll('.subsection-accordion')
for (var i = 0; i < subsections.length; i++) {
    subsections[i].classList.add('js-subsection-accordion')
}