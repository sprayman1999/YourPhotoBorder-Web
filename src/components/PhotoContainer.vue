<template>
    <div>
        <file-upload
            ref="upload"
            :entensions="['jpeg','jpg','png']"
            :drop="true"
            :maximum="999"
            :multiple="true"
            @input-file="inputFile"
        >
            <a-layout>
                <a-layout-content>
                    <a-image :id="previewImgId" width="400" height="300" fit="fill">
                    </a-image>
                </a-layout-content>
                <a-layout-content>
                    <canvas :id="canvasId" style="display: none;" ></canvas>

                </a-layout-content>
                <a-layout-footer>
                <a-button type="primary">开始上传</a-button>
                </a-layout-footer>
            </a-layout>
        </file-upload>
    </div>
</template>
<script>
import FileUpload from "vue-upload-component";
import JpegAnalyzer from "../common/analyzers/JpegAnalyzer";
import test_canvas from "../common/container/Container"

export default{
    data(){
        return {
            canvasId: "photo_canvas",
            previewImgId: "image_preview"
        }
    },
    methods: {
        // 自定义代码
         start_draw_canvas: async function(imageFile,analyzer){
            const canvasElement = document.getElementById(this.canvasId);
            const imageElement = document.getElementById(this.previewImgId);
            const configResponse = await fetch("/static/configs/default.json")
            const configContent = await configResponse.text()
            const config = JSON.parse(configContent)
            test_canvas(canvasElement,imageFile,analyzer,config,function callback(){
                imageElement.src = canvasElement.toDataURL()
            });
            
            
        },
        // 事件代码
        inputFile: function(newFile,oldFile){
            console.log(newFile.file)
            const reader = new FileReader();
            reader.onload = () => {
                const binaryData = reader.result;
                var analyzer = new JpegAnalyzer.JpegAnalyzer(binaryData)
                analyzer.setImageName(newFile.name);
                console.log(analyzer);
                this.start_draw_canvas(newFile,analyzer);
            }
            reader.readAsArrayBuffer(newFile.file);
        }
    }
}
</script>../common/Analyzers/JpegAnalyzer