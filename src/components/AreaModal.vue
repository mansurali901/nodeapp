<template>
  <modal-base :title="title" :show="show" @cancel="handleCancel" @save="handleSave">
    <div class="field">
      <div class="control">
        <input
          type="input"
          class="input"
          maxlength="100"
          minlength="3"
          required
          name="name"
          v-model="area.name"
          placeholder="Area Name"
        >
      </div>
      <p class="help is-danger" v-if="errorname">Name is required</p>
    </div>
    <div class="field">
      <div class="control">
        <input
          type="input"
          class="input"
          maxlength="400"
          minlength="10"
          required
          name="address"
          v-model="area.address"
          placeholder="street city, state, zip"
        >
      </div>
      <p class="help is-info">
        Address is used to put indoor maps on a map as well as be the starting point for outdoor.
        <br>Not entering an address will place the outdoor map at the centroid for the US.
      </p>
    </div>
    <div class="group" v-if="area.id">{{area.type}}</div>
    <div class="group" v-if="!area.id">
      <div class="field">
        <div class="control">
          <label class="radio">
            <input type="radio" name="type" v-model="area.type" :value="AREA_INDOOR">
            Indoor
          </label>
          <label class="radio">
            <input type="radio" name="type" v-model="area.type" :value="AREA_OUTDOOR">
            Outdoor
          </label>
          <label class="radio">
            <input type="radio" name="type" v-model="area.type" :value="AREA_BASIC">
            Basic
          </label>
        </div>
        <p class="help is-danger" v-if="errortype">Type is required</p>
      </div>

      <div class="field">
        <div class="file is-info has-name" v-if="(area.type == 'indoor')">
          <label class="file-label">
            <input
              class="file-input"
              ref="fileInput"
              type="file"
              name="file"
              @change="handleChange"
            >
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload"></i>
              </span>
              <span class="file-label">Choose file…</span>
            </span>
            <span class="file-name">{{area.file ? area.file.name : 'Filename shows here'}}</span>
          </label>
        </div>
        <p
          class="help is-info"
          v-if="(area.type=='indoor')"
        >File is required, must be a PNG and be less than 5MB</p>
      </div>
      <p class="help is-danger" v-if="errorfile">File is required</p>
      <p class="help is-danger" v-if="fileWrong">File must be a PNG</p>
      <p class="help is-danger" v-if="errorFileSize">File size is bigger than 5MB</p>
    </div>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase";
import constants from "@/constants";

const MAX_SIZE = 5242880;

export default {
  components: {
    ModalBase
  },
  props: ["show", "varea"],
  data() {
    return {
      AREA_INDOOR: constants.AREA_INDOOR,
      AREA_OUTDOOR: constants.AREA_OUTDOOR,
      AREA_BASIC: constants.AREA_BASIC,
      area: {},
      oarea: {},
      errorname: false,
      errorfile: false,
      errortype: false,
      fileWrong: false,
      errorFileSize: false
    };
  },
  updated() {
    if (this.varea && this.varea.id != this.area.id) {
      this.area = { ...this.varea };
    }
  },
  computed: {
    title() {
      return this.area.id ? "Edit Area" : "Add Area";
    },
    clearit() {
      this.show && this.reset();
      return "cleared";
    },
    Xarea: {
      get() {
        return this.area;
      },
      set(a) {
        this.$emit("update:area", a);
      }
    }
  },
  methods: {
    reset() {
      let input = this.$refs.fileInput;
      if (input) {
        input.value = null;
      }
      this.area = {};
      this.oarea = {};
      this.errorfile = false;
      this.errorname = false;
      this.errortype = false;
      this.saving = false;
    },
    handleCancel() {
      this.reset();
      this.$emit("cancel");
    },
    handleChange(e) {
      let f = e.target.files[0];
      this.errorfile = false;
      this.fileWrong = false;
      this.errorFileSize = false;
      let a = { ...this.area };
      if (f.type !== "image/png") {
        this.fileWrong = true;
      }
      if (f.size >= MAX_SIZE) {
        this.errorFileSize = true;
      }
      if (this.fileWrong || this.errorFileSize) {
        return;
      }
      a.file = f;
      a.file.preview = URL.createObjectURL(f);
      this.area = a;
    },
    handleSave() {
      if (this.area.type === this.AREA_INDOOR) {
        this.errorfile = !this.area.file;
      }
      this.errorname = !this.area.name;
      this.errortype = !this.area.id && !this.area.type;
      if (this.errorname || this.errorfile || this.errortype) {
        return;
      }
      this.$emit("save", this.area);
      this.reset();
    }
  }
};
</script>