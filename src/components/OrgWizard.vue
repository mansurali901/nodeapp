<template>
  <div class="modal" :class="{'is-active': show}">
    <div class="modal-background"></div>
    
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{title}}</p>
        <div class="is-pulled-right has-text-grey-light">
          <small>* indicates required field</small>
        </div>
      </header>

      <section class="modal-card-body">
        <div v-if="step == 1" @change="validStep1">
          <div v-if="org.id">
            <small>
              System-Generated Organization ID:
            </small>
            <input 
              v-if="org.id"
              v-model="org.id"
              class="input is-small"
              type="text"
              disabled
            >
          </div>
          <h3>Organization Details:</h3>
          <!-- Name -->
          <p class="help is-danger" v-if="!detailValid">Name required</p>
          <input
            type="input"
            class="input"
            name="name"
            minlength="3"
            maxlength="100"
            required
            v-model="org.name"
            placeholder="Name *"
            autofocus
          >
          <!-- Description -->
          <input
            type="input"
            class="input"
            name="description"
            minlength="3"
            maxlength="100"
            v-model="org.description"
            placeholder="Description"
          >
          <!-- Location -->
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
          >
          <input
            type="input"
            class="input"
            name="address2"
            minlength="3"
            maxlength="50"
            v-model="org.address2"
            placeholder="Address 2"
          >
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
              >
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
              >
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
              >
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
          >
        </div>

        <div v-if="step == 2" @change="validStep2">
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
          >
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
              >
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
              >
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
          >
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
              >
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
              >
            </div>
          </div>
        </div>

      </section>

      <footer class="modal-card-foot">
        <button
          :class="{'is-hidden': step==1}"
          class="button is-link is-rounded"
          @click="handleBackAction"
        >Back</button>
        <button
          :class="[{'is-saving': saving},(step == totalSteps) ? 'is-primary' : 'is-link']"
          class="button is-rounded"
          :disabled="!isValid()"
          @click="handleForwardAction"
        >{{btnTitle}}</button>
        <a class="is-link" @click="handleCancel">Cancel</a>
      </footer>
    </div>
    
  </div>
</template>

<script>

import ModalBase from "./ModalBase";

export default {
  components: {
    ModalBase
  },
  props: ["show", "vorg"],
  data: function() {
    return {
      init: false,
      org: {},
      // wizard
      step: 1,
      totalSteps: 2,
      saving: false,
      // form validation bools
      detailValid: false,
      locationValid: false,
      contactValid: false
    };
  },
  computed: {
    title() {
      return this.org.id ? "Edit Organization" : "Add Organization";
    },
    btnTitle() {
      if (this.step == this.totalSteps) {
        return "Save";
      }
      return "Next";
    }
  },
  updated: function() {
    if (this.vorg && this.org.id != this.vorg.id) {
      this.org = { ...this.vorg };
    }
  },
  methods: {
    reset() {
      this.step = 1;
      this.org = {};
    },
    handleForwardAction() {
      if (this.step < this.totalSteps) {
        this.step += 1;
        this.isValid();
      } else {
        this.$emit("save", this.org);
        this.reset();
      }
    },
    handleCancel() {
      this.reset();
      this.$emit("cancel");
    },
    handleBackAction() {
      this.step -= 1;
    },
    validStep1() {
      this.detailValid = this.org.name;
      this.locationValid =
        this.org.address1 &&
        this.org.city &&
        this.org.state &&
        this.org.zipcode &&
        this.org.country;
      return this.detailValid && this.locationValid;
    },
    validStep2() {
      this.contactValid =
        this.org.primaryContact &&
        this.org.primaryPhone &&
        this.org.primaryEmail;
      return this.contactValid;
    },
    isValid() {
      switch (this.step) {
        case 1:
          return this.validStep1();
        case 2:
          return this.validStep2();
      }
    },
    handleCancel(e) {
      this.reset();
      this.$emit("cancel");
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
