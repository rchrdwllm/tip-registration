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
                namespace: ['personal-information', 'address-and-contact', 'family', 'education', 'confirmation'],
            },
            to: {
                namespace: ['personal-information', 'address-and-contact', 'family', 'education', 'confirmation'],
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
                namespace: ['personal-information', 'address-and-contact', 'family', 'education', 'confirmation'],
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
                namespace: ['personal-information', 'address-and-contact', 'family', 'education', 'confirmation'],
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
            namespace: 'personal-information',
            beforeEnter(data) {
                if (!document.body.classList.contains('registration-home')) {
                    document.body.classList.add('registration-body');
                    document.body.classList.remove('home-body');
                    sidebar.classList.add('active');
                    updateLink(data.next.namespace);
                    stepHeader.textContent = 'Step 1';
                    retrieveInputs(data.next.namespace);

                    return;
                }

                stepHeader.textContent = 'Step 1';

                updateLink(data.next.namespace);
                retrieveInputs(data.next.namespace);
            },
            beforeLeave(data) {
                const inputs = saveInputs(data.current.container);

                sessionStorage.setItem('personal-information', JSON.stringify({ ...inputs }));
            },
            afterEnter(data) {
                const submitBtn = data.next.container.querySelector('.submit-btn');
                const backBtn = data.next.container.querySelector('.back-btn');
                const showPasswordBtn = data.next.container.querySelector('.show-password-btn');
                const passwordInput = data.next.container.querySelector('input[type="password"]');

                submitBtn.addEventListener('click', () => {
                    if (validateInputs()) {
                        barba.go('/registration/address-and-contact');
                    }
                });
                backBtn.addEventListener('click', () => {
                    barba.go('/');
                });
                showPasswordBtn.addEventListener('click', () => {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        showPasswordBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        `;
                    } else {
                        passwordInput.type = 'password';
                        showPasswordBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        `;
                    }
                });
            },
        },
        {
            namespace: 'address-and-contact',
            beforeEnter(data) {
                if (!document.body.classList.contains('registration-home')) {
                    document.body.classList.add('registration-body');
                    document.body.classList.remove('home-body');
                    sidebar.classList.add('active');

                    stepHeader.textContent = 'Step 2';

                    updateLink(data.next.namespace);
                    retrieveInputs(data.next.namespace);

                    return;
                }

                stepHeader.textContent = 'Step 2';

                updateLink(data.next.namespace);
                retrieveInputs(data.next.namespace);
            },
            beforeLeave(data) {
                const inputs = saveInputs(data.current.container);

                sessionStorage.setItem('address-and-contact', JSON.stringify({ ...inputs }));
            },
            afterEnter(data) {
                const submitBtn = data.next.container.querySelector('.submit-btn');
                const backBtn = data.next.container.querySelector('.back-btn');

                submitBtn.addEventListener('click', () => {
                    if (validateInputs()) {
                        barba.go('/registration/family');
                    }
                });
                backBtn.addEventListener('click', () => {
                    barba.go('/registration/personal-information');
                });
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
                    })
                );
            },
            afterEnter(data) {
                const submitBtn = data.next.container.querySelector('.submit-btn');
                const backBtn = data.next.container.querySelector('.back-btn');

                submitBtn.addEventListener('click', () => {
                    if (validateInputs()) {
                        barba.go('/registration/education');
                    }
                });
                backBtn.addEventListener('click', () => {
                    barba.go('/registration/address-and-contact');
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
                    if (validateInputs()) {
                        barba.go('/registration/confirmation');
                    }
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

                loadRandomStudentNumber();
            },
            afterEnter(data) {
                const home = data.next.container.querySelector('.home-btn');
                home.addEventListener('click', () => {
                    barba.go('/');
                });
            },
            beforeLeave() {
                document.body.classList.remove('confirmation');

                const confirmationLink = document.querySelector('.step-link[data-namespace="confirmation"]');

                confirmationLink.style.opacity = 0.5;

                sessionStorage.clear();
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
    container.querySelectorAll('.input').forEach(el => {
        const clone = el.cloneNode();
        const wrapper = document.createElement('div');

        clone.classList.add('input');

        wrapper.classList.add('input-container');
        wrapper.appendChild(clone);

        el.parentElement.replaceChild(wrapper, el);
    });
    container.querySelectorAll('.select').forEach(el => {
        const clone = el.cloneNode(true);
        const wrapper = document.createElement('div');

        clone.classList.add('select');

        wrapper.classList.add('input-container');
        wrapper.appendChild(clone);

        el.parentElement.replaceChild(wrapper, el);
    });
}

/**
 *
 * @param {HTMLElement} input
 * @returns {boolean} whether the input tag is valid or not.
 */
function validateInput(input) {
    const templates = {
        ':email': /^[\w_\$]+(\.[\w_\$]+)*@[\w_\$]+(\.[\w_\$]+)+$/gi,
        ':non-empty': /\S+/gi,
    };

    const keys = Object.keys(input.dataset);
    const regex = /(?:regex|hint)-(\d)/;
    const indices = new Set();
    keys.forEach(key => {
        const match = regex.exec(key);
        if (match == null) {
            return;
        }

        indices.add(parseInt(match[1]));
    });

    let hasFailed = false;
    for (const index of indices) {
        const regexKey = input.dataset[`regex-${index}`];
        const regexp = Object.prototype.hasOwnProperty.call(templates, regexKey)
            ? templates[regexKey]
            : new RegExp(regexKey, 'gi');
        console.log(Object.prototype.hasOwnProperty.call(templates, regexKey));

        const hint = input.dataset[`hint-${index}`];

        const succeeds = regexp.test(input.value);
        if (!succeeds) {
            input.parentElement.setAttribute('active-hint', hint);
            input.parentElement.classList.add('error');
            hasFailed = true;

            // no foreach :P
            break;
        }
    }

    if (!hasFailed) {
        input.parentElement.classList.remove('error');
    }

    return !hasFailed;
}

function addInputValidations(container) {
    container.querySelectorAll('.input').forEach(el => {
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
            validateInput(el);
        });
    });
    container.querySelectorAll('.select').forEach(el => {
        let previous = el.value;
        el.addEventListener('focus', () => {
            previous = el.value;
        });
        el.addEventListener('change', () => {
            if (previous === el.value) {
                return;
            }

            validateInput(el);
        });
    });
}

function saveInputs(container) {
    const item = {};

    container.querySelectorAll('.input').forEach(input => {
        item[input.name] = input.value;
    });
    container.querySelectorAll('.select').forEach(select => {
        item[select.name] = select.value;
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
        const inputsArr = Object.keys(inputs);

        document.querySelectorAll('input').forEach(el => {
            el.value = inputs[inputsArr.find(input => input === el.name)];
        });

        document.querySelectorAll('select').forEach(select => {
            select.value = inputs[inputsArr.find(input => input === select.name)];
        });
    }
}

function loadRandomStudentNumber() {
    const studentNumber = document.querySelector('#student-number');
    const randomStudentNumber = Math.floor(Math.random() * 10000000);

    studentNumber.textContent = randomStudentNumber;
}

function validateInputs() {
    const inputs = [...document.querySelectorAll('.input'), ...document.querySelectorAll('.select')];
    const isValid = inputs //
        .map(input => validateInput(input))
        .reduce((acc, input) => acc && input, true);

    return isValid;
}

barba.hooks.afterLeave(data => {
    wrapInputs(data.next.container);
    addInputValidations(data.next.container);
});

wrapInputs(namespaceContainer);
addInputValidations(namespaceContainer);
