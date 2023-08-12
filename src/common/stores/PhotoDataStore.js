import { defineStore } from "pinia";

const PhotoDataStore = defineStore('PhotoData',{
    state: () =>({
        insertPhotoData: {},
        printPhotoData: {},
        sendPhotoConfigData:{},
        requestPhotoConfigData:{}
    }),
    actions: {
        /*
        printPhoto argv
            {
                'photo_file': xx
                'has_source_exif': true|false
                'source_exif_file': xx,
                'exif_photo_binary': xx
            }
        */
        printPhoto(printPhotoData){
            this.printPhotoData = printPhotoData
        },


        /*
        insertPhoto argv
            {'photo_file':newFile}
        */
        insertPhoto(insertPhotoData){
            this.insertPhotoData = insertPhotoData
        },

        /*
        sendPhotoConfig argv
            {
                'config_content':"xx"，
                'is_custom_config': true|false
            }
        */
        sendPhotoConfig(sendPhotoConfigData){
            this.sendPhotoConfigData = sendPhotoConfigData
        },
        requestPhotoConfig(requestPhotoConfigData){
            this.requestPhotoConfigData = requestPhotoConfigData
        }
    }
})
export default PhotoDataStore