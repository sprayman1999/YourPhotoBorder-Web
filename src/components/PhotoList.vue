<template>
    <div>
        <div>
            <a-list  
                style="height: 413px;"
            >
                <a-list-item v-for="(item,idx) in photoList" :key="idx">
                  <a-list-item-meta
                    :title='item.title'
                    :description="item.subject"
                    
                  >
                      <template #avatar>
                          <a-avatar shape="square">
                              <img
                                  alt="avatar"
                                  :src="item.photo_url"
                              />
                          </a-avatar>
                      </template>
                  </a-list-item-meta>
                  <template #actions>
                      <icon-printer @click="onPrintPhotoButtonClicked(item)"/>
                      <icon-image v-show="item.has_source_exif"/>
                      <icon-delete @click="onDeletePhotoButtonClicked(item)"/>
                      <icon-download @click="onDownloadPhotoButtonClicked(item)"/>
                  </template>
                  <canvas :id="item.canvas_id" style="display: none;"></canvas>
                </a-list-item>
            </a-list>
        </div>
    </div>
  </template>
<script>
import PhotoDataStore from "../common/stores/PhotoDataStore"
import JpegAnalyzer from "../common/analyzers/JpegAnalyzer";
import { computed,watch,ref  } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import test_canvas from "../common/container/Container";
import Utils from "../common/Utils";
export default{
    data(){
        fetch("/static/your_photo_border_config.json").then(response => {
            response.text().then(data => {
                this.$data.allConfig = JSON.parse(data);
            })
        })


        const photoDataStore = PhotoDataStore();
        const insertPhotoData = computed(() => photoDataStore.insertPhotoData);
        const sendPhotoConfigData = computed(() => photoDataStore.sendPhotoConfigData);
        let photoList = ref([])
        let photoConfig = ref({"is_custom_config":false,'config':null})
        // 接受配置组件发来的信息
        watch(sendPhotoConfigData, (newVal, oldVal) => {
            console.log("receive",newVal)
            if(newVal['is_custom_config'] == true){
                this.$data.photoConfig = {"is_custom_config":true,'config':JSON.parse(newVal['config_content'])}
            }else{
                this.$data.photoConfig = {"is_custom_config":true,'config':null}
            }
        });

        //
        watch(insertPhotoData, (newVal, oldVal) => {
            let newFile = newVal['photo_file']
            const reader = new FileReader();
            reader.onload = () => {
                const binaryData = reader.result;
                var analyzer = new JpegAnalyzer.JpegAnalyzer(binaryData)
                analyzer.set_image_name(newFile.name);
                // 说明有重名图片，最新传入图片的exif将作为旧图片的原始数据
                for(var i = 0;i<photoList._value.length;i++){
                    if (analyzer.get_image_name().toLowerCase() == photoList._value[i]['title'].toLowerCase()){
                        photoList._value[i]['has_source_exif'] = true
                        photoList._value[i]['source_exif_file'] = newFile
                        photoList._value[i]['subject'] = analyzer.get_camera_model() + " + " + analyzer.get_camera_lens()
                        photoList._value[i]['exif_photo_binary'] = binaryData
                        return
                    }
                }
                if(analyzer.exif == null){
                    photoList._value.push({
                    "title": analyzer.get_image_name(),
                    "filename": analyzer.get_image_name(),
                    "subject": "The exif not exists",
                    "photo_url": window.URL.createObjectURL(newFile.file),
                    "photo_file": newFile,
                    "has_source_exif": false,
                    "source_exif_file":null,
                    "canvas_id": uuidv4(),
                    "photo_binary": binaryData,
                    "exif_photo_binary": null
                })
                }else{
                    photoList._value.push({
                    "title": analyzer.get_image_name(),
                    "filename": analyzer.get_image_name(),
                    "subject": analyzer.get_camera_model() + " + " + analyzer.get_camera_lens(),
                    "photo_url": window.URL.createObjectURL(newFile.file),
                    "photo_file": newFile,
                    "has_source_exif": false,
                    "source_exif_file":null,
                    "canvas_id": uuidv4(),
                    "photo_binary": binaryData,
                    "exif_photo_binary": null
                    })
                }

            }
            reader.readAsArrayBuffer(newFile.file);
        });
        function printPhoto(data){
            photoDataStore.printPhoto(data)
        }

        return {
            allConfig: "",
            photoList,
            printPhoto,
            photoConfig
        }
    },
    methods:{
        onPrintPhotoButtonClicked: async function(item){
            let configJson = this.photoConfig['config']
            console.log(configJson)
            if (this.photoConfig['is_custom_config'] == false){
                let analyzer = (item['has_source_exif'] == true) ? 
                    new JpegAnalyzer.JpegAnalyzer(item['photo_binary'],item['exif_photo_binary']):
                    new JpegAnalyzer.JpegAnalyzer(item['photo_binary'])
                let basicCameraConfig = Utils.get_basic_camera_config_by_analyzer(
                    analyzer,
                    this.allConfig
                )
                let configResponse = (analyzer.get_image_orientation() == 1 && analyzer.get_width() > analyzer.get_height()) ?
                    await fetch(basicCameraConfig['camera_horizontal_config']):
                    await fetch(basicCameraConfig['camera_rotated_config']);
                let configContent = await configResponse.text()
                configJson = JSON.parse(configContent)
            }
            this.printPhoto({"image_data": item,"config":configJson})
        },
        onDeletePhotoButtonClicked: function(item){
            for(var i = 0;i<this.photoList.length;i++){
                if (item.title == this.photoList[i]['title']){
                    this.photoList.splice(i,1);
                    break
                }
            }
        },
        onDownloadPhotoButtonClicked:async function(item){
            let canvasElement = document.getElementById(item['canvas_id']);
            let imageFile = item.photo_file

            let analyzer = (item['has_source_exif'] == true) ? 
                new JpegAnalyzer.JpegAnalyzer(item['photo_binary'],item['exif_photo_binary']):
                new JpegAnalyzer.JpegAnalyzer(item['photo_binary'])
                
            analyzer.set_image_name(item['title'])

            let basicCameraConfig = Utils.get_basic_camera_config_by_analyzer(
                analyzer,
                this.allConfig
            )
            let configResponse = (analyzer.get_image_orientation() == 1 && analyzer.get_width() > analyzer.get_height()) ?
                await fetch(basicCameraConfig['camera_horizontal_config']):
                await fetch(basicCameraConfig['camera_rotated_config']);
            let configContent = await configResponse.text()
            let configJson = JSON.parse(configContent)


            test_canvas(canvasElement,imageFile,analyzer,configJson,function callback(){
                var dataURL = canvasElement.toDataURL("image/jpeg",1.0);

                // 创建一个链接，设置下载属性
                var link = document.createElement("a");
                link.href = dataURL;
                link.download = analyzer.get_image_name(); // 下载文件名
                link.click();
            });
        }
    },
    setup(){
    }
}
</script>