import { defineStore } from "pinia";

const PhotoDataStore = defineStore('PhotoData',{
    state: () =>({
        insertphotoData: {},
        printPhotoData: {}
    }),
    actions: {
        printPhoto(printPhotoData){
            this.printPhotoData = printPhotoData
        },
        insertPhoto(insertphotoData){
            this.insertphotoData = insertphotoData
        }
    }
})
export default PhotoDataStore