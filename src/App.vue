<template>
  <div id="app" class="grid grid-cols-1 grid-flow-rows bg-red-200 h-screen grid-rows-app">
    <div id="nav" class="p-3 shadow bg-red-600 grid grid-rows-1 grid-cols-none auto-cols-min grid-flow-col gap-x-1">
      <router-link class="p-2 border border-red-400 hover:border-transparent hover:bg-white" to="/">Home</router-link>
      <router-link class="p-2 border border-red-400 hover:border-transparent hover:bg-white" to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>