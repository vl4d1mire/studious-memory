function element(tagName, classes = [], content) {

    const node = document.createElement(tagName)

    if (classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content
    }
    return node
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function noop() {}

export function upload(selector, options = {}) {

    let files = []

    const onUpload = options.onUpload ?? noop
    const input = document.querySelector(selector)
    const open = element('button', ['btn'], 'Открыть')
    const upload = element('button', ['btn', 'primary'], 'Загрузить')
    const preview = element('div', ['preview'])

    if (options.multi) {
        input.setAttribute('multiple', '')
    }

    if (options.accept.length && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', upload)
    input.insertAdjacentElement('afterend', open)

    const triggerInput = () => input.click()

    const changeHandler = (event) => {
        preview.innerHTML = ''

        if (!event.target.files) {
            return
        }

        files = Array.from(event.target.files)

        files.forEach((file) => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()

            reader.onload = ev => {
                const src = ev.target.result

                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <img src="${src}" alt="${file.name}">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <div class="preview-info">
                            <span>${file.name}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div>
                `)
            }

            reader.readAsDataURL(file)
        })
    }

    const removeHandler = ev => {
        if (!ev.target.dataset.name) {
            return
        }

        const {name} = ev.target.dataset

        files = files.filter(file => file.name !== name)

        const block = preview
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image')

        block.classList.add('removing')
        setTimeout(() => {block.remove()}, 300)
    }

    const clearPreview = (el) => {
        el.style.bottom = '4px'
        el.innerHTML = `<div class="preview-info-progress"></div>`
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files, previewInfo)
    }

    open.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler)
    upload.addEventListener('click', uploadHandler)
}