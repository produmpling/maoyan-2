<template>
  <el-container>
    <!-- Content will be placed here -->
    <slot></slot>
  </el-container>
</template>

<script>
  /* ============
   * Minimal Layout
   * ============
   *
   * Used for the register and login pages.
   *
   * Layouts are used to store a lot of shared code.
   * This way the app stays clean.
   */

  export default {
    /**
     * The name of the layout.
     */
    name: 'minimal-layout',
  };
</script>
