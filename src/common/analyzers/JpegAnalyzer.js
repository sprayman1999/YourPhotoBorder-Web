class JpegAnalyzer{
    constructor(binaryFile){
        this.exif = EXIF.readFromBinaryFile(binaryFile)
        this.binaryFile = binaryFile
        this.rect = this.get_image_rect()
        this.width = this.rect['width']
        this.height = this.rect['height']
        console.log(this.exif)
        
        console.log("camera maker:"+this.get_camera_maker())
        console.log("camera fnumber:"+this.get_camera_fnumber())
        console.log("image artist:"+this.get_image_artist())
        console.log("camera software:"+this.get_camera_software())
        console.log("camera iso:"+this.get_camera_iso())
        console.log("camera model:"+this.get_camera_model())
        console.log("camera maker:"+this.get_camera_maker())
        console.log("camera exposure time:"+this.get_camera_exposure_time())
        console.log("camera focal length:"+this.get_camera_focal_length())
        console.log("camera len:" + this.get_camera_lens())
        console.log("image date:" + this.get_image_date())
        console.log("image orientation:" + this.get_image_orientation())
        console.log("image width:" + this.width)
        console.log("image height:" + this.height)

    }
    setImageName(name){
        this.name = name
    }
    getTag(key){
        return this.exif[key]
    }
    get_camera_maker(){
        return this.exif["Make"]
    }
    get_image_artist(){
        return this.exif['Artist']
    }
    get_image_orientation(){
        return this.exif['Orientation']
    }
    get_camera_focal_length(){
        return Math.trunc(this.exif['FocalLength'])
    }
    get_camera_exposure_time(){
        if (this.exif['ExposureTime'] < 1){
            return "1/" + this.exif['ExposureTime']['denominator']/this.exif['ExposureTime']['numerator']
        }else{
            return this.exif['ExposureTime']+"'"
        }

        
    }
    get_image_date(){
        return this.exif['DateTimeOriginal']
    }
    get_camera_fnumber(){
        return this.exif['FNumber'].toFixed(1)
    }
    get_camera_software(){
        return this.exif['Software']
    }
    get_camera_iso(){
        return this.exif['ISOSpeedRatings']
    }

    get_camera_model(){
        return this.exif['Model']
    }
    get_camera_lens(){
        return this.exif['Lens']
    }
    set_image_rect(width,height){
        console.log("shit")
        this.rect = {'width':width,'height':height}
    }
    get_image_rect(){
        const dataView = new DataView(this.binaryFile);
        let offset = 2; // 跳过 JPEG 文件的 SOI 标记
        while (offset < dataView.byteLength) {
            const marker = dataView.getUint16(offset, false);
            const segmentLength = dataView.getUint16(offset + 2, false);
        
            if (marker === 0xFFC0) { // 找到 SOF0 段（帧标记）
                const height = dataView.getUint16(offset + 5, false);
                const width = dataView.getUint16(offset + 7, false);
                if (this.get_image_orientation() == 8){
                    //竖着
                    return { 'height':width, 'width':height };
                }else{
                    //横着
                    return { 'height':height, 'width':width };
                }
            }
        
            offset += segmentLength + 2; // 跳过当前段，前进到下一个段
        }
    }
    get_width(){
        return this.width
    }
    get_height(){
        return this.height
    }

}
export default{
    JpegAnalyzer
}