const ACTIVE_CLASS_NAME = 'active';

//Sections on the page to navigate to in the order they are rendered in the DOM
var sections = ['home', 'about', 'portfolio', 'contact'];

//Set hash tag to first section
var setDefaultHash = function() {
  window.location.hash = '#' + sections[0];
};

//Set a default hash tag if none exists
if (window.location.hash.length <= 1) {
  setDefaultHash();
}

//Initialization
var hash = window.location.hash;
var section = hash.length > 0 ? hash : '#home';
var isScrolling = false;
var last_known_scroll_position = 0;

//Animated scroll to active section (#hash)
var navigateTo = function() {
  hash = window.location.hash;
  var offset = hash.length > 0 ? $('.nav-' + hash.substr(1)).offset().top : '0px';
  isScrolling=true;
  $('html, body').stop().animate({
      scrollTop: offset
    }, {
      complete: function() {
        last_known_scroll_position = window.scrollY;
        isScrolling = false;
      }
  }, 1000);
};

//When the DOM is rendered bind click events to the navigation items
window.addEventListener('DOMContentLoaded', function() {
  var menuItems = document.querySelectorAll('nav a');
  menuItems.forEach(function(mi) {
    if (mi.attributes.href.value === section) {
      mi.classList.add(ACTIVE_CLASS_NAME);
    }
    mi.addEventListener('click', function(evt) {
      menuItems.forEach(function(mx) {
        mx.classList.remove(ACTIVE_CLASS_NAME);
      });
      mi.classList.add(ACTIVE_CLASS_NAME);
    });
  });
});


//When the hash tag in the URL changes, navigate to that section if it is a valid hash.
window.addEventListener('hashchange', function(evt) {
  evt.preventDefault();
  if (sections.indexOf(window.location.hash.substr(1)) === -1) {
    setDefaultHash();
    return;
  }
  navigateTo();
}, false);

//When the user scrolls determine which section to activate and set the hash to that section
window.addEventListener('scroll', function(evt) {
  //Wait for the current scroll animation to finish
  if (isScrolling) {
    evt.preventDefault();
    return;
  }

  var scrollDiff = last_known_scroll_position - window.scrollY;
  var scrollDir = scrollDiff > 0 ? 'up' : 'down';
  
  //Throttle the change of section to 20px, if less don't do anything
  if (Math.abs(scrollDiff) > 20) {
    var currentSection = sections.indexOf(hash.substr(1));
    var newSection = scrollDir === 'up' ?
      (currentSection === 0 ? sections.length - 1 : currentSection - 1) :
      (currentSection === sections.length - 1 ? currentSection : currentSection + 1)
    last_known_scroll_position = window.scrollY;
    window.location.hash = '#' + sections[newSection];
  }
});

navigateTo();
