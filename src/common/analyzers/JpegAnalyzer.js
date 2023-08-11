class JpegAnalyzer{
    constructor(binaryFile,exifBinaryFile=null){

        this.exif = EXIF.readFromBinaryFile(binaryFile)
        console.log(this.exif)
        if (this.exif == false || Object.keys(this.exif).length < 5){
            this.exif=null
        }
        if(exifBinaryFile == null){
            this.exifSource=null
        }else{
            this.exifSource = EXIF.readFromBinaryFile(exifBinaryFile)
        }
        
        
        this.binaryFile = binaryFile
        this.exifBinaryFile = exifBinaryFile
        this.rect = this.get_image_rect()
        this.width = this.rect['width']
        this.height = this.rect['height']
        /*
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
        */
    }
    set_image_name(name){
        this.name = name
    }
    get_image_name(name){
        return this.name
    }
    get_tag(key){
        return this.exif[key]
    }
    get_camera_maker(){
        if(this.exifSource != null){
            return this.exifSource['Make']
        }
        if(this.exif == null){
            return ''
        }
        return this.exif["Make"]
    }

    get_image_artist(){
        if(this.exifSource != null){
            
            return this.exifSource['Artist']
        }
        if(this.exif == null){
            return ''
        }
        return this.exif['Artist']
    }
    get_image_orientation(){
        if(this.exif == null){
            return 1
        }
        if('Orientation' in this.exif){
            return this.exif['Orientation']
        }else{
            //啥也没有找到的话 就默认横着
            return 1
        }
        
    }
    get_camera_focal_length(){
        if(this.exifSource != null){
            return Math.trunc(this.exifSource['FocalLength'])
        }
        if(this.exif == null){
            return ''
        }
        return Math.trunc(this.exif['FocalLength'])
    }
    get_camera_exposure_time(){
        if(this.exifSource != null){
            if (this.exifSource['ExposureTime'] < 1){
                return "1/" + this.exifSource['ExposureTime']['denominator']/this.exifSource['ExposureTime']['numerator']
            }else{
                return this.exifSource['ExposureTime']+"'"
            }
        }
        if(this.exif == null){
            return ''
        }
        if (this.exif['ExposureTime'] < 1){
            return "1/" + this.exif['ExposureTime']['denominator']/this.exif['ExposureTime']['numerator']
        }else{
            return this.exif['ExposureTime']+"'"
        }

        
    }
    get_image_date(){
        if(this.exifSource != null){
            return this.exifSource['DateTimeOriginal']
        }
        if(this.exif == null){
            return ''
        }
        return this.exif['DateTimeOriginal']
    }
    get_camera_fnumber(){
        if(this.exifSource != null){
            return  this.exifSource['FNumber'].toFixed(1)
        }
        if(this.exif == null){
            return ''
        }
        return this.exif['FNumber'].toFixed(1)
    }
    get_camera_software(){
        if(this.exifSource != null){
            return this.exifSource['Software']
        }
        if(this.exif == null){
            return ''
        }
        return this.exif['Software']
    }
    get_camera_iso(){
        if(this.exifSource != null){
            return this.exifSource['ISOSpeedRatings']
        }
        if(this.exif == null){
            return ''
        }
        return this.exif['ISOSpeedRatings']
    }

    get_camera_model(){
        if(this.exifSource != null){
            return this.exifSource['Model']
        }
        if(this.exif == null){
            return ''
        }
        return this.exif['Model']
    }
    get_camera_lens(){
        if(this.exifSource != null){
            const indexOfNull = this.exifSource['Lens'].indexOf('\x00');
            return this.exifSource['Lens'].substr(0, indexOfNull)
        }
        if(this.exif == null){
            return ''
        }
        return this.exif['Lens'].split('\x00').join('')
    }
    set_image_rect(width,height){
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