<template functional>
  <tr>
    <td>
      <div class="field">
        <input v-if="!props.nocheck"
          type="checkbox"
          class="is-checkradio is-link check-only"
          value="1"
          :checked="props.org.checked"
          :id="`action-org-row${props.id}`"
          @change="(e)=>data.on.checked(props.org, e.target.checked)"
        >
        <label :for="`action-org-row${props.id}`"></label>
      </div>
    </td>
    <td><router-link :to="props.path" append>{{props.org.name}}</router-link></td>
    <td>{{props.org.description}}</td>
    <td>{{props.org.city}} {{props.org.state}}</td>
    <td>{{props.org.status}}</td>
  </tr>
</template>
