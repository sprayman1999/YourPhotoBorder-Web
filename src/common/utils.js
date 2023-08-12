function get_basic_camera_config_by_analyzer(analyzer,all_config){
    for(var i in all_config['rules']){
        if(analyzer.get_camera_maker().toLowerCase().trim().indexOf(all_config['rules'][i]['camera_company'].toLowerCase().trim()) != -1){
            return all_config['rules'][i]
        }
    }
    return null
}

export default {get_basic_camera_config_by_analyzer}