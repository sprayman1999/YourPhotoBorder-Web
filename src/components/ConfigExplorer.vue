<template>
    <div>
        <div style="padding-bottom: 5px;">
            <h3>自定义配置</h3>
            <a-textarea placeholder="Please enter something" style="height: 200px;" allow-clear v-model="configTextareaContent" @input="onConfigTextareaChanged"/>
        </div>
        <div style="padding-bottom: 5px;">
            <h3>自带默认配置</h3>
            <a-cascader :options="cascaderOptions" v-model="value" placeholder="Explore Config ..." @change="onCascaderChanged" />
        </div>

        <div>
            <h3 style="padding-bottom: 5px;">规则</h3>
            <a-row>
                <a-switch type="round" :default-checked="configSwitchValue" @change="onConfigSwitchChanged">
                    <template #checked>默认配置</template>
                    <template #unchecked>自定义配置</template>
                </a-switch>
                
            </a-row>
        </div>
    </div>

</template>
<script>
import { computed,watch,ref  } from 'vue';
import PhotoDataStore from "../common/stores/PhotoDataStore"

export default{
    setup(){
        const cascaderOptions = ref([]);
        const configTextareaContent = ref("")
        return {
            cascaderOptions,
            configTextareaContent,
            configSwitchValue: true,
            allConfig: {}
        }
    },
    data(){
        fetch("/static/your_photo_border_config.json").then(response => {
            response.text().then(data => {
                this.$data.allConfig = JSON.parse(data);
                this.cascaderOptions = this.allConfigToCascaderData(this.$data.allConfig)
            })
        })

        const photoDataStore = PhotoDataStore();
        function sendPhotoConfig(data){
            photoDataStore.sendPhotoConfig(data)
        }

        return {
            sendPhotoConfig
        }
    },
    methods: {
        sendPhotoConfigToPhotoList: function(){
            try {
                JSON.parse(this.configTextareaContent) // 如果不是json字符串就会抛异常
                this.sendPhotoConfig({
                    "is_custom_config":!this.configSwitchValue,
                    "config_content":this.configTextareaContent
                })
                console.log("json success!")
            } catch(e) {
                this.sendPhotoConfig({
                    "is_custom_config":false,
                    "config_content":null
                })
                console.log("json failed!")
            }

        },
        onCascaderChanged: function(configPath){
            fetch(configPath).then(response => {
                response.text().then(data => {
                    this.configTextareaContent = data
                    this.sendPhotoConfigToPhotoList()
                })
            })
        },
        onConfigSwitchChanged: function(switchValue){
            this.configSwitchValue = switchValue
            this.sendPhotoConfigToPhotoList()
        },
        onConfigTextareaChanged: function(){
            console.log(this.configTextareaContent)
            this.sendPhotoConfigToPhotoList()
        },
        allConfigToCascaderData: function(all_config){
            var newCascaderOptions = []
            for(var i in all_config['rules']){
                newCascaderOptions.push({
                    value: all_config['rules'][i]['camera_company'],
                    label: all_config['rules'][i]['camera_company'],
                    children: [
                        {
                            value: all_config['rules'][i]['camera_horizontal_config'],
                            label: all_config['rules'][i]['camera_company'] + '_horizontal',
                        },
                        {
                            value: all_config['rules'][i]['camera_rotated_config'],
                            label: all_config['rules'][i]['camera_company'] + '_rotated',
                        },
                    ]
                })
            }
            return newCascaderOptions
        }
    }
}
</script>