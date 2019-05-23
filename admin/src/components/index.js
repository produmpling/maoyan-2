import Vue from 'vue';
import NoRecord from './common/no-record';

const components = [NoRecord];

const install = (v) => {
  components.map(component => v.component(component.name, component));
};

if (typeof window !== 'undefined') {
  install(Vue);
}
