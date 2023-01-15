const paintCells = document.getElementsByClassName("cell")
const watermarkChekbox = document.getElementById('watermark-checkbox')
const canvas = document.querySelector('canvas')
const cellsSlider = document.getElementById('cells-slider')
const paintZone = document.getElementById('paint-zone')
const colorSelector = document.getElementById('color-selector')
const colorSelectCheckbox = document.getElementById("select-color")
const canvasSizeShower = document.getElementById("canvas-size-shower")
const eraseButton = document.getElementById("erase-selector-button")
const guideCheckbox = document.getElementById("guide-checkbox")
const borderCheckbox = document.getElementById("border-checkbox")
const cellBorderWidthSlider = document.getElementById("cell-border-width-slider")
const cellBorderWidthShower = document.getElementById("cell-border-width-shower")
const multiplyQButton = document.getElementById("multiply-q-button")
const selectAllCopyTargets = document.getElementById("select-all-copy-targets")
const multiplyQSelector = document.getElementById("multiply-q-selector")
const copyTargetsShower = document.getElementById("copy-targets-shower")
const multiplyTargetCheckboxes = {
    q1MultiplyTargetCheckbox: document.getElementById("q1-multiply-target-checkbox"),
    q2MultiplyTargetCheckbox: document.getElementById("q2-multiply-target-checkbox"),
    q3MultiplyTargetCheckbox: document.getElementById("q3-multiply-target-checkbox"),
    q4MultiplyTargetCheckbox: document.getElementById("q4-multiply-target-checkbox"),
}
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
let borderColor = 'black'
let cellBorderWidth = 1
let currentSelectedColor = colorSelector.value



function recordPaintData() {
    let data = []
    for (var i = 0; i < paintCells.length; i++) {
        data.push(window.getComputedStyle(paintCells[i]).getPropertyValue('background-color'))
    }
    buffer.addItem(data)
    return data
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






colorSelector.addEventListener("input", function() {
    if (currentSelectedColor == '#00000000') {
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
    ctx.lineWidth = cellBorderWidthSlider.value + "px"
    for (let i = 0; i < paintCells.length; i++) {
        let currentCellColor = window.getComputedStyle(paintCells[i]).getPropertyValue('background-color');
        ctx.fillStyle = currentCellColor
        ctx.strokeStyle = 'black'
        ctx.fillRect(currentX, currentY, cellWidth, cellWidth)
        // ctx.stroke()
        // ctx.fill()
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
    ctx.stroke()


    downloadCanvasAsImage(canvas, 'synbits-yj(syn-pixmacr).png')
})

cellsSlider.addEventListener("input", function() {
    canvasSizeShower.innerHTML = `(${this.value})`
})
cellsSlider.addEventListener("change", function() {
    if (confirm(`You will loose your artwork if you resize. Do you really want to resize to ${canvas.width / cellWidth} cell(s) to ${this.value}cell(s)?`)) {
        addCanvas(this.value, this.value)
        if (guideCheckbox.checked) {
            addGuides()
        }
        if (!borderCheckbox.checked) {
            removeBorder()
        }
    } else {
        cellsSlider.value = Math.round(canvas.width / cellWidth)
        canvasSizeShower.innerHTML = `(${Math.round(canvas.width / cellWidth)})`
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

document.getElementById("border-color-button").addEventListener("click", () => {
    borderColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    for (var i = 0; i < paintCells.length; i++) {
        paintCells[i].style.borderColor = borderColor
    }
})

borderCheckbox.addEventListener("input", function() {
    if (this.checked) {
        for (var i = 0; i < paintCells.length; i++) {
            paintCells[i].style.borderWidth = '0.5px'
        }
    } else {
        for (var i = 0; i < paintCells.length; i++) {
            paintCells[i].style.borderWidth = '0'
        }
    }
    if (guideCheckbox.checked) addGuides()

})

guideCheckbox.addEventListener("input", function() {
    if (this.checked) {
        addGuides()
    } else {
        if (borderCheckbox.checked) {
            for (var i = 0; i < paintCells.length; i++) {
                paintCells[i].style.border = `0.5px solid ${borderColor}`
            }
        } else {
            for (var i = 0; i < paintCells.length; i++) {
                paintCells[i].style.border = `0 solid ${borderColor}`
            }
        }
    }
})


function addGuides() {
    let cols = Math.round(canvas.width / cellWidth)
    if (cols % 2 == 1) return
    for (var i = 0; i < paintCells.length; i += (cols / 2)) {
        paintCells[i].style.borderLeft = `1px dashed ${borderColor}`
    }
    let j = 0;
    for (var i = (cols * (cols / 2)); i < paintCells.length; i++) {
        paintCells[i].style.borderTop = `1px dashed ${borderColor}`
        j++
        if (j == cols) break
    }
}


function removeBorder() {
    for (var i = 0; i < paintCells.length; i++) {
        paintCells[i].style.borderWidth = '0'
    }
}

function getQuadrant(arr, quadrant) {
    var rows = arr.length;
    var cols = arr[0].length;
    var midRow = Math.floor(rows / 2);
    var midCol = Math.floor(cols / 2);
    if (quadrant == 1) {
        return arr.slice(0, midRow).map(row => row.slice(0, midCol));
    } else if (quadrant == 2) {
        return arr.slice(0, midRow).map(row => row.slice(midCol));
    } else if (quadrant == 3) {
        return arr.slice(midRow).map(row => row.slice(0, midCol));
    } else if (quadrant == 4) {
        return arr.slice(midRow).map(row => row.slice(midCol));
    } else {
        return null;
    }
}

function squareArray(arr) {
    let size = Math.round(Math.sqrt(arr.length))
    var newArr = [];
    for (var i = 0; i < arr.length; i += size) {
        newArr.push(arr.slice(i, i + size));
    }
    return newArr;
}

function flip2DArrayVertically(arr) {
    var newArr = arr.slice();
    return newArr.reverse();
}

function flip2DArrayHorizontally(arr) {
    var newArr = arr.slice();
    return newArr.map(function(row) {
        return row.slice().reverse();
    });
}


cellBorderWidthSlider.addEventListener("input", () => {
    cellBorderWidthShower.innerHTML = `(${cellBorderWidthSlider.value})`
})

function packQuadrants(quadrant1, quadrant2, quadrant3, quadrant4) {
    var packedArray = [];
    for (var i = 0; i < quadrant1.length; i++) {
        packedArray.push(quadrant1[i].concat(quadrant2[i]));
    }
    for (var i = 0; i < quadrant3.length; i++) {
        packedArray.push(quadrant3[i].concat(quadrant4[i]));
    }
    return packedArray.flat();
}



multiplyQButton.addEventListener("click", () => {
    let qToCopy = multiplyQSelector.value
    let data = squareArray(recordPaintData())
    let qToCopyData = getQuadrant(data, qToCopy)
    let newQ1, newQ2, newQ3, newQ4
    if (qToCopy == 1) {
        newQ1 = qToCopyData
    } else if (qToCopy == 2) {
        newQ1 = flip2DArrayHorizontally(qToCopyData)
    } else if (qToCopy == 3) {
        newQ1 = flip2DArrayVertically(qToCopyData)
    } else if (qToCopy == 4) {
        newQ1 = flip2DArrayHorizontally((flip2DArrayVertically(qToCopyData)))
    }


    if (multiplyTargetCheckboxes.q2MultiplyTargetCheckbox.checked) {
        newQ2 = flip2DArrayHorizontally(newQ1)
    } else {
        newQ2 = getQuadrant(data, 2)
    }
    if (multiplyTargetCheckboxes.q3MultiplyTargetCheckbox.checked) {
        newQ3 = flip2DArrayVertically(newQ1)
    } else {
        newQ3 = getQuadrant(data, 3)
    }

    if (multiplyTargetCheckboxes.q4MultiplyTargetCheckbox.checked) {
        newQ4 = flip2DArrayVertically(newQ2)
    } else {
        newQ4 = getQuadrant(data, 4)
    }
    if (!multiplyTargetCheckboxes.q1MultiplyTargetCheckbox.checked) {
        newQ1 = getQuadrant(data, 1)
    }

    applyPaintData(packQuadrants(newQ1, newQ2, newQ3, newQ4))
    recordPaintData()
})

selectAllCopyTargets.addEventListener("click", () => {
    for (var prop in multiplyTargetCheckboxes) {
        multiplyTargetCheckboxes[prop].checked = true
    }
        updateCopyTargetString()

})

selectAllCopyTargets.addEventListener("dblclick", () => {
    for (var prop in multiplyTargetCheckboxes) {
        multiplyTargetCheckboxes[prop].checked = false
    }
    updateCopyTargetString()
})

for (var prop in multiplyTargetCheckboxes) {
    multiplyTargetCheckboxes[prop].addEventListener("input", updateCopyTargetString)
}


function updateCopyTargetString(){
    let string = ""
    let i = 1
    for (var prop in multiplyTargetCheckboxes) {
        if (multiplyTargetCheckboxes[prop].checked)
            string += `q${i} ,`
        i++
    }
    copyTargetsShower.innerHTML = `(${string.slice(0,-2)})`
}

updateCopyTargetString()