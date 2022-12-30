let paintCells = document.getElementsByClassName("cell")
let watermarkChekbox = document.getElementById('watermark-checkbox')
let canvas = document.querySelector('canvas')
let cellsSlider = document.getElementById('cells-slider')
const paintZone = document.getElementById('paint-zone')
const colorSelector = document.getElementById('color-selector')
const colorSelectCheckbox = document.getElementById("select-color")
const canvasSizeShower = document.getElementById("canvas-size-shower")
const eraseButton = document.getElementById("erase-selector-button")
canvas.height = 1840
canvas.width = 1840
canvas.style.border = '1px solid white'
canvas.style.width = '100%'
canvas.style.boxSizing = 'border-box'
let ctx = canvas.getContext('2d')
let cellWidth
let cellHeight
let prevSelectedColor
let buffer = new Stack()



function recordPaintData() {
    let data = []
    for (var i = 0; i < paintCells.length; i++) {
        data.push(window.getComputedStyle(paintCells[i]).getPropertyValue('background-color'))
    }
    buffer.addItem(data)
}

function applyPaintData(data) {
    for (var i = 0; i < paintCells.length; i++) {
        paintCells[i].style.backgroundColor = data[i]
    }
}

function addCanvas(rows, cols) {
    buffer.clearStack()
    paintZone.innerHTML = ""
    let HTML = ''
    let i = 0
    let elemWidth = 100 / cols
    cellWidth = canvas.width / cols
    cellHeight = cellWidth
    while (i < rows * cols) {
        HTML += `<div class="cell" style="width:${elemWidth}%;height:${elemWidth}vw"></div>`
        i++
    }
    paintZone.innerHTML = HTML
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].addEventListener("click", function() {
            if (!colorSelectCheckbox.checked) {
                recordPaintData()
                this.style.background = currentSelectedColor
            } else {
                for (let i = 0; i < paintCells.length; i++) {
                    paintCells[i].style.borderColor = "black"
                }
                colorSelectCheckbox.checked = false
                colorSelector.value = rgbToHex(buffer.getItem(buffer.data.length - 1)[i])
                currentSelectedColor = colorSelector.value
            }
        })
        // this.style.backgroundColor = buffer.getItem(buffer.data.length - 2)[i]

    }
    recordPaintData()
}

addCanvas(10, 10)




var currentSelectedColor = '#FFFFFF'


colorSelector.addEventListener("input", function() {
    if(currentSelectedColor == '#00000000'){
        eraseButton.value = 'Select Eraser'
    }
    currentSelectedColor = this.value
})

document.getElementById('clear-button').addEventListener("click", () => {
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].style.background = "#00000000"
    }
    recordPaintData()
})

document.getElementById('clear-button').addEventListener("dblclick", () => {
    for (let i = 0; i < paintCells.length; i++) {
        paintCells[i].style.background = currentSelectedColor
    }
    recordPaintData()
})

document.getElementById('export-button').addEventListener("click", () => {
    let currentY = 0
    let currentX = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < paintCells.length; i++) {
        let currentCellColor = window.getComputedStyle(paintCells[i]).getPropertyValue('background-color');
        ctx.fillStyle = currentCellColor
        ctx.fillRect(currentX, currentY, cellWidth, cellWidth)
        currentX += cellWidth
        if (currentX == canvas.width) {
            currentX = 0
            currentY += cellWidth
        }
    }
    if (watermarkChekbox.checked) {
        ctx.fillStyle = 'white'
        ctx.font = '50px Arial'
        ctx.fillText('yj.8bit', canvas.width - cellWidth, currentY - 20, cellHeight - 20)

    }

    downloadCanvasAsImage(canvas, 'synbits/yj(syn-pixel-painter)')
})

cellsSlider.addEventListener("input", function() {
    canvasSizeShower.innerHTML = `(${this.value})`
})
cellsSlider.addEventListener("change", function() {
    if (confirm(`You will loose your artwork if you resize. Do you really want to resize to ${canvas.width / cellWidth} cell(s) to ${this.value}cell(s)?`)) {
        addCanvas(this.value, this.value)
    } else {
        cellsSlider.value = canvas.width / cellWidth
        canvasSizeShower.innerHTML = `(${canvas.width / cellWidth})`
    }
})



function downloadCanvasAsImage(canvas, fileName = 'yj') {
    const dataUrl = canvas.toDataURL();
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}


document.getElementById('undo').addEventListener("click", () => {
    if (buffer.setPointer(buffer.pointer - 1))
        applyPaintData(buffer.getItem())
})

document.getElementById('redo').addEventListener("click", () => {
    if (buffer.setPointer(buffer.pointer + 1))
        applyPaintData(buffer.getItem())
})



function rgbToHex(str) {
    str = str.replace('rgb(', '').replace(')').split(',')
    let r = parseInt(str[0])
    let g = parseInt(str[1])
    let b = parseInt(str[2])
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


colorSelectCheckbox.addEventListener("input", function() {
    if (this.checked) {
        for (let i = 0; i < paintCells.length; i++) {
            paintCells[i].style.borderColor = "red"
        }
    } else {
        for (let i = 0; i < paintCells.length; i++) {
            paintCells[i].style.borderColor = "black"
        }
    }
})

eraseButton.addEventListener("click", function() {
    if (this.value == 'Select Eraser') {
        this.value = 'Unselect Eraser'
        prevSelectedColor = currentSelectedColor
        currentSelectedColor = '#00000000'
    } else {
        currentSelectedColor = prevSelectedColor
        this.value = 'Select Eraser'
    }
})