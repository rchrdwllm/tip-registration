const navLinks = document.querySelectorAll('.step-link');

barba.init({
    transitions: [
        {
            name: 'opacity-transition',
            leave(data) {
                return gsap.to(data.current.container, {
                    y: '-50%',
                    opacity: 0,
                    display: 'none',
                    ease: 'power4.out',
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    opacity: 0,
                    y: '50%',
                    ease: 'power4.out',
                });
            },
        },
    ],
    views: [
        {
            namespace: 'family',
            beforeEnter(data) {
                updateLink(data.next.namespace);
            },
        },
        {
            namespace: 'education',
            beforeEnter(data) {
                updateLink(data.next.namespace);
            },
        },
    ],
});

function updateLink(namespace) {
    navLinks.forEach(link => {
        const linkNamespace = link.dataset.namespace;

        if (linkNamespace === namespace) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.querySelectorAll('[data-regex]').forEach(input => {
    input.addEventListener('blur', () => {
        const regexp = new RegExp(input.dataset.regex, 'gi');
        const succeeds = regexp.test(input.value);

        if (!succeeds) {
            input.parentElement.classList.add('error');
        } else {
            input.parentElement.classList.remove('error');
        }
    });
});
