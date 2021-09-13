/*jshint esversion: 6 */

/** Modal window activity **/
// Enum of possible states of modal window
const MODAL_WINDOW_CLASS_LIST = {
    MODAL_POPUP: 'modal-popup',
    MODAL_POPUP_ACTIVE: 'modal-popup--active',
    MODAL_POPUP_HAS_SCROLL: 'modal-popup--has-scroll',
    MODAL_POPUP_DIALOG_BODY: 'modal-popup__dialog-body',
    TRIGGER_OPEN: 'js-modal-popup-open',
    TRIGGER_CLOSE: 'js-modal-popup-close'
};

// Event listener for a landing page
document.addEventListener('click', (event) => {
    "use strict";
    // If pressed button for opening registration form
    if (event.target.closest(`.${MODAL_WINDOW_CLASS_LIST.TRIGGER_OPEN}`)) {


        event.preventDefault();


        const target = event.target.closest(`.${MODAL_WINDOW_CLASS_LIST.TRIGGER_OPEN}`);
        const modalId = target.getAttribute('href').replace('#', '');
        const modal = document.getElementById(modalId);


        // Lock page scroll (because of possibility of scrolling registration form)
        document.body.style.paddingRight = `${getScrollbarWidth()}px`;
        document.body.style.overflow = 'hidden';

        // Show registration form
        modal.classList.add(MODAL_WINDOW_CLASS_LIST.MODAL_POPUP_ACTIVE);
    }

    // If pressed close button or we clicked outside of the form
    if (event.target.closest(`.${MODAL_WINDOW_CLASS_LIST.TRIGGER_CLOSE}`) ||
    event.target.classList.contains(MODAL_WINDOW_CLASS_LIST.MODAL_POPUP_ACTIVE)) {

        event.preventDefault();

        // "Finding" active modal popup
        const modal = event.target.closest(`.${MODAL_WINDOW_CLASS_LIST.MODAL_POPUP_ACTIVE}`);

        // Make form hidden
        modal.classList.remove(MODAL_WINDOW_CLASS_LIST.MODAL_POPUP_ACTIVE);

        // Allow scrolling back
        modal.addEventListener('transitionend', showScroll);
    }
});

// Measure width of scroll bar (by adding and removing hidden element)
const getScrollbarWidth = () => {
    "use strict";
    const item = document.createElement('div');

    item.style.position = 'absolute';
    item.style.top = '-9999px';
    item.style.width = '50px';
    item.style.height = '50px';
    item.style.overflow = 'scroll';
    item.style.visibility = 'hidden';

    document.body.appendChild(item);
    const scrollBarWidth = item.offsetWidth - item.clientWidth;
    document.body.removeChild(item);

    return scrollBarWidth;
};

// Allow page scrolling back
const showScroll = (event) => {
    "use strict";
    if (event.propertyName === 'transform') {
        document.body.style.paddingRight = '';
        document.body.style.overflow = 'visible';

        event.target.closest(`.${MODAL_WINDOW_CLASS_LIST.MODAL_POPUP}`).removeEventListener('transitionend', showScroll);
    }
};


/** Navigation activity **/

// Enum of possible states of navigation bar items
const NAV_BAR_CLASS_LIST = {
    NAV_ITEM_ACTIVE: "nav-wrapper__item-link--active",
    NAV_BAR_FIXED: "header--sticky",
    NAV_BAR_SCROLL_UP_ACTIVE: "scroll-up--active"

};
// Highlight watchable section

// setting up section observer
const observer = new IntersectionObserver((entries) => {
    "use strict";
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.nav-wrapper__item-link').forEach((link) => {
                link.classList.toggle(NAV_BAR_CLASS_LIST.NAV_ITEM_ACTIVE,
                    entry.target.id === link.getAttribute('href').replace('#', ''));
            });
        }
    });
    }, {threshold: 0.7});


// observing each section
document.querySelectorAll('.section-outer').forEach((section) => {
    "use strict";
    observer.observe(section);
});


// header appearance after scrolling down
window.onscroll = () => {
    "use strict";
    let header = document.querySelector('header');
    let scroll_up = document.querySelector('.scroll-up');

    if (window.pageYOffset > header.offsetHeight) {
        header.classList.add(NAV_BAR_CLASS_LIST.NAV_BAR_FIXED);
        scroll_up.classList.add(NAV_BAR_CLASS_LIST.NAV_BAR_SCROLL_UP_ACTIVE);
    }
    else if (window.pageYOffset === header.offsetTop){
        header.classList.remove(NAV_BAR_CLASS_LIST.NAV_BAR_FIXED);
        scroll_up.classList.remove(NAV_BAR_CLASS_LIST.NAV_BAR_SCROLL_UP_ACTIVE);
    }
};

// smooth scrolling after clicking on nav or scroll-up

document.querySelector('.nav-wrapper').addEventListener('click', (event) => {
    "use strict";


    if (event.target.classList.contains('nav-wrapper__item-link')) {
        event.preventDefault();

        const id = event.target.getAttribute('href').replace('#', '');
        window.scrollTo({
            top: document.getElementById(id).offsetTop,
            behavior: "smooth"
        });
    }
});

document.querySelector('.scroll-up').addEventListener('click', (event) => {
    "use strict";
    event.preventDefault();
    event.target.classList.remove(NAV_BAR_CLASS_LIST.NAV_BAR_SCROLL_UP_ACTIVE);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});