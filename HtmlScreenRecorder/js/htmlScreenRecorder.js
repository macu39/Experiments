class Background{

    constructor() {
        this._createBackground()
    }

    _createBackground(){
        this.background = document.createElement("img")
        this.background.style.position = "absolute"
        //TODO set size z-index etc
        this.hideBackground()
        document.body.appendChild(this.background)
    }

    showBackground(){
        this.visible = "visible"
        this.background.style.visibility = this.visible
    }

    hideBackground(){
        this.visible = "hidden"
        this.background.style.visibility = this.visible
    }

    toogleBackground(){
        if (this.visible == "visible") {
            this.hideBackground()
        }
        if (this.visible == "hidden") {
            this.showBackground()
        } 
    }

    changeBackground(img){
        this.selector.style.Background = img //TODO
    }

    resetBackground(){
        //TODO remove the background and put it to black
    }

}

class Pointer{

    constructor(pointerImg) {
        this._createPointer(pointerImg)
    }

    _createPointer(pointerImg){
        this.pointer = document.createElement("img")
        this.pointer.setAttribute("src", pointerImg)
        this.pointer.style.position = "absolute"
        this.hidePointer()
        this.movePointer(0, 0)
        document.body.appendChild(this.pointer)
    }

    showPointer(){
        this.visible = "visible"
        this.pointer.style.visibility = this.visible
    }

    hidePointer(){
        this.visible = "hidden"
        this.pointer.style.visibility = this.visible
    }

    tooglePointer(){
        if (this.visible == "visible") {
            this.hidePointer()
        }
        if (this.visible == "hidden") {
            this.showPointer()
        } 
    }

    movePointer(x, y){
        this.x = x
        this.y = y
        this.pointer.style.left = this.x
        this.pointer.style.top = this.y
    }

    resetPointer(){
        this.movePointer(0,0)
    }

}

class Recording{

    constructor(selector, pointerImg) {
        this.selector = selector;
        this.recording = []
        this.startTime = 0
        this.isPlaying = false
        this.currentFrame = 0
        this.pointer = new Pointer(pointerImg)
        this.background = new Background(selector)
        this._createDownloadElement()
    }

    startRecording(){
        this.recording = []
        this.startTime = new Date().getTime()
        this.pointer.hidePointer()
        this.background.hideBackground()

        this.observer = new MutationObserver(this._handleBackgroundChange.bind(this));
        const config = { attributes: true, childList: true, subtree: true };
        this.observer.observe(this.selector, config);

        this.clickListener =  this._handleClick.bind(this)
        this.selector.addEventListener("click", this.clickListener);
        this.moveListener = this._handleMouseMove.bind(this)
        this.selector.addEventListener("mousemove", this.moveListener);
        this.scrollListener = this._handleBackgroundChange.bind(this)
        this.selector.addEventListener("scroll", this.scrollListener);
        this.resiezeListener = this._handleBackgroundChange.bind(this)
        window.addEventListener("resize", this.resiezeListener);
    }

    stopRecording(){
        this.observer.disconnect()
        this.selector.removeEventListener("click", this.clickListener);
        this.selector.removeEventListener("mousemove", this.moveListener);
        this.selector.removeEventListener("scroll", this.scrollListener);
        window.removeEventListener("resize", this.resiezeListener);
    }

    playRecording(){
        if (!this.isPlaying){
            this.stopRecording()
            this.isPlaying = true
            this.pointer.resetPointer()
            this.pointer.showPointer()
            this.background.resetBackground()
            this.background.showBackground()
            this._executeFrames(this.currentFrame)
        }
    }

    pauseRecording(){
        this.isPlaying = false
    }

    stopPlayRecording(){
        this.isPlaying = false
        this.currentFrame = 0
        this.pointer.hidePointer()
        this.background.hideBackground()
    }

    downloadRecording(fileName){
        let blob = new Blob([JSON.stringify(this.recording)], {type: "octet/stream"})
        let url = window.URL.createObjectURL(blob);

        this.download.href = url;
        this.download.download = fileName;
        this.download.click();
            
        window.URL.revokeObjectURL(url);
    }

    loadRecording(recording){
        this.recording = recording
    }

    _createDownloadElement(){
        this.download = document.createElement("a");
        this.download.style = "display: none";
        document.body.appendChild(this.download);
    }

    _handleClick(e){
        var event = {
            t: "c", //click
            x: e.pageX,
            y: e.pageY,
            d: this._getDuration(),
        }
        this.recording.push(event)
        console.log(event);
    }

    _handleMouseMove(e){
        var event = {
            t: "m", //mousemove
            x: e.pageX,
            y: e.pageY,
            d: this._getDuration(),
        }
        this.recording.push(event)
        console.log(event);
    }

    _handleBackgroundChange(e){
        var event = {
            t: "b", //background change
            i: "x",
            d: 0,
        }
        this.recording.push(event)
        console.log(event);
    }

    _getDuration(){
        let now = new Date().getTime()
        let duration =  now - this.startTime
        this.startTime = now
        return duration
    }

    _executeFrames(index){

        this.currentFrame = index

        let frame = this.recording[index]
        console.log(frame)
    
        if (frame.t == "c") {
           //TODO click
        }
        if (frame.t == "m") {
            this.pointer.movePointer(frame.x, frame.y)
        }
        if (frame.t == "b") {
            //TODO background change
         }
    
        // Call recursion after a delay
        setTimeout(function() {
            if(this.isPlaying){
                if (index < this.recording.length-1){
                    this._executeFrames(index+1);
                }else{
                    this.stopPlayRecording()
                }
            }
        }.bind(this), frame.duration);
    
    }

}