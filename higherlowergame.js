// ==UserScript==
// @name         HigherLowerGameHack
// @namespace    https://github.com/Lyzev
// @version      1.0
// @description  A cheat for higher lower game.
// @author       Lyzev
// @match        http://www.higherlowergame.com/
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    const delay = 5000
    let running = false
    setInterval(() => {
        if (!running) {
            if (document.getElementsByClassName('term-volume__volume').length !== 0) {
                start();
            }
        }
    }, 500)
    function start() {
        running = true
        setTimeout(() => {
            const request = new XMLHttpRequest();
            request.open("GET", 'http://www.higherlowergame.com/questions/get/general', false);
            request.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36')
            request.send();
            const data = JSON.parse(request.responseText)
            if (data != null) {
                let play = setInterval(() => {
                    if (document.getElementsByClassName('term-volume__volume').length !== 0) {
                        let a = document.getElementsByClassName('term-keyword__keyword')[0].innerText
                        let one = search(data, a.substring(1, a.length - 1))
                        let b = document.getElementsByClassName('term-keyword__keyword')[1].innerText
                        let two = search(data, b.substring(1, b.length - 1))
                        if (two > one) {
                            document.getElementsByClassName('term-actions__button--higher')[0].click()
                        } else {
                            document.getElementsByClassName('term-actions__button--lower')[0].click()
                        }
                    } else {
                        clearInterval(play)
                        running = false
                    }
                }, delay)
            }
        }, 2000)
    }
    function search(data, a) {
        for (let i = 0; i < data.length; i++) {
            if (a.toUpperCase() === data[i].keyword.toUpperCase()) {
                return data[i].searchVolume
            }
        }
        return -1
    }
})()