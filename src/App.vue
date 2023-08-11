<script setup>

import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import PhotoContainer from './components/PhotoContainer.vue'
import PhotoList from './components/PhotoList.vue';
</script>

<template>
  <header>
    <a-layout style="height: 400px;">
      <a-layout-header>
        <HelloWorld msg="You did it!" />
        
        
      </a-layout-header>
      <a-layout>
        <a-layout-sider style="width: 500px;">
          <PhotoList />
        </a-layout-sider>
        <a-layout-content>
          <PhotoContainer />
        </a-layout-content>
      </a-layout>
      <a-layout-footer>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </a-layout-footer>
    </a-layout>
    <div class="wrapper">
      
      
      

    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
