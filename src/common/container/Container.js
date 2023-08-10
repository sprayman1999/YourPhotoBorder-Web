function draw_image_to_canvas(canvas_ctx,imageFile){
    const reader = new FileReader();
    reader.onload = () => {
        var img = new Image();
        img.src = reader.result;
        //console.log(reader.result)
        
        img.onload = () => {
            canvas_ctx.drawImage(img,0,0)
        }
        canvas_ctx.drawImage(img,0,0)
    }
    reader.readAsDataURL(imageFile.file);
}
function test_canvas(canvas_element,imageFile,analyzer){
    const canvas_ctx = canvas_element.getContext("2d");
    draw_image_to_canvas(canvas_ctx,imageFile)
}
export default test_canvas;