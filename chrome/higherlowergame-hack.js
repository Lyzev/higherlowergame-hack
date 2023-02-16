let running = false
const answers = new Map()
setup()

const loop = setInterval(() => {
    if (answers.size === 0)
        clearInterval(loop)
    else if (document.getElementsByClassName("term-volume__volume").length !== 0) {
        if (!running)
            start()
        else
            running = false
    }
}, 500)

function setup() {
    const request = new XMLHttpRequest()
    request.open("GET", "http://www.higherlowergame.com/questions/get/general", false)
    request.send()
    const data = JSON.parse(request.responseText)
    for (let i = 0; i < data.length; i++) {
        answers.set(data[i].keyword.toUpperCase(), data[i].searchVolume)
    }
}

function start() {
    running = true
    chrome.storage.local.get(["OnHoverMode"], result => {
        if (result["OnHoverMode"] !== undefined) {
            if (result["OnHoverMode"])
                startHoverMode()
            else
                startAutoMode()
        } else
            running = false
    })
}

function startHoverMode() {
    document.getElementsByClassName("term-actions__button--higher")[0].addEventListener("mouseover", () => {
        let last = document.getElementsByClassName("term-keyword__keyword")[0].innerText
        let lastValue = answers.get(last.substring(1, last.length - 1).toUpperCase())
        let now = document.getElementsByClassName("term-keyword__keyword")[1].innerText
        let nowValue = answers.get(now.substring(1, now.length - 1).toUpperCase())
        if (nowValue >= lastValue) {
            document.getElementsByClassName("term-actions__button--higher")[0].click()
        }
    })
    document.getElementsByClassName("term-actions__button--lower")[0].addEventListener("mouseover", () => {
        let last = document.getElementsByClassName("term-keyword__keyword")[0].innerText
        let lastValue = answers.get(last.substring(1, last.length - 1).toUpperCase())
        let now = document.getElementsByClassName("term-keyword__keyword")[1].innerText
        let nowValue = answers.get(now.substring(1, now.length - 1).toUpperCase())
        if (nowValue < lastValue) {
            document.getElementsByClassName("term-actions__button--lower")[0].click()
        }
    })
}

function startAutoMode() {
    setTimeout(() => {
        chrome.storage.local.get(["Delay"], result => {
            if (result["Delay"] !== undefined) {
                let play = setInterval(() => {
                    if (document.getElementsByClassName("term-volume__volume").length !== 0) {
                        let last = document.getElementsByClassName("term-keyword__keyword")[0].innerText
                        let lastValue = answers.get(last.substring(1, last.length - 1).toUpperCase())
                        let now = document.getElementsByClassName("term-keyword__keyword")[1].innerText
                        let nowValue = answers.get(now.substring(1, now.length - 1).toUpperCase())
                        if (nowValue > lastValue) {
                            document.getElementsByClassName("term-actions__button--higher")[0].click()
                        } else {
                            document.getElementsByClassName("term-actions__button--lower")[0].click()
                        }
                    } else {
                        clearInterval(play)
                    }
                }, result["Delay"])
            } else {
                running = false
            }
        })
    }, 2000)
}