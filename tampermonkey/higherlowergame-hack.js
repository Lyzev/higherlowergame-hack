// ==UserScript==
// @name         HigherLowerGameHack
// @namespace    https://lyzev.github.io/
// @version      ${version}
// @description  Proof-Of-Concept for a cheat for higher lower game.
// @author       Lyzev
// @match        *://www.higherlowergame.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=higherlowergame.com
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

GM_config.init({
    "id": "HigherLowerGame", title: "HigherLowerGame Settings", "fields": {
        "OnHoverMode": {
            "label": "Only On Button Hover", "type": "checkbox", "default": false
        }, "Delay": {
            "label": "Delay", "type": "unsigned int", "default": 3000
        }
    }, "css": `
 #HigherLowerGame {
     background-color: #282828;
     color: white;
 }
 #HigherLowerGame_header {
     text-shadow: 0 0 15px rgba(255,255,255,.5), 0 0 10px rgba(255,255,255,.5);
 }
 #HigherLowerGame_saveBtn {
     background-color: white;
     color: black;
     border: 2px solid #4CAF50;
     border-radius: 5px;
 }
 #HigherLowerGame_saveBtn:hover {
     background-color: #4CAF50;
     color: white;
     transition-duration: 0.4s;
     cursor: pointer;
 }
 #HigherLowerGame_closeBtn {
     background-color: white;
     color: black;
     border: 2px solid #f44336;
     border-radius: 5px;
 }
 #HigherLowerGame_closeBtn:hover {
     background-color: #f44336;
     color: white;
     transition-duration: 0.4s;
     cursor: pointer;
 }
 #HigherLowerGame .reset {
     color: white;
 }
        `
})

const config = document.createElement("button")
config.innerHTML = "HigherLowerGame Config"
config.style.position = "fixed"
config.style.top = "5px"
config.style.right = "5px"
config.addEventListener("click", () => {
    GM_config.open()
})
document.body.appendChild(config)

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
    request.open("GET", "//www.higherlowergame.com/questions/get/general", false)
    request.send()
    const data = JSON.parse(request.responseText)
    for (let i = 0; i < data.length; i++) {
        answers.set(data[i].keyword.toUpperCase(), data[i].searchVolume)
    }
}

function start() {
    running = true
    if (GM_config.get("OnHoverMode"))
        startHoverMode()
    else
        startAutoMode()
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
        }, GM_config.get("Delay"))
    }, 2000)
}
