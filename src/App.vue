<script setup>

import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import PhotoContainer from './components/PhotoContainer.vue'
import PhotoList from './components/PhotoList.vue';
import ConfigExplorer from './components/ConfigExplorer.vue';
</script>

<template>
  <div class="">
    <a-layout>
      <a-layout-header>
        <a-space direction="vertical" :size="24" style="display: block;">
          <a-row class="grid-demo" style="height: 50px;">
            <a-col :span="6">
              <span>
                <h2 style="margin: 12px;">
                  YourPhotoBorder
                  <a-link href="https://github.com/sprayman1999/YourPhotoBorder-Web">
                    <icon-github />
                  </a-link>
                </h2>
              </span>
            </a-col>
            <a-col :span="18">
              <div></div>
            </a-col>
          </a-row>
        </a-space>
      </a-layout-header>
      <a-layout-content >
        <a-space direction="vertical" :size="24" style="display: block;">
          <a-row class="grid-demo">
            <a-col :span="8" class="left-side">
              <a-card
                class="card-demo"
                title="规则配置"
                hoverable
              >
                <div><ConfigExplorer /></div>
              </a-card>
              
            </a-col>
            <a-col :span="10" class="left-side">
              <a-card
                class="card-demo"
                title="图片列表"
                hoverable
              >
                <div><PhotoList /></div>
              </a-card>
            </a-col>
            <a-col :span="6" class="right-side">
              <a-card
                class="card-demo"
                title="将图片拖拽至下放进行导入"
                hoverable
              >
                <div><PhotoContainer /></div>
              </a-card>
            </a-col>
          </a-row>
        </a-space>
      </a-layout-content>
      <a-layout-footer></a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.card-demo {
  transition-property: all;
  margin: 5px;
}
.card-demo:hover {
  transform: translateY(-4px);
}
.layout-demo :deep(.arco-layout-header),
.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-sider-children),
.layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}


.layout-demo :deep(.arco-layout-header),
.layout-demo :deep(.arco-layout-footer) {
  height: 64px;
  background-color: var(--color-primary-light-4);
}

.layout-demo :deep(.arco-layout-sider) {
  width: 206px;
  background-color: var(--color-primary-light-3);
}

.layout-demo :deep(.arco-layout-content) {
  background-color: rgb(var(--arcoblue-6));
}

</style>