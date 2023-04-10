<template>
  <div>
    <Modal v-model:visible="visible" title="Create a new collection" ok-text="Create" cancel-text="Cancel" @ok="onOk">
      <a-form ref="formRef" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="Activity name" v-bind="validateInfos.name">
          <a-input v-model:value="modelRef.name" />
        </a-form-item>
        <a-form-item label="Activity zone" v-bind="validateInfos.region">
          <a-select v-model:value="modelRef.region" placeholder="please select your zone">
            <a-select-option value="shanghai">Zone one</a-select-option>
            <a-select-option value="beijing">Zone two</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Activity type" v-bind="validateInfos.type">
          <a-checkbox-group v-model:value="modelRef.type">
            <a-checkbox value="1" name="type">Online</a-checkbox>
            <a-checkbox value="2" name="type">Promotion</a-checkbox>
            <a-checkbox value="3" name="type">Offline</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
  import { defineComponent, reactive, ref, toRaw } from 'vue';
  import { Form, Modal } from 'ant-design-vue';

  import type { FormInstance } from 'ant-design-vue';

  interface Values {
    title: string;
    description: string;
    modifier: string;
  }
  const useForm = Form.useForm;

  const formRef = ref<FormInstance>();
  const visible = ref(false);
  const modelRef = reactive({
    name: '',
    region: undefined,
    type: [],
  });
  const rulesRef = reactive({
    name: [
      {
        required: true,
        message: 'Please input name',
      },
    ],
    region: [
      {
        required: true,
        message: 'Please select region',
      },
    ],
    type: [
      {
        required: true,
        message: 'Please select type',
        type: 'array',
      },
    ],
  });
  const labelCol = { span: 4 };
  const wrapperCol = { span: 14 };
  const { validateInfos, validate } = useForm(modelRef, rulesRef, {
    onValidate: (...args) => console.log(...args),
  });
  const onOk = () => {
    validate()
      .then(() => {
        console.log(toRaw(modelRef));
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };
</script>

<style scoped></style>
