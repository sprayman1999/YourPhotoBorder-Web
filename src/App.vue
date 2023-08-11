<script setup>

import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import PhotoContainer from './components/PhotoContainer.vue'
import PhotoList from './components/PhotoList.vue';
</script>

<template>
  

  <div class="">
    <a-layout>
      <a-layout-header>
        <a-space direction="vertical" :size="24" style="display: block;">
          <a-row class="grid-demo" style="height: 50px;">
            <a-col :span="6">
              <span>
                <h3 style="margin: 12px;">YourPhotoBorder</h3>
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
            <a-col :span="16" class="left-side">
              <div><PhotoList /></div>
            </a-col>
            <a-col :span="8" class="right-side">
              <div><PhotoContainer /></div>
            </a-col>
          </a-row>
        </a-space>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
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