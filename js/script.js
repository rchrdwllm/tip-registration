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
                retrieveInputs(data.next.namespace);
                S;
            },
            afterLeave(data) {
                wrapInputs(data.next.container);
                addInputValidations(data.next.container);
            },
            beforeLeave(data) {
                const fatherInputsContainer = data.current.container.querySelector('.father');
                const motherInputsContainer = data.current.container.querySelector('.mother');

                const fatherInputs = saveInputs(fatherInputsContainer, 'fatherInputs');
                const motherInputs = saveInputs(motherInputsContainer, 'motherInputs');

                sessionStorage.setItem(
                    'family',
                    JSON.stringify({
                        fatherInputs,
                        motherInputs,
                    })
                );
            },
        },
        {
            namespace: 'education',
            beforeEnter(data) {
                updateLink(data.next.namespace);
            },
            afterLeave(data) {
                wrapInputs(data.next.container);
                addInputValidations(data.next.container);
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
        const indices = keys
            .map(v => {
                const match = regex.exec(v);
                if (match == null) {
                    return null;
                }

                return parseInt(match[1]);
            })
            .reduce((a, b) => {
                a.add(b);

                return a;
            }, new Set());

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

function saveInputs(container, name) {
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

wrapInputs(document);
addInputValidations(document);
