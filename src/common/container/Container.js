//import {loadImage} from "../utils.js";
function test_canvas(canvasElement,imageFile,analyzer,config,callback){
    new Container(canvasElement,imageFile,analyzer,config,callback)
}
class Container{
    constructor(canvasElement,imageFile,analyzer,config,callback){
        this.canvasElement = canvasElement
        this.imageFile = imageFile
        this.analyzer = analyzer
        this.config = config
        this.callback = callback
        this.canvasCtx = canvasElement.getContext("2d");
        //初始化信息
        this.fix_basic_config() //必须第一个执行

        this.custom_rect = {"left":0,"top":this.analyzer.get_height(),"width":this.analyzer.get_width(),"height":this.config['extra_length'] + this.config['border_size']}
        
        this.fix_labels_config()
        this.fix_photos_config()
        this.init_canvas_rect()
        

        //照片绘画到canvas上,然后在回调里面进一步把配置中的照片也画上去
        this.draw_image_to_canvas()
        //标签绘画到canvas上
        //this.draw_labels_to_canvas()
        this.test()
    }
    async _drawTextWithExternalFont(canvasCtx, text, fontSize, x, y, color, externalFontPath) {
        
        const ctx = canvasCtx;
        const myFont = new FontFace('myFont', 'url(' + externalFontPath + ')')
        await myFont.load().then(font => {
            document.fonts.add(font)
        }).then(() => {
            // 保存当前字体设置
            const originalFont = ctx.font;
            ctx.fillStyle= color;
            ctx.font= fontSize + 'px myFont';

            //填充字符串
            ctx.fillText(text, x, y);
            //restore
            ctx.font = originalFont
            
        })

    }
    test(){
        console.log("this.custom_rect: ",this.custom_rect)
        console.log("this.config: ",this.config)
    }
    fix_basic_config(){
        this.config['extra_length'] = parseFloat(this.config['extra_length']) / 100 * this.analyzer.get_height()

        // 替换文本
        // todo
    }
    fix_photos_config(){
        for(const key in this.config['photos']){
            this.config['photos'][key]['scale'] = parseFloat(this.config['photos'][key]['scale']) / 100 * this.analyzer.get_width();
            this.config['photos'][key]['position_offset'][0] = parseFloat(this.config['photos'][key]['position_offset'][0]) / 100 * this.analyzer.get_width();
            this.config['photos'][key]['position_offset'][1] = parseFloat(this.config['photos'][key]['position_offset'][1]) / 100 * this.analyzer.get_height()
        }
    }
    fix_labels_config(){
        for(const key in this.config['labels']){
            this.config['labels'][key]['font_size'] = parseFloat(this.config['labels'][key]['font_size']) / 100 * this.analyzer.get_height();
            this.config['labels'][key]['position_offset'][0] = parseFloat(this.config['labels'][key]['position_offset'][0]) / 100 * this.analyzer.get_width();
            this.config['labels'][key]['position_offset'][1] = parseFloat(this.config['labels'][key]['position_offset'][1]) / 100 * this.analyzer.get_height() + this.config['labels'][key]['font_size'] / 2;
        }
    }
    init_canvas_rect(){
        this.canvasElement.width = this.analyzer.get_width()
        this.canvasElement.height = this.analyzer.get_height() + this.config['border_size'] * 2 + this.config['extra_length']
        this.canvasCtx.fillStyle = "white";
        this.canvasCtx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
    replace_label_content(content){
        let new_content = content
        new_content = new_content.split("${CAMERA_MODEL}").join(this.analyzer.get_camera_model())
        new_content = new_content.split("${CAMERA_ISO}").join(this.analyzer.get_camera_iso())
        new_content = new_content.split("${APERTURE}").join(this.analyzer.get_camera_fnumber())
        new_content = new_content.split("${EXPOSURE_TIME}").join(this.analyzer.get_camera_exposure_time())
        new_content = new_content.split("${FOCAL_LENGTH}").join(this.analyzer.get_camera_focal_length())
        new_content = new_content.split("${CAMERA_LENS_MODEL}").join(this.analyzer.get_camera_lens())
        new_content = new_content.split("${CAMERA_MODEL}").join(this.analyzer.get_camera_model())
        new_content = new_content.split("${CAMERA_MODEL}").join(this.analyzer.get_camera_model())
        new_content = new_content.split("${PHOTO_ORIGINAL_DATETIME}").join(this.analyzer.get_image_date())
        return new_content
    }
    async draw_labels_to_canvas(){
        for(const key in this.config['labels']){
            let label_config = this.config['labels'][key];
            let label_name = label_config['label_name']
            let font_path = label_config['font_path']
            let font_size = label_config['font_size']
            let content = this.replace_label_content(label_config['content'])
            let position_offset = label_config['position_offset']
            let font_color = label_config['font_color']
            await this._drawTextWithExternalFont(
                this.canvasCtx,content,
                font_size,
                position_offset[0] + this.custom_rect['left'],
                position_offset[1] + this.custom_rect['top'],
                "black",
                font_path
            )
        }
        this.callback()
        
    }
    draw_photos_to_canvas(){
        const imageArray = new Array(this.config['photos'].length);
        const promiseArray = new Array(this.config['photos'].length);
        for(var i = 0;i<imageArray.length;i++){
            imageArray[i] = new Image();
            imageArray[i].src = this.config['photos'][i]['path']
            promiseArray[i] = this.load_image(imageArray[i])
        }
        Promise.all(promiseArray).then(
            images => {
                for(var i = 0;i<imageArray.length;i++){
                    this.canvasCtx.drawImage(
                        images[i],
                        this.config['photos'][i]['position_offset'][0] + this.custom_rect['left'],
                        this.config['photos'][i]['position_offset'][1] + this.custom_rect['top'],
                        this.config['photos'][i]['scale'],
                        images[i].height / images[i].width * this.config['photos'][i]['scale']
                    )
                }
                this.draw_labels_to_canvas()
            }
        )
        .catch(error => {
            console.error("An error occurred while loading images:", error);
        });
    }
    draw_image_to_canvas(){
        
        const reader = new FileReader();
        reader.onload = () => {

            var img = new Image();
            img.src = reader.result;

            Promise.all([this.load_image(img)])
                .then(images => {
                    this.canvasCtx.drawImage(images[0],this.config['border_size'],this.config['border_size'])
                    this.draw_photos_to_canvas()
                    
                    //this.callback()
                })
                .catch(error => {
                    console.error("An error occurred while loading images:", error);
            });
        }
        reader.readAsDataURL(this.imageFile.file);
    }
    load_image(img) {
        return new Promise((resolve, reject) => {
            img.onload = function() {
                resolve(img);
            };
            img.onerror = function() {
                reject(new Error(`Failed to load image: ${img.src}`));
            };
        });
    }

}
export default test_canvas;
