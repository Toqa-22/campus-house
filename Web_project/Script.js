/* =================================
        funpage JS
   =================================
*/

//Get the canvas by id from the HTML
const canvas = document.getElementById("drawing_canvas");
//Get the canvas the 2D drawing context
const context = canvas.getContext("2d");
//Set variable to check if the user is drawing or not
let painting = false;
//Default drawing color from the color input 
let color = document.getElementById("color").value;
//Default drawing size from the size input
let size = document.getElementById("sizePicker").value;



//Start/Stop drawing
function start_painting() {
    painting = true;
}
function stop_painting() {
    painting = false;
    //new path : stop the current line
    context.beginPath();
}
//if mouse in canvas start drowing
canvas.addEventListener("mousedown", start_painting);
//if mouse up the canvas stop drowing
canvas.addEventListener("mouseup", stop_painting);


//Drawing function
canvas.addEventListener("mousemove", draw);
function draw(e) {
    //if the mouse not pressed then do not drow
    if (!painting){
        return;
    } 

    //Drawing line width
    context.lineWidth = size;
    //Drawing line color
    context.strokeStyle = color;

    //Make line ends are round and smooth
    context.lineCap = "round";

    //Draw a line from the previous point to the current mouse position + Make the line visible
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();

    //Start a new path from the current mouse position
    context.beginPath();
    context.moveTo(e.offsetX, e.offsetY);
}

// Update drowing color
document.getElementById("color").onchange = function() {
    color = this.value;
};

// Update drowing size
document.getElementById("sizePicker").onchange = function() {
    size = this.value;
};

// Clear the drowing box
function clear_canvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}




/* =================================
       
   =================================
*/
