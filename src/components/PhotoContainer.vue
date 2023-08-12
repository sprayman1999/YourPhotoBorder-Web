<template>
    <div>
        <div>
            <canvas :id="canvasId" style="display: none;"></canvas>
        </div>
        <div>
        </div>
        <file-upload
            style="width:100%;height:387px;"
            :entensions="['jpeg','jpg','png']"
            :drop="true"
            :maximum="999"
            :multiple="true"
            @input-file="inputFile"
        >
            <a-image :id="previewImgId" width="100%" height="100%" fit="scale-down"></a-image>
            <!--<a-image :id="previewImgId" :height="previewImgHeight" :width="previewImgWidth"></a-image>-->
        </file-upload>
    </div>
</template>
<script>
import FileUpload from "vue-upload-component";
import JpegAnalyzer from "../common/analyzers/JpegAnalyzer";
import test_canvas from "../common/container/Container";
import PhotoDataStore from "@/common/stores/PhotoDataStore";
import { computed,watch,ref  } from 'vue';
export default{
    setup(){

        return {

        }
        
    },
    data(){
        const photoDataStore = PhotoDataStore();
        const receivePhoto = computed(() => photoDataStore.printPhotoData);
        const printPhotoData = {};
        function insertPhoto(data){
            photoDataStore.insertPhoto(data)
        }
        watch(receivePhoto, (newVal, oldVal) => {
            
            let imageDataMap = newVal['image_data']
            let config = newVal['config']
            let newFile = imageDataMap['photo_file']
            const reader = new FileReader();
            reader.onload = () => {
                const binaryData = reader.result;
                //若存在exif，则需要再read一次exifBinaryData
                if (imageDataMap['has_source_exif'] == true){
                    var analyzer = new JpegAnalyzer.JpegAnalyzer(binaryData,imageDataMap['exif_photo_binary'])
                    analyzer.set_image_name(imageDataMap.name);
                    this.start_draw_canvas(newFile,analyzer,config);
                    return
                }
                var analyzer = new JpegAnalyzer.JpegAnalyzer(binaryData)
                if (analyzer.exif == null){
                    analyzer.set_image_name(newFile.name);
                    this.start_draw_canvas(newFile,analyzer,config);
                }else{
                    analyzer.set_image_name(newFile.name);
                    this.start_draw_canvas(newFile,analyzer,config);
                }
            }
            console.log(newFile)
            reader.readAsArrayBuffer(newFile.file);
        });

        let allConfig = "";
        fetch("/static/your_photo_border_config.json").then(response => {
            response.text().then(data => {
                this.$data.allConfig = JSON.parse(data);
            })
        })

        return {
            canvasId: "photo_canvas",
            previewImgId: "image_preview",
            insertPhoto,
            printPhotoData,
            previewImgWidth: 300,
            previewImgHeight: 400,
            downloadFilename: '',
            allConfig,
        }
    },
    methods: {

        // 自定义代码
         start_draw_canvas: async function(imageFile,analyzer,config){
            const canvasElement = document.getElementById(this.canvasId);
            const imageElement = document.getElementById(this.previewImgId);
            test_canvas(canvasElement,imageFile,analyzer,config,function callback(){
                this.previewImgHeight=1000;
                imageElement.src = canvasElement.toDataURL("image/jpeg",0.1)
                this.downloadFilename = analyzer.get_image_name()
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

    },

}
</script>