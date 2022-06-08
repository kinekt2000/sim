class Display {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.offsetX = 0
        this.offsetY = 0
        this.scale = 1

        this.buffer  = document.createElement("canvas").getContext("2d");
        this.buffer.translate(canvas.width*0.5, canvas.height*0.5)
        
        this.canvas = canvas
        this.context = canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.buffer.imageSmoothingEnabled = false;

        this.onTransformCallbacks = []
    }

    fireCallbacks(callbacks) {
        callbacks.forEach(callback => {
            callback(this.getArea())
        });
    }

    addOnTransform(callback) {
        this.onTransformCallbacks.push(callback)
    }

    render() {
        this.context.drawImage(
            this.buffer.canvas,
            0,
            0,
            this.buffer.canvas.width,
            this.buffer.canvas.height,
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.buffer.save()
        this.buffer.resetTransform()
        this.buffer.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.buffer.restore()
    }

    getArea() {
        return {
            x: (-this.canvas.width*0.5 - this.offsetX)/this.scale,
            y: (-this.canvas.height*0.5 - this.offsetY)/this.scale,
            w: (this.canvas.width)/this.scale,
            h: (this.canvas.height)/this.scale,
        }
    }

    translate(x, y) {
        this.offsetX += x
        this.offsetY += y
        this.buffer.resetTransform()
        this.buffer.translate(this.canvas.width*0.5+this.offsetX, this.canvas.height*0.5+this.offsetY)
        this.buffer.scale(this.scale, this.scale)

        this.fireCallbacks(this.onTransformCallbacks)
    }

    zoom(val) {
        this.scale += val
        if (this.scale < 0.1) {
            this.scale = 0.1
        }

        if (this.scale > 4) {
            this.scale = 4
        }
        this.translate(0, 0)
    }

    resize(width, height) {
        this.buffer.canvas.height = this.context.canvas.height = height
        this.buffer.canvas.width = this.context.canvas.width = width
        this.buffer.translate(width*0.5 + this.offsetX, height*0.5+this.offsetY)
        this.buffer.scale(this.scale, this.scale)

        this.fireCallbacks(this.onTransformCallbacks)
    }
}

export default Display
