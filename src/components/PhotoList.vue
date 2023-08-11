<template>
    <a-list>
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
        </template>
      </a-list-item>
    </a-list>
  </template>
<script>
import PhotoDataStore from "../common/stores/PhotoData"
import JpegAnalyzer from "../common/analyzers/JpegAnalyzer";
import { computed,watch,ref  } from 'vue';

export default{
    data(){
        return {
        }
    },
    methods:{
        test: function(){
            console.log(this.photoList)
        },
        onPrintPhotoButtonClicked: function(item){
            this.printPhoto(item)
        },
        onDeletePhotoButtonClicked: function(item){
            for(var i = 0;i<this.photoList.length;i++){
                console.log()
                if (item.title == this.photoList[i]['title']){
                    this.photoList.splice(i,1);
                    break
                }
            }
        }
    },
    setup(){
        const photoDataStore = PhotoDataStore();
        const receivePhoto = computed(() => photoDataStore.insertphotoData);
        const photoList = ref([])
        watch(receivePhoto, (newVal, oldVal) => {
            let newFile = newVal['photo_file']
            const reader = new FileReader();
            reader.onload = () => {
                const binaryData = reader.result;
                var analyzer = new JpegAnalyzer.JpegAnalyzer(binaryData)
                analyzer.set_image_name(newFile.name);
                for(var i = 0;i<photoList._value.length;i++){
                    if (analyzer.get_image_name() == photoList._value[i]['title']){
                        photoList._value[i]['has_source_exif'] = true
                        photoList._value[i]['source_exif_file'] = newFile
                        photoList._value[i]['subject'] = analyzer.get_camera_model() + " + " + analyzer.get_camera_lens()
                        return
                    }
                }
                if(analyzer.exif == null){
                    photoList._value.push({
                    "title": analyzer.get_image_name(),
                    "subject": "The exif not exists",
                    "photo_url": window.URL.createObjectURL(newFile.file),
                    "photo_file": newFile,
                    "has_source_exif": false,
                    "source_exif_file":null
                })
                }else{
                    photoList._value.push({
                    "title": analyzer.get_image_name(),
                    "subject": analyzer.get_camera_model() + " + " + analyzer.get_camera_lens(),
                    "photo_url": window.URL.createObjectURL(newFile.file),
                    "photo_file": newFile,
                    "has_source_exif": false,
                    "source_exif_file":null
                })
                }

            }
            reader.readAsArrayBuffer(newFile.file);
        });
        function printPhoto(data){
            photoDataStore.printPhoto(data)
        }
        return {
            photoList,
            printPhoto
        }
    }
}
</script>