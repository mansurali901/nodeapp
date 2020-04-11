<template functional>
  <div>
    {{props.data.length}}
    <table class="table">
      <thead>
        <th v-for="(col, idx) in props.columns" :key="idx">{{col.label}}</th>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in props.data" :key="ridx">
          <td v-for="(col, cidx) in props.columns" :key="ridx+ cidx">{{row[col.data]}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>