<template>
  <div>
    <!--global-header -->
    <div class="global-nav min-h-48px">
      <div>
        <div></div>
        <div>
          <div>独立应用</div>
          <span>
            <ExclamationCircleOutlined />
          </span>
          <span>
            <StarOutlined />
          </span>
        </div>
      </div>

    </div>
  </div>

  <!-- <Button type="primary">Primary Button</Button> -->
</template>

<script setup lang="ts">
import {
  ExclamationCircleOutlined,
  StarOutlined
} from '@ant-design/icons-vue';
import { Button } from "ant-design-vue";
</script>

<style scoped></style>
