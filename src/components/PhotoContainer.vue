<template>
    <div>
        <div>
            <canvas :id="canvasId" style="display: none;"></canvas>
        </div>
        <a-layout>
            <a-layout-content>
                <file-upload
                    ref="upload"
                    :entensions="['jpeg','jpg','png']"
                    :drop="true"
                    :maximum="999"
                    :multiple="true"
                    @input-file="inputFile"
                >
                    <a-image :id="previewImgId" :height="previewImgHeight" :width="previewImgWidth"></a-image>
                </file-upload>
            </a-layout-content>
            <a-layout-footer>

                <a-button type="primary" >开始上传</a-button>
                <a-button type="primary" @click="onDownloadButtonClicked">下载图片</a-button>
            </a-layout-footer>
        </a-layout>
        
    </div>
</template>
<script>
import FileUpload from "vue-upload-component";
import JpegAnalyzer from "../common/analyzers/JpegAnalyzer";
import test_canvas from "../common/container/Container";
import PhotoDataStore from "@/common/stores/PhotoData";
import { computed,watch,ref  } from 'vue';
export default{
    setup(){

        
    },
    data(){
        const photoDataStore = PhotoDataStore();
        const receivePhoto = computed(() => photoDataStore.printPhotoData);
        const printPhotoData = {};
        function insertPhoto(data){
            photoDataStore.insertPhoto(data)
            console.log(printPhotoData)
        }
        watch(receivePhoto, (newVal, oldVal) => {
            let newFile = newVal['photo_file']
            const reader = new FileReader();
            reader.onload = () => {
                const binaryData = reader.result;
                console.log("123123",newVal)
                //若存在exif，则需要再read一次exifBinaryData
                if (newVal['has_source_exif'] == true){
                    const exifReader = new FileReader();
                    exifReader.onload = () => {
                        const exifBinaryData = exifReader.result;
                        var analyzer = new JpegAnalyzer.JpegAnalyzer(binaryData,exifBinaryData)
                        analyzer.set_image_name(newFile.name);
                        console.log("fuck")
                        console.log(analyzer);
                        this.start_draw_canvas(newFile,analyzer);
                    }
                    exifReader.readAsArrayBuffer(newVal['source_exif_file'].file);
                    return
                }else{
                    var analyzer = new JpegAnalyzer.JpegAnalyzer(binaryData)
                    analyzer.set_image_name(newFile.name);
                    console.log(analyzer);
                    this.start_draw_canvas(newFile,analyzer);
                }
            }
            reader.readAsArrayBuffer(newFile.file);
        });



        return {
            canvasId: "photo_canvas",
            previewImgId: "image_preview",
            insertPhoto,
            printPhotoData,
            previewImgWidth: 300,
            previewImgHeight: 400,
        }
    },
    methods: {
        // 自定义代码
         start_draw_canvas: async function(imageFile,analyzer){
            const canvasElement = document.getElementById(this.canvasId);
            const imageElement = document.getElementById(this.previewImgId);
            //const configResponse = await fetch("/static/configs/default.json")
            var configResponse = null
            if(analyzer.get_image_orientation() == 1 && analyzer.get_width() > analyzer.get_height()){
                configResponse = await fetch("/static/configs/default.json")
            }else{
                configResponse = await fetch("/static/configs/nikon_rotated.json")
            }
            
            const configContent = await configResponse.text()
            const config = JSON.parse(configContent)
            test_canvas(canvasElement,imageFile,analyzer,config,function callback(){
                imageElement.src = canvasElement.toDataURL()
            });
            
            
        },
        // 事件代码
        inputFile: function(newFile,oldFile){
            
            /*
            console.log(newFile.file)
            const reader = new FileReader();
            reader.onload = () => {
                const binaryData = reader.result;
                var analyzer = new JpegAnalyzer.JpegAnalyzer(binaryData)
                analyzer.set_image_name(newFile.name);
                console.log(analyzer);
                //this.start_draw_canvas(newFile,analyzer);
            }
            reader.readAsArrayBuffer(newFile.file);
            */
           
            this.insertPhoto({'photo_file':newFile})
        },

        onDownloadButtonClicked: function(){
            const canvasElement = document.getElementById(this.$data.canvasId);
            var dataURL = canvasElement.toDataURL("image/jpeg",1.0);

            // 创建一个链接，设置下载属性
            var link = document.createElement("a");
            link.href = dataURL;
            link.download = "canvas_image.jpg"; // 下载文件名

            // 模拟点击链接以触发下载
            link.click();
        },

    },

}
</script>