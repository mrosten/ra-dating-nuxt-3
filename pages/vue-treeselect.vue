<template>
    <div>
      <h1>Tree Select Example</h1>
      <treeselect
        v-model="selectedItems"
        :multiple="true"
        :options="treeData"
        placeholder="Select items"
      ></treeselect>
      <div v-if="selectedItems.length > 0">
        <h2>Selected Items:</h2>
        <ul>
          <li v-for="item in selectedItems" :key="item.id">
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    components: {
      Treeselect,
    },
    data() {
      return {
        selectedItems: [],
        treeData: [
          {
            id: 1,
            label: 'Option 1',
            children: [
              {
                id: 2,
                label: 'Suboption 1',
              },
              {
                id: 3,
                label: 'Suboption 2',
              },
            ],
          },
          {
            id: 4,
            label: 'Option 2',
            children: [
              {
                id: 5,
                label: 'Suboption 3',
              },
              {
                id: 6,
                label: 'Suboption 4',
              },
            ],
          },
        ],
      };
    },
  };
  </script>
  