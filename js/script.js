const namespaceContainer = document.querySelector('[data-barba-namespace]');
const navLinks = document.querySelectorAll('.step-link');
const stepHeader = document.querySelector('.step-header');
const sidebar = document.querySelector('aside');

barba.use(barbaPrefetch);

barba.init({
    transitions: [
        {
            name: 'opacity-transition',
            leave(data) {
                return gsap.to(data.current.container, {
                    x: '-50%',
                    opacity: 0,
                    display: 'none',
                    ease: 'power4.out',
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    opacity: 0,
                    x: '50%',
                    ease: 'power4.out',
                });
            },
            from: {
                namespace: ['family', 'education', 'confirmation'],
            },
            to: {
                namespace: ['family', 'education', 'confirmation'],
            },
        },
        {
            name: 'left-swipe-transition',
            leave() {
                const slider = document.querySelector('.slider');

                return gsap.to(slider, {
                    x: '0%',
                    ease: 'power4.out',
                    duration: 0.75,
                });
            },
            enter() {
                const slider = document.querySelector('.slider');
                const tl = gsap.timeline();

                tl.to(slider, {
                    x: '-100%',
                    ease: 'power4.out',
                    duration: 0.75,
                });

                tl.set(slider, {
                    x: '100%',
                });
            },
            from: {
                namespace: ['home'],
            },
            to: {
                namespace: ['family', 'education', 'confirmation'],
            },
        },
        {
            name: 'right-swipe-transition',
            leave() {
                const slider = document.querySelector('.slider');

                return gsap.to(slider, {
                    x: '0%',
                    ease: 'power4.out',
                    duration: 0.75,
                });
            },
            enter() {
                const slider = document.querySelector('.slider');
                const tl = gsap.timeline();

                tl.to(slider, {
                    x: '-100%',
                    ease: 'power4.out',
                    duration: 0.75,
                });

                tl.set(slider, {
                    x: '100%',
                });
            },
            from: {
                namespace: ['confirmation', 'family', 'education'],
            },
            to: {
                namespace: ['home'],
            },
        },
    ],
    views: [
        {
            namespace: 'home',
            beforeEnter() {
                document.body.classList.add('home-body');
                document.body.classList.remove('registration-body');
                sidebar.classList.remove('active');
            },
            afterEnter() {
                sidebar.classList.remove('active');
            },
        },
        {
            namespace: 'family',
            beforeEnter(data) {
                if (!document.body.classList.contains('registration-home')) {
                    document.body.classList.add('registration-body');
                    document.body.classList.remove('home-body');
                    sidebar.classList.add('active');

                    stepHeader.textContent = 'Step 3';

                    updateLink(data.next.namespace);
                    retrieveInputs(data.next.namespace);

                    return;
                }

                stepHeader.textContent = 'Step 3';

                updateLink(data.next.namespace);
                retrieveInputs(data.next.namespace);
            },
            beforeLeave(data) {
                const fatherInputsContainer = data.current.container.querySelector('.father');
                const motherInputsContainer = data.current.container.querySelector('.mother');

                const fatherInputs = saveInputs(fatherInputsContainer);
                const motherInputs = saveInputs(motherInputsContainer);

                sessionStorage.setItem(
                    'family',
                    JSON.stringify({
                        fatherInputs,
                        motherInputs,
                    }),
                );
            },
            afterEnter(data) {
                const submitBtn = data.next.container.querySelector('.submit-btn');
                const backBtn = data.next.container.querySelector('.back-btn');

                submitBtn.addEventListener('click', () => {
                    barba.go('/registration/education');
                });
                backBtn.addEventListener('click', () => {
                    barba.go('/');
                });
            },
        },
        {
            namespace: 'education',
            beforeEnter(data) {
                if (!document.body.classList.contains('registration-home')) {
                    document.body.classList.add('registration-body');
                    document.body.classList.remove('home-body');
                    sidebar.classList.add('active');

                    stepHeader.textContent = 'Step 4';

                    updateLink(data.next.namespace);
                    retrieveInputs(data.next.namespace);

                    return;
                }

                stepHeader.textContent = 'Step 4';

                updateLink(data.next.namespace);
                retrieveInputs(data.next.namespace);
            },
            beforeLeave(data) {
                const inputs = saveInputs(data.current.container);

                sessionStorage.setItem('education', JSON.stringify({ ...inputs }));
            },
            afterEnter(data) {
                const submitBtn = data.next.container.querySelector('.submit-btn');
                const backBtn = data.next.container.querySelector('.back-btn');

                submitBtn.addEventListener('click', () => {
                    barba.go('/registration/confirmation');
                });
                backBtn.addEventListener('click', () => {
                    barba.go('/registration/family');
                });
            },
        },
        {
            namespace: 'confirmation',
            beforeEnter(data) {
                updateLink(data.next.namespace);

                stepHeader.textContent = 'Step 5';

                if (!sidebar.classList.contains('active')) {
                    sidebar.classList.add('active');
                }

                document.body.classList.add('confirmation');

                const confirmationLink = document.querySelector('.step-link[data-namespace="confirmation"]');

                confirmationLink.style.opacity = 1;
            },
            afterEnter(data) {
                const home = data.next.container.querySelector('.home-btn');

                home.addEventListener('click', () => {
                    barba.go('/');
                });
            },
            beforeLeave() {
                document.body.classList.remove('confirmation');

                const confirmationLink = document.querySelector(
                    '.step-link[data-namespace="confirmation"]'
                );

                confirmationLink.style.opacity = 0.5;
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

function wrapInputs(container) {
    container.querySelectorAll('input').forEach(el => {
        const clone = el.cloneNode();
        const wrapper = document.createElement('div');

        clone.classList.add('input');

        wrapper.classList.add('input-container');
        wrapper.appendChild(clone);

        el.parentElement.replaceChild(wrapper, el);
    });
}

function addInputValidations(container) {
    container.querySelectorAll('input').forEach(el => {
        const dataset = el.dataset;
        const keys = Object.keys(dataset);

        const regex = /(?:regex|hint)-(\d)/;
        const indices = new Set();
        keys.forEach(key => {
            const match = regex.exec(key);
            if (match == null) {
                return;
            }

            indices.add(parseInt(match[1]));
        });

        let previous = el.value;
        el.addEventListener('focus', () => {
            previous = el.value;
        });
        el.addEventListener('blur', () => {
            /// Assuming that the events go like focus -> blur,
            /// we can check if the value has changed.

            if (previous === el.value) {
                return;
            }

            /// If the data *has* changed, then we should validate.

            /// Flag that indicates whether any validation has failed.
            let hasFailed = false;
            for (const index of indices) {
                const regexp = new RegExp(el.dataset[`regex-${index}`], 'gi');
                const hint = el.dataset[`hint-${index}`];

                const succeeds = regexp.test(el.value);
                if (!succeeds) {
                    el.parentElement.setAttribute('active-hint', hint);
                    el.parentElement.classList.add('error');
                    hasFailed = true;

                    // no foreach :P
                    break;
                }
            }

            if (!hasFailed) {
                el.parentElement.classList.remove('error');
            }
        });
    });
}

function saveInputs(container) {
    const item = {};

    container.querySelectorAll('input').forEach(input => {
        item[input.name] = input.value;
    });

    return item;
}

function retrieveInputs(namespace) {
    const inputs = JSON.parse(sessionStorage.getItem(namespace));

    if (namespace === 'family') {
        const { fatherInputs, motherInputs } = inputs;

        Object.keys(fatherInputs).forEach(input => {
            document.querySelector(`.father input[name="${input}"]`).value = fatherInputs[input];
        });

        Object.keys(motherInputs).forEach(input => {
            document.querySelector(`.mother input[name="${input}"]`).value = motherInputs[input];
        });
    } else {
        Object.keys(inputs).forEach(input => {
            document.querySelector(`input[name="${input}"]`).value = inputs[input];
        });
    }
}

barba.hooks.afterLeave(data => {
    wrapInputs(data.next.container);
    addInputValidations(data.next.container);
});

wrapInputs(namespaceContainer);
addInputValidations(namespaceContainer);
