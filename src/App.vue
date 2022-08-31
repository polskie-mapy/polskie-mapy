<template>
  <div
    id="app"
    class="grid grid-cols-1 grid-flow-rows bg-app h-screen overflow-hidden"
  >
    <router-view />
    <portal name="modal" />
  </div>
</template>