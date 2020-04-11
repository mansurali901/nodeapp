<template>
  <modal-base :title="title" :show="show" @cancel="handleCancel" @save="handleSave">
    <div v-if="org.id">
      <small>System-Generated Organization ID:</small>
      <input v-if="org.id" v-model="org.id" class="input is-small" type="text" disabled />
    </div>
    <h3>Organization Details:</h3>
    <!-- Name -->
    <p class="help is-danger" v-if="!detailValid">Name required</p>
    <input
      @change="valid"
      type="input"
      class="input"
      name="name"
      minlength="3"
      maxlength="100"
      required
      v-model="org.name"
      placeholder="Name *"
      autofocus
    />
    <!-- Description -->
    <input
      type="input"
      class="input"
      name="description"
      minlength="3"
      maxlength="100"
      v-model="org.description"
      placeholder="Description"
    />
    <!-- Location -->
    <div @change="valid">
      <h3>Organization Location:</h3>
      <p class="help is-danger" v-if="!locationValid">Location required</p>
      <input
        type="input"
        class="input"
        name="address1"
        minlength="3"
        maxlength="50"
        v-model="org.address1"
        placeholder="Address 1 *"
      />
      <input
        type="input"
        class="input"
        name="address2"
        minlength="3"
        maxlength="50"
        v-model="org.address2"
        placeholder="Address 2"
      />
      <div class="columns">
        <div class="column">
          <input
            type="input"
            class="input"
            name="city"
            minlength="3"
            maxlength="50"
            v-model="org.city"
            placeholder="City *"
          />
        </div>
        <div class="column">
          <input
            type="input"
            class="input"
            name="state"
            minlength="3"
            maxlength="50"
            v-model="org.state"
            placeholder="State *"
          />
        </div>
        <div class="column">
          <input
            type="input"
            class="input"
            name="zipcode"
            minlength="3"
            maxlength="50"
            v-model="org.zipcode"
            placeholder="Zip Code *"
          />
        </div>
      </div>
      <input
        type="input"
        class="input"
        name="country"
        minlength="3"
        maxlength="50"
        v-model="org.country"
        placeholder="Country *"
      />
    </div>

    <div @change="valid">
      <!-- primary contact -->
      <!-- first name, last name, email, phone -->
      <h3>Primary Contact:</h3>
      <p class="help is-danger" v-if="!contactValid">Primary contact required</p>
      <input
        type="input"
        class="input"
        name="primaryContact"
        minlength="3"
        maxlength="100"
        required
        v-model="org.primaryContact"
        placeholder="Full Name *"
      />
      <div class="columns">
        <div class="column">
          <input
            type="input"
            class="input"
            name="primaryPhone"
            minlength="7"
            maxlength="15"
            required
            v-model="org.primaryPhone"
            placeholder="Phone *"
          />
        </div>
        <div class="column">
          <input
            type="email"
            class="input"
            name="primaryEmail"
            minlength="6"
            maxlength="100"
            required
            v-model="org.primaryEmail"
            placeholder="Email *"
          />
        </div>
      </div>
      <!-- technical contact -->
      <!-- first name, last name, email, phone -->
      <h3>Technical Contact:</h3>
      <input
        type="input"
        class="input"
        name="techContact"
        minlength="3"
        maxlength="100"
        v-model="org.techContact"
        placeholder="Full Name"
      />
      <div class="columns">
        <div class="column">
          <input
            type="input"
            class="input"
            name="techPhone"
            minlength="7"
            maxlength="15"
            v-model="org.techPhone"
            placeholder="Phone"
          />
        </div>
        <div class="column">
          <input
            type="email"
            class="input"
            name="techEmail"
            minlength="6"
            maxlength="100"
            v-model="org.techEmail"
            placeholder="Email"
          />
        </div>
      </div>
    </div>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase";

export default {
  props: ["show", "title", "org"],
  components: {
    ModalBase
  },
  data: function() {
    return {
      detailValid: false,
      locationValid: false,
      contactValid: false
    };
  },
  updated() {
    this.valid();
  },
  methods: {
    handleCancel(e) {
      this.$emit("cancel");
      this.reset();
    },
    handleSave(e) {
      if (this.detailValid && this.locationValid && this.contactValid) {
        this.$emit("save", this.org);
        this.reset();
      }
    },
    reset() {
      this.detailValid = false;
      this.locationValid = false;
      this.contactValid = false;
    },
    valid() {
      this.detailValid = this.org.name;
      this.locationValid =
        this.org.address1 &&
        this.org.city &&
        this.org.state &&
        this.org.zipcode &&
        this.org.country;
      this.contactValid =
        this.org.primaryContact &&
        this.org.primaryPhone &&
        this.org.primaryEmail;
    }
  }
};
</script>

<style lang="scss" scoped>
input,
a {
  margin: 5px 5px 5px 0px;
}
div.columns:not(:last-child) {
  margin-bottom: 0;
}
div.column {
  padding-bottom: 0;
}
</style>
