const onHoverMode = document.querySelector("#OnHoverMode")

chrome.storage.local.get(["OnHoverMode"], result => {
    if (result["OnHoverMode"] !== undefined)
        onHoverMode.checked = result["OnHoverMode"]
    else {
        onHoverMode.checked = false
        chrome.storage.local.set({["OnHoverMode"]: false})
    }
})

onHoverMode.addEventListener("change", event => {
    chrome.storage.local.set({["OnHoverMode"]: event.target.checked})
})

const delay = document.querySelector("#Delay")

chrome.storage.local.get(["Delay"], result => {
    if (result["Delay"] !== undefined)
        delay.value = result["Delay"]
    else {
        delay.value = 3000
        chrome.storage.local.set({["Delay"]: 3000})
    }
})

delay.addEventListener("change", event => {
    chrome.storage.local.set({["Delay"]: event.target.value})
})